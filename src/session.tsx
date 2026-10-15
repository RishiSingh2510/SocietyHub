import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "./lib/supabase";

export type Role = "admin" | "member";
type Profile = {
  name: string;
  email: string;
  role: Role;
  flat: string;
  society: string;
  maintenance: number;
};
export type SignUpInput = {
  role: Role;
  name: string;
  email: string;
  password: string;
  society?: string;
};
type Session = Profile & {
  ready: boolean;
  signedIn: boolean;
  signIn: (role: Role, email: string, pw: string) => Promise<string | null>;
  signUp: (i: SignUpInput) => Promise<string | null>;
  signOut: () => Promise<void>;
};
// Unknown accounts get the lowest access (member, no flat).
const NONE: Profile = {
  name: "",
  email: "",
  role: "member",
  flat: "",
  society: "",
  maintenance: 3000,
};
const Ctx = createContext<Session>(null as unknown as Session);
export const useSession = () => useContext(Ctx);

// Supabase Auth + the user's profile (role, society, flat). Functions return an error/info message, or null on success.
export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [p, setP] = useState<Profile | null>(null);

  const loadProfile = async (id: string): Promise<Profile | null> => {
    const { data } = await supabase
      .from("profiles")
      .select(
        "name,email,role,society:societies(name,monthly_maintenance),member:members(name,flat)",
      )
      .eq("id", id)
      .single();

    const prof: Profile | null = data
      ? {
          name: data.name || data.member?.name || "",
          email: data.email ?? "",
          role: data.role,
          flat: data.member?.flat ?? "",
          society: data.society?.name ?? "",
          maintenance: Number(data.society?.monthly_maintenance ?? 3000),
        }
      : null;
    setP(prof);
    return prof;
  };
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) await loadProfile(data.session.user.id);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => {
      if (ev === "SIGNED_OUT") setP(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setP(null);
  };

  const signIn: Session["signIn"] = async (role, email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error || !data.user) return error?.message ?? "Login failed";
    const prof = await loadProfile(data.user.id);
    if (!prof) {
      await signOut();
      return "No profile found for this account.";
    }
    if (prof.role !== role) {
      await signOut();
      return role === "admin"
        ? "This is a member account. Use the Member tab to log in."
        : "This is an admin account. Use the Admin tab to log in.";
    }
    return null;
  };

  const signUp: Session["signUp"] = async ({
    role,
    name,
    email,
    password,
    society,
  }) => {
    if (role === "member") {
      const { data: ok, error: err } = await supabase.rpc("can_register", {
        p_email: email.trim(),
      });
      if (!ok)
        return "This email isn't registered for any flat, or the account is already active. Ask your admin to add your email under Members.";
    } else if (!society?.trim()) return "Enter your society name.";
    const meta =
      role === "admin" ? { name, society_name: society!.trim() } : { name };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: meta },
    });
    if (error) return error.message;
    if (!data.session || !data.user)
      return "Account created. Confirm your email, then log in.";
    await loadProfile(data.user.id);
    return null;
  };

  const v = p ?? NONE;
  return (
    <Ctx.Provider
      value={{ ready, signedIn: !!p, ...v, signIn, signUp, signOut }}
    >
      {children}
    </Ctx.Provider>
  );
}

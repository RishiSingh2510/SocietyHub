import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { supabase } from "./lib/supabase";
import { useSession } from "./session";
import {
  Db,
  Member,
  Collection,
  Expense,
  Complaint,
  ComplaintStatus,
} from "./types";

const EMPTY: Db = {
  society: "",
  members: [],
  collections: [],
  expenses: [],
  notices: [],
  complaints: [],
};
type Done = Promise<boolean>;
export type Api = {
  addMember: (m: Omit<Member, "id">) => Done;
  saveMember: (m: Member) => Done;
  deleteMember: (id: string) => Done;
  addCollection: (c: Omit<Collection, "id">) => Done;
  addCollections: (c: Omit<Collection, "id">[]) => Done;
  updateCollection: (id: string, p: Partial<Omit<Collection, "id">>) => Done;
  setPaid: (id: string) => Done;
  deleteCollection: (id: string) => Done;
  addExpense: (e: Omit<Expense, "id">) => Done;
  deleteExpense: (id: string) => Done;
  addNotice: (title: string, body: string) => Done;
  deleteNotice: (id: string) => Done;
  addComplaint: (title: string, details: string) => Done;
  setComplaintStatus: (id: string, s: ComplaintStatus) => Done;
};
type Ctx = { db: Db; loading: boolean; refresh: () => Promise<void>; api: Api };
const DbCtx = createContext<Ctx>(null as unknown as Ctx);
export const useDb = () => useContext(DbCtx);

// Loads data from Supabase (Row Level Security decides what each user can see) and exposes write actions.
export function DbProvider({ children }: { children: ReactNode }) {
  const { signedIn, flat, society } = useSession();
  const [db, setDb] = useState<Db>(EMPTY);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!signedIn) return;
    setLoading(true);
    const q = (t: string, col: string, asc = false) =>
      supabase.from(t).select("*").order(col, { ascending: asc });
    const [m, c, e, n, k] = await Promise.all([
      q("members", "flat", true),
      q("collections", "date"),
      q("expenses", "date"),
      q("notices", "created_at"),
      q("complaints", "created_at"),
    ]);
    const err = [m, c, e, n, k].find((r) => r.error)?.error;
    if (err) Alert.alert("Could not load data", err.message);
    setDb({
      society,
      members: (m.data ?? []) as Member[],
      collections: (c.data ?? []) as Collection[],
      expenses: (e.data ?? []) as Expense[],
      notices: (n.data ?? []) as Db["notices"],
      complaints: (k.data ?? []) as Complaint[],
    });
    setLoading(false);
  }, [signedIn, society]);
  useEffect(() => {
    if (signedIn) refresh();
    else setDb(EMPTY);
  }, [signedIn, flat]);

  const run = async (q: PromiseLike<{ error: { message: string } | null }>) => {
    const { error } = await q;
    if (error) {
      Alert.alert("Something went wrong", error.message);
      return false;
    }
    await refresh();
    return true;
  };
  const t = (n: string) => supabase.from(n);
  const api: Api = {
    addMember: (m) => run(t("members").insert(m)),
    saveMember: ({ id, ...m }) => run(t("members").update(m).eq("id", id)),
    deleteMember: (id) => run(t("members").delete().eq("id", id)),
    addCollection: (c) => run(t("collections").insert(c)),
    addCollections: (rows) => run(t("collections").insert(rows)),
    updateCollection: (id, p) => run(t("collections").update(p).eq("id", id)),
    setPaid: (id) =>
      run(
        t("collections")
          .update({
            status: "Paid",
            date: new Date().toISOString().slice(0, 10),
          })
          .eq("id", id),
      ),
    deleteCollection: (id) => run(t("collections").delete().eq("id", id)),
    addExpense: (e) => run(t("expenses").insert(e)),
    deleteExpense: (id) => run(t("expenses").delete().eq("id", id)),
    addNotice: (title, body) => run(t("notices").insert({ title, body })),
    deleteNotice: (id) => run(t("notices").delete().eq("id", id)),
    addComplaint: (title, details) =>
      run(t("complaints").insert({ flat, title, details })),
    setComplaintStatus: (id, status) =>
      run(t("complaints").update({ status }).eq("id", id)),
  };
  return (
    <DbCtx.Provider value={{ db, loading, refresh, api }}>
      {children}
    </DbCtx.Provider>
  );
}

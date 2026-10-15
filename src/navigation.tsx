import React, { createContext, useContext, useState, ReactNode } from "react";
import { useSession } from "@/session";

export type RouteName =
  | "Splash"
  | "Login"
  | "Home"
  | "Members"
  | "AddMember"
  | "Maintenance"
  | "RecordPayment"
  | "Collections"
  | "AddCollection"
  | "CollectionDetails"
  | "Expenses"
  | "AddExpense"
  | "ExpenseDetails"
  | "Reports"
  | "Profile"
  | "MyPayments"
  | "Notices"
  | "AddNotice"
  | "Complaints"
  | "AddComplaint";
const MEMBER_ROUTES: RouteName[] = [
  "Splash",
  "Login",
  "Home",
  "MyPayments",
  "Expenses",
  "ExpenseDetails",
  "Profile",
  "Notices",
  "Complaints",
  "AddComplaint",
];

export const ADMIN_TAB_ROUTES: RouteName[] = [
  "Home",
  "Members",
  "Collections",
  "Expenses",
  "Profile",
];
export const MEMBER_TAB_ROUTES: RouteName[] = [
  "Home",
  "MyPayments",
  "Expenses",
  "Complaints",
  "Profile",
];

export function canAccessRoute(role: "admin" | "member", route: RouteName) {
  return role === "admin" || MEMBER_ROUTES.includes(route);
}

type Route = { name: RouteName; params?: any };
type Nav = {
  route: Route;
  push: (n: RouteName, p?: any) => void;
  back: () => void;
  reset: (n: RouteName, p?: any) => void;
};

const NavCtx = createContext<Nav>({
  route: { name: "Splash" },
  push() {},
  back() {},
  reset() {},
});
export const useNav = () => useContext(NavCtx);

// Minimal stack navigator: no extra dependencies.
export function NavProvider({ children }: { children: ReactNode }) {
  const { role } = useSession();
  const [stack, setStack] = useState<Route[]>([{ name: "Splash" }]);
  const nav: Nav = {
    route: stack[stack.length - 1],
    push: (name, params) =>
      setStack((s) =>
        canAccessRoute(role, name) ? [...s, { name, params }] : [{ name: "Home" }],
      ),
    back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    reset: (name, params) =>
      setStack([
        {
          name: canAccessRoute(role, name) ? name : "Home",
          params: canAccessRoute(role, name) ? params : undefined,
        },
      ]),
  };
  return <NavCtx.Provider value={nav}>{children}</NavCtx.Provider>;
}

import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import {
  ADMIN_TAB_ROUTES,
  canAccessRoute,
  MEMBER_TAB_ROUTES,
  RouteName,
  useNav,
  NavProvider,
} from "@/navigation";
import { useSession, SessionProvider } from "@/session";
import TabBar from "@/components/TabBar";

import SplashScreen from "@/screens/SplashScreen";
import LoginScreen from "@/screens/LoginScreen";
import HomeScreen from "@/screens/HomeScreen";
import MembersScreen from "@/screens/MembersScreen";
import AddMemberScreen from "@/screens/AddMemberScreen";
import MaintenanceScreen from "@/screens/MaintenanceScreen";
import RecordPaymentScreen from "@/screens/RecordPaymentScreen";
import CollectionsScreen from "@/screens/CollectionsScreen";
import AddCollectionScreen from "@/screens/AddCollectionScreen";
import CollectionDetailsScreen from "@/screens/CollectionDetailsScreen";
import ExpensesScreen from "@/screens/ExpensesScreen";
import AddExpenseScreen from "@/screens/AddExpenseScreen";
import ExpenseDetailsScreen from "@/screens/ExpenseDetailsScreen";
import ReportsScreen from "@/screens/ReportsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import MemberHomeScreen from "@/screens/MemberHomeScreen";
import MyPaymentsScreen from "@/screens/MyPaymentsScreen";
import NoticesScreen from "@/screens/NoticesScreen";
import AddNoticeScreen from "@/screens/AddNoticeScreen";
import ComplaintsScreen from "@/screens/ComplaintsScreen";
import AddComplaintScreen from "@/screens/AddComplaintScreen";
import { DbProvider } from "./store";

type ScreenProps = {
  params?: any;
};

const SCREENS: Record<RouteName, React.ComponentType<ScreenProps>> = {
  Splash: SplashScreen,
  Login: LoginScreen,
  Home: HomeScreen,
  Members: MembersScreen,
  AddMember: AddMemberScreen,
  Maintenance: MaintenanceScreen,
  RecordPayment: RecordPaymentScreen,
  Collections: CollectionsScreen,
  AddCollection: AddCollectionScreen,
  CollectionDetails: CollectionDetailsScreen,
  Expenses: ExpensesScreen,
  AddExpense: AddExpenseScreen,
  ExpenseDetails: ExpenseDetailsScreen,
  Reports: ReportsScreen,
  Profile: ProfileScreen,
  MyPayments: MyPaymentsScreen,
  Notices: NoticesScreen,
  AddNotice: AddNoticeScreen,
  Complaints: ComplaintsScreen,
  AddComplaint: AddComplaintScreen,
};

function Root() {
  const { route } = useNav();
  const { role } = useSession();

  const isAllowed = canAccessRoute(role, route.name);
  const tabRoutes = role === "admin" ? ADMIN_TAB_ROUTES : MEMBER_TAB_ROUTES;

  const Screen: React.ComponentType<ScreenProps> =
    !isAllowed || (role === "member" && route.name === "Home")
      ? MemberHomeScreen
      : SCREENS[route.name];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Screen
          key={`${route.name}-${JSON.stringify(route.params ?? {})}`}
          params={route.params}
        />
      </View>

      {tabRoutes.includes(route.name) && <TabBar active={route.name} />}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <DbProvider>
          <NavProvider>
            <StatusBar style="light" />
            <Root />
          </NavProvider>
        </DbProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}

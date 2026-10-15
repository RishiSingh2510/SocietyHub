import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme";
import { RouteName, useNav } from "@/navigation";
import { useSession } from "@/session";

const ADMIN_TABS: {
  name: RouteName;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: "Home", label: "Home", icon: "home" },
  { name: "Members", label: "Members", icon: "people" },
  { name: "Collections", label: "Collections", icon: "wallet" },
  { name: "Expenses", label: "Expenses", icon: "receipt" },
  { name: "Profile", label: "More", icon: "ellipsis-horizontal" },
];
const MEMBER_TABS: typeof ADMIN_TABS = [
  { name: "Home", label: "Home", icon: "home" },
  { name: "MyPayments", label: "Payments", icon: "wallet" },
  { name: "Expenses", label: "Expenses", icon: "receipt" },
  { name: "Complaints", label: "Complaints", icon: "chatbubble-ellipses" },
  { name: "Profile", label: "More", icon: "ellipsis-horizontal" },
];

export default function TabBar({ active }: { active: RouteName }) {
  const nav = useNav();
  const { role } = useSession();
  const { bottom } = useSafeAreaInsets();
  const tabs = role === "admin" ? ADMIN_TABS : MEMBER_TABS;
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: colors.line,
        paddingBottom: bottom,
      }}
    >
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.name}
          style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}
          onPress={() => nav.reset(t.name)}
        >
          <Ionicons
            name={t.icon}
            size={22}
            color={active === t.name ? colors.navy : colors.mute}
          />
          <Text
            style={{
              fontSize: 10,
              marginTop: 2,
              color: active === t.name ? colors.navy : colors.mute,
              fontWeight: "600",
            }}
          >
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

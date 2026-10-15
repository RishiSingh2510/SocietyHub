import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { colors, shadow } from "../theme";
import { useNav } from "../navigation";
import { useSession } from "../session";
import { useDb } from "../store";

type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

export default function ProfileScreen() {
  const nav = useNav();
  const { role, flat, name, email, signOut } = useSession();
  const { db } = useDb();
  const me = db.members.find((m) => m.flat === flat);
  const [notify, setNotify] = useState(true);
  const soon = (what: string) => () => Alert.alert(what, "Coming soon.");
  const shared: Row[] = [
    {
      icon: "megaphone-outline",
      label: "Notice Board",
      onPress: () => nav.push("Notices"),
    },
    {
      icon: "chatbubble-ellipses-outline",
      label: "Complaints",
      onPress: () => nav.push("Complaints"),
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      onPress: soon("Help & Support"),
    },
  ];
  const rows: Row[] =
    role === "admin"
      ? [
          {
            icon: "people-outline",
            label: "Members",
            onPress: () => nav.reset("Members"),
          },
          {
            icon: "bar-chart-outline",
            label: "Reports",
            onPress: () => nav.push("Reports"),
          },
          {
            icon: "business-outline",
            label: "Maintenance",
            onPress: () => nav.push("Maintenance"),
          },
          ...shared,
        ]
      : [
          {
            icon: "wallet-outline",
            label: "My Payments",
            onPress: () => nav.reset("MyPayments"),
          },
          ...shared,
        ];
  const logout = async () => {
    await signOut();
    nav.reset("Login");
  };
  return (
    <Screen title="Profile & Settings">
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 14,
            marginBottom: 14,
          },
          shadow,
        ]}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: colors.blueBg,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name="person" size={26} color={colors.navy} />
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={{ fontWeight: "800", fontSize: 17, color: colors.ink }}>
            {name || me?.name || (role === "admin" ? "Admin" : "Member")}
          </Text>
          <Text style={{ color: colors.mute }}>
            {role === "admin"
              ? "Admin"
              : flat
                ? `Flat ${flat} • ${me?.type ?? ""}`
                : "Not linked to a flat"}
          </Text>
          <Text style={{ color: colors.mute, fontSize: 12 }}>{email}</Text>
        </View>
      </View>
      <View style={[{ backgroundColor: "#fff", borderRadius: 12 }, shadow]}>
        {rows.map((r) => (
          <TouchableOpacity
            key={r.label}
            onPress={r.onPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 14,
              borderBottomWidth: 0.5,
              borderColor: colors.line,
            }}
          >
            <Ionicons name={r.icon} size={20} color={colors.mute} />
            <Text style={{ flex: 1, marginLeft: 12, color: colors.ink }}>
              {r.label}
            </Text>
            <Text style={{ color: colors.mute }}>›</Text>
          </TouchableOpacity>
        ))}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 14,
            borderBottomWidth: 0.5,
            borderColor: colors.line,
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={colors.mute}
          />
          <Text style={{ flex: 1, marginLeft: 12, color: colors.ink }}>
            Notifications
          </Text>
          <Switch
            value={notify}
            onValueChange={setNotify}
            trackColor={{ true: colors.green }}
          />
        </View>
        <TouchableOpacity
          onPress={logout}
          style={{ flexDirection: "row", alignItems: "center", padding: 14 }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.red} />
          <Text style={{ marginLeft: 12, color: colors.red }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

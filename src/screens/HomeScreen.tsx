import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import StatCard from "../components/StatCard";
import { colors, shadow } from "../theme";
import { useDb } from "../store";
import { useNav, RouteName } from "../navigation";
import { rs, stats, monthStats, monthKey, monthLabel } from "../utils";

const ACTIONS: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  to: RouteName;
  color: string;
}[] = [
  {
    label: "Add Member",
    icon: "person-add",
    to: "AddMember",
    color: "#2749f3",
  },
  {
    label: "Record Payment",
    icon: "cash",
    to: "RecordPayment",
    color: colors.green,
  },
  {
    label: "Add Expense",
    icon: "receipt",
    to: "AddExpense",
    color: colors.green,
  },
  {
    label: "View Reports",
    icon: "bar-chart",
    to: "Reports",
    color: "#2749f3",
  },
];

export default function HomeScreen() {
  const { db } = useDb();
  const nav = useNav();
  const s = stats(db);
  const mk = monthKey();
  const ms = monthStats(db, mk);
  return (
    <Screen
      title={db.society}
      right={<Ionicons name="notifications-outline" size={22} color="#fff" />}
    >
      <View
        style={[
          { backgroundColor: "#fff", borderRadius: 14, padding: 16 },
          shadow,
        ]}
      >
        <Text style={{ color: colors.mute }}>Total Balance</Text>
        <Text style={{ fontSize: 30, fontWeight: "800", color: colors.ink }}>
          {rs(s.net)}
        </Text>
        <Text
          style={{
            color: s.pending ? colors.orange : colors.green,
            fontSize: 12,
          }}
        >
          {rs(s.pending)} dues pending
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => nav.push("Maintenance")}
        style={[
          {
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 16,
            marginTop: 12,
          },
          shadow,
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "700", color: colors.ink }}>
            {monthLabel(mk)} maintenance
          </Text>
          <Text style={{ color: colors.mute }}>{ms.pct}% collected</Text>
        </View>
        <View
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.bg,
            marginVertical: 10,
          }}
        >
          <View
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.green,
              width: `${ms.pct}%`,
            }}
          />
        </View>
        <Text style={{ color: colors.mute, fontSize: 12 }}>
          {rs(ms.maintIn)} of {rs(ms.billed)} • {rs(ms.maintDue)} pending
          {ms.arrears ? ` • ${rs(ms.arrears)} arrears` : ""} • spent{" "}
          {rs(ms.exp)}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        <StatCard
          label="Maintenance Received"
          value={rs(s.maintIn)}
          bg={colors.blueBg}
          fg={colors.navy2}
          icon="business"
          onPress={() => nav.push("Maintenance")}
        />
        <StatCard
          label="Other Collections"
          value={rs(s.otherIn)}
          bg={colors.greenBg}
          fg={colors.green}
          icon="wallet"
          onPress={() => nav.push("Collections")}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        <StatCard
          label="Total Expenses"
          value={rs(s.exp)}
          bg={colors.orangeBg}
          fg={colors.orange}
          icon="receipt"
          onPress={() => nav.push("Expenses")}
        />
        <StatCard
          label="Net Balance"
          value={rs(s.net)}
          bg={colors.purpleBg}
          fg="#6C4BC1"
          icon="trending-up"
        />
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: colors.ink,
          marginTop: 22,
          marginBottom: 10,
        }}
      >
        Quick Actions
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {ACTIONS.map((a) => (
          <TouchableOpacity
            key={a.label}
            style={{ alignItems: "center", width: "24%" }}
            onPress={() => nav.push(a.to)}
          >
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                backgroundColor: colors.blueBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={a.icon} size={24} color={a.color} />
            </View>
            <Text
              style={{
                fontSize: 11,
                color: colors.ink,
                textAlign: "center",
                marginTop: 6,
              }}
            >
              {a.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}

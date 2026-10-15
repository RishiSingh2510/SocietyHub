import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Screen from "../components/Screen";
import StatCard from "../components/StatCard";
import CollectionRow from "../components/CollectionRow";
import { colors, shadow } from "../theme";
import { useDb } from "../store";
import { useNav } from "../navigation";
import { useSession } from "../session";
import { rs } from "../utils";
import { Ionicons } from "@expo/vector-icons";

// Home for a resident: only their own flat's dues and payments.
export default function MemberHomeScreen() {
  const { db } = useDb();
  const { flat } = useSession();
  const nav = useNav();
  const me = db.members.find((m) => m.flat === flat);
  const mine = db.collections
    .filter((c) => c.flat === flat)
    .sort((a, b) => b.date.localeCompare(a.date));
  const due = mine.filter((c) => c.status !== "Paid");
  const paid = mine.filter((c) => c.status === "Paid");
  const total = (l: typeof mine) => l.reduce((a, c) => a + c.amount, 0);
  return (
    <Screen title={`Hello, ${me?.name.split(" ")[0] ?? "Resident"} 👋`}>
      {!flat && (
        <Text style={{ color: colors.orange, marginBottom: 10 }}>
          Your account isn't linked to a flat yet. Ask your admin to add your
          email under Members.
        </Text>
      )}
      <View
        style={[
          { backgroundColor: "#fff", borderRadius: 14, padding: 16 },
          shadow,
        ]}
      >
        <Text style={{ color: colors.mute }}>
          {db.society} • Flat {flat}
        </Text>
        <Text style={{ color: colors.mute, marginTop: 8 }}>Total due</Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "800",
            color: due.length ? colors.orange : colors.green,
          }}
        >
          {rs(total(due))}
        </Text>
        <Text style={{ color: colors.mute, fontSize: 12 }}>
          {due.length
            ? "Pay your admin — they will mark it received."
            : "You are all caught up."}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        <StatCard
          label="Paid so far"
          value={rs(total(paid))}
          bg={colors.greenBg}
          fg={colors.green}
          icon="checkmark-circle"
        />
        <StatCard
          label="Pending items"
          value={String(due.length)}
          bg={colors.orangeBg}
          fg={colors.orange}
          icon="time"
        />
      </View>
      {db.notices[0] && (
        <TouchableOpacity
          onPress={() => nav.push("Notices")}
          style={[
            {
              backgroundColor: colors.blueBg,
              borderRadius: 12,
              padding: 14,
              marginTop: 12,
            },
            shadow,
          ]}
        >
          <Text style={{ color: colors.mute, fontSize: 12 }}>
            Latest notice
          </Text>
          <Text style={{ fontWeight: "700", color: colors.ink, marginTop: 2 }}>
            {db.notices[0].title}
          </Text>
        </TouchableOpacity>
      )}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: colors.ink,
          marginTop: 22,
          marginBottom: 10,
        }}
      >
        {due.length ? "Due now" : "Recent payments"}
      </Text>
      {(due.length ? due : paid.slice(0, 3)).map((c) => (
        <CollectionRow key={c.id} c={c} readOnly />
      ))}
      {!mine.length && (
        <Text style={{ color: colors.mute }}>
          No records for your flat yet.
        </Text>
      )}
      <TouchableOpacity onPress={() => nav.reset("MyPayments")}>
        <Text
          style={{ color: colors.navy2, textAlign: "center", marginTop: 8 }}
        >
          View all my payments
          <Ionicons name="chevron-forward" size={12} color={colors.navy2} />
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

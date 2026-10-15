import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import Screen from "@/components/Screen";
import StatCard from "@/components/StatCard";
import StatusPill from "@/components/StatusPill";
import Button from "@/components/Button";
import MonthSwitcher from "@/components/MonthSwitcher";
import { colors, shadow } from "@/theme";
import { useDb } from "@/store";
import { useNav } from "@/navigation";
import { useSession } from "@/session";
import { Collection } from "@/types";
import {
  effStatus,
  monthKey,
  monthLabel,
  monthStats,
  rs,
  today,
} from "../utils";

// Month-wise maintenance: generate a bill for every flat, then mark each one paid.
export default function MaintenanceScreen() {
  const { db, api } = useDb();
  const nav = useNav();
  const { maintenance } = useSession();
  const [mk, setMk] = useState(monthKey());
  const s = monthStats(db, mk);
  const flats = [...new Set(db.members.map((m) => m.flat))].sort();
  const bill = (f: string) =>
    db.collections.find(
      (c) => c.flat === f && c.category === "Maintenance" && c.month === mk,
    );
  const missing = flats.filter((f) => !bill(f));
  const generate = () =>
    Alert.alert(
      `Generate ${monthLabel(mk)} bills?`,
      `${missing.length} flat(s) × ${rs(maintenance)}`,
      [
        { text: "Cancel" },
        {
          text: "Generate",
          onPress: () =>
            api.addCollections(
              missing.map((flat) => ({
                flat,
                category: "Maintenance" as const,
                amount: maintenance,
                status: "Pending" as const,
                date: today(),
                month: mk,
              })),
            ),
        },
      ],
    );
  const tap = (f: string, c?: Collection) => {
    if (!c)
      return Alert.alert(
        `No bill for ${f}`,
        'Use "Generate bills" or "Record payment".',
      );
    if (c.status === "Paid")
      return Alert.alert(`${f} has paid`, "Undo this payment?", [
        { text: "Keep" },
        {
          text: "Undo",
          style: "destructive",
          onPress: () => api.updateCollection(c.id, { status: "Pending" }),
        },
      ]);
    Alert.alert(`Mark ${f} as paid?`, rs(c.amount), [
      { text: "Cancel" },
      { text: "Mark paid", onPress: () => api.setPaid(c.id) },
    ]);
  };
  return (
    <Screen title="Maintenance" back>
      <MonthSwitcher month={mk} onChange={setMk} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <StatCard
          label="Collected"
          value={rs(s.maintIn)}
          bg={colors.greenBg}
          fg={colors.green}
        />
        <StatCard
          label="Outstanding"
          value={rs(s.maintDue)}
          bg={colors.orangeBg}
          fg={colors.orange}
        />
      </View>
      <View
        style={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#fff",
          marginTop: 12,
        }}
      >
        <View
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.green,
            width: `${s.pct}%`,
          }}
        />
      </View>
      <Text style={{ color: colors.mute, fontSize: 12, marginTop: 6 }}>
        {s.pct}% collected
        {s.arrears ? `  •  ${rs(s.arrears)} arrears from earlier months` : ""}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: colors.ink,
          marginVertical: 12,
        }}
      >
        Flat-wise status
      </Text>
      <View
        style={[
          { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 14 },
          shadow,
        ]}
      >
        {flats.map((f) => {
          const c = bill(f);
          return (
            <TouchableOpacity
              key={f}
              onPress={() => tap(f, c)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: 0.5,
                borderColor: colors.line,
              }}
            >
              <View style={{ width: 90 }}>
                <Text style={{ fontWeight: "600", color: colors.ink }}>
                  {f}
                </Text>
                <Text
                  style={{ color: colors.mute, fontSize: 11 }}
                  numberOfLines={1}
                >
                  {db.members.find((m) => m.flat === f)?.name}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                {c ? (
                  <StatusPill status={effStatus(c)} />
                ) : (
                  <Text style={{ color: colors.mute, fontSize: 12 }}>
                    No bill
                  </Text>
                )}
              </View>
              <Text style={{ color: colors.ink }}>
                {c ? rs(c.amount) : "—"}
              </Text>
            </TouchableOpacity>
          );
        })}
        {!flats.length && (
          <Text
            style={{
              color: colors.mute,
              paddingVertical: 20,
              textAlign: "center",
            }}
          >
            Add members first.
          </Text>
        )}
      </View>
      {!!missing.length && (
        <Button
          label={`Generate bills for ${monthLabel(mk)}`}
          onPress={generate}
        />
      )}
      <Button
        ghost
        label="Record payment"
        onPress={() => nav.push("RecordPayment", { month: mk })}
      />
      <Text
        style={{
          textAlign: "center",
          color: colors.mute,
          fontSize: 11,
          marginTop: 10,
        }}
      >
        Tap a flat to mark paid or undo • bills unpaid after the 10th show as
        Overdue
      </Text>
    </Screen>
  );
}

import React from "react";
import { View, Text, TouchableOpacity, Alert, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusPill, { statusColor } from "./StatusPill";
import { colors, shadow } from "../theme";
import { Collection } from "../types";
import { effStatus, fmtDate, monthLabel, rs } from "../utils";
import { useDb } from "../store";

const ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Maintenance: "business",
  Parking: "car",
  Event: "gift",
  Other: "cube",
};

// Admin: tap = mark paid, long-press = delete. Member (readOnly): tap a paid record to share a receipt.
export default function CollectionRow({
  c,
  readOnly,
}: {
  c: Collection;
  readOnly?: boolean;
}) {
  const { db, api } = useDb();
  const status = effStatus(c);
  const receipt = () =>
    Share.share({
      message: `Payment receipt — ${db.society}\nFlat ${c.flat} • ${c.category} • ${monthLabel(c.month)}\nAmount: ${rs(c.amount)}\nStatus: Paid on ${fmtDate(c.date)}`,
    });
  const markPaid = () => status !== "Paid" && api.setPaid(c.id);
  const del = () =>
    Alert.alert("Delete this record?", "", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => api.deleteCollection(c.id),
      },
    ]);
  return (
    <TouchableOpacity
      activeOpacity={readOnly && status !== "Paid" ? 1 : 0.7}
      onPress={readOnly ? (status === "Paid" ? receipt : undefined) : markPaid}
      onLongPress={readOnly ? undefined : del}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        },
        shadow,
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons
          name={ICON[c.category]}
          size={20}
          color={statusColor(status)}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "700", color: colors.ink }}>
          {c.category} • {monthLabel(c.month)}
        </Text>
        <Text style={{ color: colors.mute, fontSize: 12 }}>
          {c.flat} • {rs(c.amount)}
          {readOnly && status === "Paid" ? " • tap for receipt" : ""}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <StatusPill status={status} />
        <Text style={{ color: colors.mute, fontSize: 11 }}>
          {fmtDate(c.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

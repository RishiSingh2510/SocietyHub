import React from "react";
import { Text, View } from "react-native";
import { colors } from "../theme";

const MAP: Record<string, [string, string]> = {
  Paid: [colors.green, colors.greenBg],
  Active: [colors.green, colors.greenBg],
  Pending: [colors.orange, colors.orangeBg],
  Overdue: [colors.red, colors.redBg],
  Open: [colors.red, colors.redBg],
  "In Progress": [colors.orange, colors.orangeBg],
  Resolved: [colors.green, colors.greenBg],
};
export const statusColor = (s: string) => MAP[s][0];

export default function StatusPill({ status }: { status: string }) {
  const [fg, bg] = MAP[status];
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <Text style={{ color: fg, fontSize: 11, fontWeight: "700" }}>
        {status}
      </Text>
    </View>
  );
}

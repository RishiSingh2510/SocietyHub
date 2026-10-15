import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors, shadow } from "../theme";
import { monthLabel, shiftMonth } from "../utils";

export default function MonthSwitcher({
  month,
  onChange,
}: {
  month: string;
  onChange: (m: string) => void;
}) {
  const Arrow = ({ d, t }: { d: number; t: string }) => (
    <TouchableOpacity
      onPress={() => onChange(shiftMonth(month, d))}
      style={{ paddingHorizontal: 22, paddingVertical: 8 }}
    >
      <Text style={{ fontSize: 22, color: colors.navy }}>{t}</Text>
    </TouchableOpacity>
  );
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          borderRadius: 12,
          marginBottom: 14,
        },
        shadow,
      ]}
    >
      <Arrow d={-1} t="‹" />
      <Text style={{ fontWeight: "800", fontSize: 16, color: colors.ink }}>
        {monthLabel(month)}
      </Text>
      <Arrow d={1} t="›" />
    </View>
  );
}

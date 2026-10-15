import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { colors } from "@/theme";

export default function Button({
  label,
  onPress,
  ghost,
  icon,
}: {
  label: string;
  onPress: () => void;
  ghost?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: ghost ? "#fff" : colors.navy,
        borderWidth: 1,
        borderColor: colors.navy,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
      }}
    >
      {icon && <View>{icon}</View>}
      <Text
        style={{
          color: ghost ? colors.navy : "#fff",
          fontWeight: "700",
          fontSize: 16,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

import React from "react";
import { View, Text, Alert } from "react-native";
import Screen from "../components/Screen";
import Button from "../components/Button";
import { colors, shadow } from "../theme";
import { useDb } from "../store";
import { useNav } from "../navigation";
import { useSession } from "../session";
import { fmtDate, rs } from "../utils";

export default function ExpenseDetailsScreen({
  params,
}: {
  params?: { id: string };
}) {
  const { db, api } = useDb();
  const nav = useNav();
  const { role } = useSession();
  const e = db.expenses.find((x) => x.id === params?.id);
  const del = () =>
    Alert.alert("Delete this expense?", "", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (e && (await api.deleteExpense(e.id))) nav.back();
        },
      },
    ]);
  return (
    <Screen title="Expense Details" back>
      {e ? (
        <View
          style={[
            { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
            shadow,
          ]}
        >
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.ink }}>
            {e.description}
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: colors.red,
              marginVertical: 10,
            }}
          >
            {rs(e.amount)}
          </Text>
          <Text style={{ color: colors.mute }}>Paid from</Text>
          <Text style={{ color: colors.ink, fontWeight: "600", marginBottom: 8 }}>
            {e.fund}
          </Text>
          <Text style={{ color: colors.mute }}>Category</Text>
          <Text style={{ color: colors.ink, fontWeight: "600", marginBottom: 8 }}>
            {e.category}
          </Text>
          <Text style={{ color: colors.mute }}>Date</Text>
          <Text style={{ color: colors.ink, fontWeight: "600" }}>
            {fmtDate(e.date)}
          </Text>
        </View>
      ) : (
        <Text style={{ color: colors.mute }}>This expense no longer exists.</Text>
      )}
      {e && role === "admin" && (
        <Button label="Delete expense" ghost onPress={del} />
      )}
    </Screen>
  );
}

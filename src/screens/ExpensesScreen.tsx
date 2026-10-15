import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import StatCard from "../components/StatCard";
import MonthSwitcher from "../components/MonthSwitcher";
import Fab from "../components/Fab";
import { Segmented } from "../components/Form";
import { colors, shadow } from "../theme";
import { useDb } from "../store";
import { useNav } from "../navigation";
import { useSession } from "../session";
import { FundName } from "../types";
import { fmtDate, fundBalance, monthKey, monthLabel, rs } from "../utils";

type F = "All" | FundName;

// Month-wise expenses with a category breakdown.
export default function ExpensesScreen() {
  const { db } = useDb();
  const nav = useNav();
  const { role } = useSession();
  const [mk, setMk] = useState(monthKey());
  const [f, setF] = useState<F>("All");
  const list = db.expenses
    .filter((e) => e.date.slice(0, 7) === mk && (f === "All" || e.fund === f))
    .sort((a, b) => b.date.localeCompare(a.date));
  const spent = list.reduce((a, e) => a + e.amount, 0);
  const cats = Object.entries(
    list.reduce<Record<string, number>>(
      (o, e) => ({ ...o, [e.category]: (o[e.category] ?? 0) + e.amount }),
      {},
    ),
  ).sort((a, b) => b[1] - a[1]);
  const balance =
    f === "All"
      ? fundBalance(db, "Maintenance Fund", mk) +
        fundBalance(db, "Other Collection", mk)
      : fundBalance(db, f, mk);
  return (
    <View style={{ flex: 1 }}>
      <Screen title="Expenses">
        <MonthSwitcher month={mk} onChange={setMk} />
        <Segmented<F>
          options={["All", "Maintenance Fund", "Other Collection"]}
          value={f}
          onChange={setF}
          text={(o) =>
            o === "Other Collection"
              ? "Other"
              : o === "Maintenance Fund"
                ? "Maintenance"
                : o
          }
        />
        <View style={{ flexDirection: "row", gap: 12, marginVertical: 14 }}>
          <StatCard
            label={`Spent in ${monthLabel(mk)}`}
            value={rs(spent)}
            bg={colors.orangeBg}
            fg={colors.orange}
          />
          <StatCard
            label="Fund balance (till month end)"
            value={rs(balance)}
            bg={colors.blueBg}
            fg={balance < 0 ? colors.red : colors.navy2}
          />
        </View>
        {!!cats.length && (
          <View
            style={[
              {
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 14,
                marginBottom: 14,
              },
              shadow,
            ]}
          >
            <Text style={{ fontWeight: "700", color: colors.ink, marginBottom: 8 }}>
              By category
            </Text>
            {cats.map(([c, v]) => (
              <View key={c} style={{ marginBottom: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: colors.ink, fontSize: 13 }}>{c}</Text>
                  <Text style={{ color: colors.mute, fontSize: 13 }}>{rs(v)}</Text>
                </View>
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.bg,
                    marginTop: 4,
                  }}
                >
                  <View
                    style={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.orange,
                      width: `${(v / cats[0][1]) * 100}%`,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
        {list.map((e) => (
          <TouchableOpacity
            key={e.id}
            onPress={() => nav.push("ExpenseDetails", { id: e.id })}
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
                backgroundColor: colors.blueBg,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="receipt" size={20} color={colors.navy2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", color: colors.ink }}>
                {e.description}
              </Text>
              <Text style={{ color: colors.mute, fontSize: 12 }}>
                {e.category} • {e.fund}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontWeight: "700", color: colors.ink }}>
                {rs(e.amount)}
              </Text>
              <Text style={{ color: colors.mute, fontSize: 11 }}>
                {fmtDate(e.date)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {!list.length && (
          <Text style={{ textAlign: "center", color: colors.mute, marginTop: 20 }}>
            No expenses in {monthLabel(mk)}.
            {role === "admin" ? " Tap + to add one." : ""}
          </Text>
        )}
      </Screen>
      {role === "admin" && (
        <Fab onPress={() => nav.push("AddExpense", { month: mk })} />
      )}
    </View>
  );
}

import React, { useState } from "react";
import { View, Text, Share } from "react-native";
import Screen from "../components/Screen";
import Button from "../components/Button";
import MonthSwitcher from "../components/MonthSwitcher";
import { colors, shadow } from "../theme";
import { useDb } from "../store";
import {
  monthKey,
  monthLabel,
  monthShort,
  monthStats,
  rs,
  shiftMonth,
} from "../utils";

const Line = ({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
    }}
  >
    <Text style={{ color: colors.ink, fontWeight: bold ? "800" : "400" }}>
      {label}
    </Text>
    <Text style={{ color: color ?? colors.ink, fontWeight: bold ? "800" : "600" }}>
      {value}
    </Text>
  </View>
);

// Monthly statement: opening → collections → expenses → closing, a 6-month trend, and defaulters.
export default function ReportsScreen() {
  const { db } = useDb();
  const [mk, setMk] = useState(monthKey());
  const s = monthStats(db, mk);
  const trend = [-5, -4, -3, -2, -1, 0].map((n) => {
    const m = shiftMonth(mk, n);
    const x = monthStats(db, m);
    return { m, income: x.income, exp: x.exp };
  });
  const max = Math.max(1, ...trend.flatMap((t) => [t.income, t.exp]));
  const dues: Record<string, { amt: number; n: number }> = {};
  db.collections
    .filter(
      (c) =>
        c.category === "Maintenance" && c.status !== "Paid" && c.month <= mk,
    )
    .forEach((c) => {
      const d = dues[c.flat] ?? { amt: 0, n: 0 };
      dues[c.flat] = { amt: d.amt + c.amount, n: d.n + 1 };
    });
  const defaulters = Object.entries(dues).sort((a, b) => b[1].amt - a[1].amt);
  const catLines = Object.entries(
    db.expenses
      .filter((e) => e.date.slice(0, 7) === mk)
      .reduce<
        Record<string, number>
      >((o, e) => ({ ...o, [e.category]: (o[e.category] ?? 0) + e.amount }), {}),
  ).sort((a, b) => b[1] - a[1]);

  const share = () =>
    Share.share({
      message: [
        `${db.society} — statement for ${monthLabel(mk)}`,
        "",
        `Opening balance: ${rs(s.opening)}`,
        `Maintenance collected: ${rs(s.maintIn)} of ${rs(s.billed)} (${s.pct}%)`,
        `Other collections: ${rs(s.otherIn)}`,
        `Expenses: ${rs(s.exp)}`,
        ...catLines.map(([c, v]) => `  - ${c}: ${rs(v)}`),
        `Closing balance: ${rs(s.closing)}`,
        ...(defaulters.length
          ? [
              "",
              "Pending maintenance:",
              ...defaulters.map(
                ([f, d]) =>
                  `  - ${f}: ${rs(d.amt)} (${d.n} month${d.n > 1 ? "s" : ""})`,
              ),
            ]
          : []),
      ].join("\n"),
    });

  return (
    <Screen title="Monthly Report" back>
      <MonthSwitcher month={mk} onChange={setMk} />
      <View
        style={[
          { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
          shadow,
        ]}
      >
        <Line label="Opening balance" value={rs(s.opening)} />
        <Line
          label={`+ Maintenance collected (${s.pct}%)`}
          value={rs(s.maintIn)}
          color={colors.green}
        />
        <Line
          label="+ Other collections"
          value={rs(s.otherIn)}
          color={colors.green}
        />
        <Line
          label="− Maintenance fund expenses"
          value={rs(s.maintExp)}
          color={colors.red}
        />
        <Line
          label="− Other fund expenses"
          value={rs(s.otherExp)}
          color={colors.red}
        />
        <View
          style={{ height: 1, backgroundColor: colors.line, marginVertical: 6 }}
        />
        <Line
          bold
          label="Closing balance"
          value={rs(s.closing)}
          color={s.closing < 0 ? colors.red : colors.navy}
        />
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: colors.ink,
          marginVertical: 14,
        }}
      >
        Last 6 months
      </Text>
      <View
        style={[
          { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
          shadow,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: 120,
          }}
        >
          {trend.map((t) => (
            <View key={t.m} style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  height: 100,
                  gap: 3,
                }}
              >
                <View
                  style={{
                    width: 11,
                    height: Math.max(2, (t.income / max) * 100),
                    backgroundColor: colors.green,
                    borderRadius: 3,
                  }}
                />
                <View
                  style={{
                    width: 11,
                    height: Math.max(2, (t.exp / max) * 100),
                    backgroundColor: colors.orange,
                    borderRadius: 3,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: t.m === mk ? colors.navy : colors.mute,
                  fontWeight: t.m === mk ? "800" : "400",
                  marginTop: 4,
                }}
              >
                {monthShort(t.m)}
              </Text>
            </View>
          ))}
        </View>
        <Text style={{ color: colors.mute, fontSize: 11, marginTop: 8 }}>
          ■ Income (green) ■ Expense (orange)
        </Text>
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: colors.ink,
          marginVertical: 14,
        }}
      >
        Pending maintenance
      </Text>
      <View
        style={[
          { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16 },
          shadow,
        ]}
      >
        {defaulters.map(([f, d]) => (
          <Line
            key={f}
            label={`${f}  •  ${d.n} month${d.n > 1 ? "s" : ""}`}
            value={rs(d.amt)}
            color={colors.orange}
          />
        ))}
        {!defaulters.length && (
          <Text style={{ color: colors.green, paddingVertical: 14 }}>
            No pending maintenance up to {monthLabel(mk)} 🎉
          </Text>
        )}
      </View>
      <Button label="Share monthly report" onPress={share} />
    </Screen>
  );
}

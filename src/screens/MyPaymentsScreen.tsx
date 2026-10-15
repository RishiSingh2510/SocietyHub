import React, { useState } from "react";
import { Text } from "react-native";
import Screen from "../components/Screen";
import CollectionRow from "../components/CollectionRow";
import { Segmented } from "../components/Form";
import { colors } from "../theme";
import { useDb } from "../store";
import { useSession } from "../session";
import { monthLabel } from "../utils";

type F = "All" | "Paid" | "Due";

// A member's payments grouped month by month.
export default function MyPaymentsScreen() {
  const { db } = useDb();
  const { flat } = useSession();
  const [f, setF] = useState<F>("All");
  const mine = db.collections.filter(
    (c) =>
      c.flat === flat &&
      (f === "All" || (f === "Paid") === (c.status === "Paid")),
  );
  const months = [...new Set(mine.map((c) => c.month))].sort().reverse();
  return (
    <Screen title={`My Payments • ${flat}`}>
      <Segmented<F>
        options={["All", "Paid", "Due"]}
        value={f}
        onChange={setF}
      />
      <Text style={{ height: 8 }} />
      {months.map((m) => (
        <React.Fragment key={m}>
          <Text
            style={{
              fontWeight: "800",
              color: colors.navy,
              marginTop: 10,
              marginBottom: 8,
            }}
          >
            {monthLabel(m)}
          </Text>
          {mine
            .filter((c) => c.month === m)
            .map((c) => (
              <CollectionRow key={c.id} c={c} readOnly />
            ))}
        </React.Fragment>
      ))}
      {!months.length && (
        <Text style={{ textAlign: "center", color: colors.mute, marginTop: 30 }}>
          Nothing here yet.
        </Text>
      )}
    </Screen>
  );
}

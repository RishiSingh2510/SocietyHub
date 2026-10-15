import React, { useState } from "react";
import { Text } from "react-native";
import Screen from "@/components/Screen";
import CollectionRow from "@/components/CollectionRow";
import { Segmented } from "@/components/Form";
import { colors } from "@/theme";
import { useDb } from "@/store";

type F = "Maintenance" | "Other" | "All";

export default function CollectionDetailsScreen() {
  const { db } = useDb();
  const [f, setF] = useState<F>("All");
  const list = db.collections.filter(
    (c) =>
      f === "All" || (f === "Maintenance") === (c.category === "Maintenance"),
  );
  return (
    <Screen title="Collection Details" back>
      <Segmented<F>
        options={["Maintenance", "Other", "All"]}
        value={f}
        onChange={setF}
      />
      <Text style={{ height: 14 }} />
      {list.map((c) => (
        <CollectionRow key={c.id} c={c} />
      ))}
      {!list.length && (
        <Text style={{ textAlign: "center", color: colors.mute, marginTop: 30 }}>
          Nothing here yet.
        </Text>
      )}
    </Screen>
  );
}

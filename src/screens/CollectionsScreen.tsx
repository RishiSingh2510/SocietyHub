import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Screen from "@/components/Screen";
import StatCard from "@/components/StatCard";
import CollectionRow from "@/components/CollectionRow";
import Fab from "@/components/Fab";
import { Segmented } from "@/components/Form";
import { colors } from "@/theme";
import { useDb } from "@/store";
import { useNav } from "@/navigation";
import { Category } from "@/types";
import { rs, stats } from "@/utils";

type F = "All" | Category;

export default function CollectionsScreen() {
  const { db } = useDb();
  const nav = useNav();
  const [f, setF] = useState<F>("All");
  const s = stats(db);
  const list = db.collections
    .filter((c) => f === "All" || c.category === f)
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <View style={{ flex: 1 }}>
      <Screen title="Collections">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginBottom: 12 }}
        >
          <View style={{ width: 480 }}>
            <Segmented<F>
              options={["All", "Maintenance", "Parking", "Event", "Other"]}
              value={f}
              onChange={setF}
            />
          </View>
        </ScrollView>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
          <StatCard
            label="Total Collected"
            value={rs(s.collected)}
            bg={colors.greenBg}
            fg={colors.green}
            onPress={() => nav.push("CollectionDetails")}
          />
          <StatCard
            label="Pending"
            value={rs(s.pending)}
            bg={colors.orangeBg}
            fg={colors.orange}
          />
        </View>
        {list.map((c) => (
          <CollectionRow key={c.id} c={c} />
        ))}
        {!list.length && (
          <Text style={{ textAlign: "center", color: colors.mute, marginTop: 30 }}>
            No collections yet. Tap + to add one.
          </Text>
        )}
        <Text style={{ textAlign: "center", color: colors.mute, fontSize: 11 }}>
          Tap a record to mark it paid • long-press to delete
        </Text>
      </Screen>
      <Fab onPress={() => nav.push("AddCollection")} />
    </View>
  );
}

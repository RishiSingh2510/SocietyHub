import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Screen from "../components/Screen";
import StatusPill from "../components/StatusPill";
import Fab from "../components/Fab";
import { Segmented } from "../components/Form";
import { colors, shadow } from "../theme";
import { useDb } from "../store";
import { useNav } from "../navigation";

type Filter = "All" | "Owner" | "Tenant";

export default function MembersScreen() {
  const { db, api } = useDb();
  const nav = useNav();
  const [q, setQ] = useState("");
  const [f, setF] = useState<Filter>("All");
  const count = (t: Filter) =>
    t === "All"
      ? db.members.length
      : db.members.filter((m) => m.type === t).length;
  const list = db.members.filter(
    (m) =>
      (f === "All" || m.type === f) &&
      (m.name + m.flat).toLowerCase().includes(q.toLowerCase()),
  );
  const del = (id: string, name: string) =>
    Alert.alert(`Delete ${name}?`, "", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => api.deleteMember(id),
      },
    ]);
  return (
    <View style={{ flex: 1 }}>
      <Screen
        title="Members"
        header={
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search by name or flat number"
            placeholderTextColor="#8FA3BD"
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              marginTop: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          />
        }
      >
        <Segmented<Filter>
          options={["All", "Owner", "Tenant"]}
          value={f}
          onChange={setF}
          text={(o) => `${o === "All" ? "All" : o + "s"} (${count(o)})`}
        />
        <View style={{ marginTop: 14 }}>
          {list.map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => nav.push("AddMember", { id: m.id })}
              onLongPress={() => del(m.id, m.name)}
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
                <Text style={{ color: colors.navy, fontWeight: "800" }}>
                  {m.name[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: colors.ink }}>
                  {m.name}
                </Text>
                <Text style={{ color: colors.mute, fontSize: 12 }}>
                  {m.flat} • {m.type}
                </Text>
              </View>
              <StatusPill status={m.status} />
            </TouchableOpacity>
          ))}
          {!list.length && (
            <Text style={{ textAlign: "center", color: colors.mute, marginTop: 30 }}>
              No members found. Tap + to add one.
            </Text>
          )}
        </View>
      </Screen>
      <Fab onPress={() => nav.push("AddMember")} />
    </View>
  );
}

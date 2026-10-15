import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Screen from "../components/Screen";
import Fab from "../components/Fab";
import { colors, shadow } from "../theme";
import { useDb } from "../store";
import { useNav } from "../navigation";
import { useSession } from "../session";
import { fmtDate } from "../utils";

export default function NoticesScreen() {
  const { db, api } = useDb();
  const { role } = useSession();
  const nav = useNav();
  const del = (id: string) =>
    Alert.alert("Delete this notice?", "", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => api.deleteNotice(id),
      },
    ]);
  return (
    <View style={{ flex: 1 }}>
      <Screen title="Notice Board" back>
        {db.notices.map((n) => (
          <TouchableOpacity
            key={n.id}
            activeOpacity={1}
            onLongPress={role === "admin" ? () => del(n.id) : undefined}
            style={[
              {
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
              },
              shadow,
            ]}
          >
            <Text style={{ fontWeight: "700", color: colors.ink, fontSize: 16 }}>
              {n.title}
            </Text>
            {n.body ? (
              <Text style={{ color: colors.ink, marginTop: 6, lineHeight: 20 }}>
                {n.body}
              </Text>
            ) : null}
            <Text style={{ color: colors.mute, fontSize: 11, marginTop: 8 }}>
              {fmtDate(n.created_at.slice(0, 10))}
            </Text>
          </TouchableOpacity>
        ))}
        {!db.notices.length && (
          <Text style={{ textAlign: "center", color: colors.mute, marginTop: 30 }}>
            No notices yet.{role === "admin" ? " Tap + to post one." : ""}
          </Text>
        )}
        {role === "admin" && !!db.notices.length && (
          <Text style={{ textAlign: "center", color: colors.mute, fontSize: 11 }}>
            Long-press a notice to delete it
          </Text>
        )}
      </Screen>
      {role === "admin" && <Fab onPress={() => nav.push("AddNotice")} />}
    </View>
  );
}

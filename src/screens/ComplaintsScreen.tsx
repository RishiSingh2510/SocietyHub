import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Screen from "../components/Screen";
import Fab from "../components/Fab";
import StatusPill from "../components/StatusPill";
import { colors, shadow } from "../theme";
import { useDb } from "../store";
import { useNav } from "../navigation";
import { useSession } from "../session";
import { ComplaintStatus } from "../types";
import { fmtDate } from "../utils";

const NEXT: Record<ComplaintStatus, ComplaintStatus> = {
  Open: "In Progress",
  "In Progress": "Resolved",
  Resolved: "Open",
};

export default function ComplaintsScreen() {
  const { db, api } = useDb();
  const { role } = useSession();
  const nav = useNav();
  const admin = role === "admin";
  return (
    <View style={{ flex: 1 }}>
      <Screen title={admin ? "Complaints" : "My Complaints"} back>
        {db.complaints.map((k) => (
          <TouchableOpacity
            key={k.id}
            activeOpacity={admin ? 0.7 : 1}
            onPress={
              admin
                ? () => api.setComplaintStatus(k.id, NEXT[k.status])
                : undefined
            }
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: colors.ink,
                  flex: 1,
                  marginRight: 8,
                }}
              >
                {k.title}
              </Text>
              <StatusPill status={k.status} />
            </View>
            {k.details ? (
              <Text style={{ color: colors.ink, marginTop: 6 }}>{k.details}</Text>
            ) : null}
            <Text style={{ color: colors.mute, fontSize: 11, marginTop: 8 }}>
              Flat {k.flat} • {fmtDate(k.created_at.slice(0, 10))}
            </Text>
          </TouchableOpacity>
        ))}
        {!db.complaints.length && (
          <Text style={{ textAlign: "center", color: colors.mute, marginTop: 30 }}>
            {admin
              ? "No complaints raised."
              : "No complaints yet. Tap + to raise one."}
          </Text>
        )}
        {admin && !!db.complaints.length && (
          <Text style={{ textAlign: "center", color: colors.mute, fontSize: 11 }}>
            Tap a complaint to move it Open → In Progress → Resolved
          </Text>
        )}
      </Screen>
      {!admin && <Fab onPress={() => nav.push("AddComplaint")} />}
    </View>
  );
}

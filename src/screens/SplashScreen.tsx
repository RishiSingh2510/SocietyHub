import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { useNav } from "../navigation";
import { useSession } from "../session";

export default function SplashScreen() {
  const nav = useNav();
  const { ready, signedIn } = useSession();
  // wait until the saved Supabase session has been checked
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => nav.reset(signedIn ? "Home" : "Login"), 1200);
    return () => clearTimeout(t);
  }, [ready]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.navy2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="business" size={84} color="#fff" />
      <Text
        style={{
          color: "#fff",
          fontSize: 34,
          fontWeight: "800",
          marginTop: 12,
        }}
      >
        SocietyHub
      </Text>
      <Text style={{ color: "#CFE0F5", marginTop: 6 }}>
        Smarter Society Management
      </Text>
      <Text
        style={{
          color: "#9DB7D9",
          position: "absolute",
          bottom: 48,
          fontSize: 12,
        }}
      >
        Manage Members • Track Payments • Monitor Expenses
      </Text>
    </View>
  );
}

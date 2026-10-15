import React, { ReactNode } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { useNav } from "../navigation";
import { useDb } from "../store";

type Props = {
  title: string;
  back?: boolean;
  right?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
};

// Navy header + scrolling body used by every screen after login.
export default function Screen({
  title,
  back,
  right,
  header,
  children,
  scroll = true,
}: Props) {
  const { top } = useSafeAreaInsets();
  const nav = useNav();
  const { loading, refresh } = useDb();
  const Body: any = scroll ? ScrollView : View;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[st.head, { paddingTop: top + 12 }]}>
        <View style={st.row}>
          {back && (
            <TouchableOpacity onPress={nav.back} style={{ marginRight: 12 }}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={st.title}>{title}</Text>
          {right}
        </View>
        {header}
      </View>
      <Body
        style={{ flex: 1 }}
        refreshControl={
          scroll ? (
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          ) : undefined
        }
        contentContainerStyle={
          scroll ? { padding: 16, paddingBottom: 110 } : undefined
        }
      >
        {children}
      </Body>
    </View>
  );
}
const st = StyleSheet.create({
  head: { backgroundColor: colors.navy, paddingHorizontal: 16, paddingBottom: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#fff", fontSize: 19, fontWeight: "700", flex: 1 },
});

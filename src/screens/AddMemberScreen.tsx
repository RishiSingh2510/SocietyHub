import React, { useState } from "react";
import { Alert, Text } from "react-native";
import Screen from "../components/Screen";
import Button from "../components/Button";
import { Field, Segmented } from "../components/Form";
import { statusColor } from "../components/StatusPill";
import { useDb } from "../store";
import { useNav } from "../navigation";
import { Member } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

export default function AddMemberScreen({
  params,
}: {
  params?: { id?: string };
}) {
  const { db, api } = useDb();
  const nav = useNav();
  const old = db.members.find((m) => m.id === params?.id);
  const [name, setName] = useState(old?.name ?? "");
  const [flat, setFlat] = useState(old?.flat ?? "");
  const [type, setType] = useState<Member["type"]>(old?.type ?? "Owner");
  const [phone, setPhone] = useState(old?.phone ?? "");
  const [email, setEmail] = useState(old?.email ?? "");
  const [status, setStatus] = useState<Member["status"]>(
    old?.status ?? "Active",
  );
  const save = async () => {
    if (!name.trim() || !flat.trim())
      return Alert.alert("Name and flat number are required");
    const m = {
      name: name.trim(),
      flat: flat.trim(),
      type,
      phone,
      email: email.trim().toLowerCase() || undefined,
      status,
    };
    if (await (old ? api.saveMember({ ...m, id: old.id }) : api.addMember(m)))
      nav.back();
  };
  return (
    <Screen title={old ? "Edit Member" : "Add Member"} back>
      <Field
        label="Full Name"
        required
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />
      <Field
        label="Flat / Unit Number"
        required
        value={flat}
        onChangeText={setFlat}
        placeholder="e.g. A-101"
        autoCapitalize="characters"
      />
      <Segmented
        label="Member Type"
        options={["Owner", "Tenant"] as Member["type"][]}
        value={type}
        onChange={setType}
      />
      <Field
        label="Email (the member logs in with this)"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholder="resident@example.com"
      />
      <Field
        label="Contact Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter mobile number"
      />
      <Segmented
        label="Status"
        options={["Active", "Pending"] as Member["status"][]}
        value={status}
        onChange={setStatus}
        tint={statusColor}
        icon={(s) =>
          s === "Active" ? (
            <Ionicons name="checkmark-circle" size={20} color="#c4efc5" />
          ) : (
            <Ionicons name="time-outline" size={20} color={colors.orange} />
          )
        }
      />
      <Button label="Save" onPress={save} />
    </Screen>
  );
}

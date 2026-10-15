import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Field, Segmented } from "../components/Form";
import Button from "../components/Button";
import { colors } from "../theme";
import { useNav } from "../navigation";
import { Role, useSession } from "../session";

type Tab = "Admin" | "Member";

export default function LoginScreen() {
  const nav = useNav();
  const { signIn, signUp } = useSession();
  const [tab, setTab] = useState<Tab>("Member");
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const [society, setSociety] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const role: Role = tab === "Admin" ? "admin" : "member";

  const switchTab = (t: Tab) => {
    setTab(t);
    setRegister(false);
  };
  const submit = async () => {
    if (!email.trim() || pw.length < 6 || (register && !name.trim())) {
      return Alert.alert(
        "Check your details",
        register
          ? "Enter your name, email and a password of 6+ characters."
          : "Enter your email and password (6+ characters).",
      );
    }
    setBusy(true);
    const msg = register
      ? await signUp({ role, name: name.trim(), email, password: pw, society })
      : await signIn(role, email, pw);
    setBusy(false);
    if (msg) Alert.alert("SocietyHub", msg);
    else nav.reset("Home");
  };

  const title =
    tab === "Admin"
      ? register
        ? "Register your society"
        : "Admin login"
      : register
        ? "Activate your account"
        : "Member login";
  const hint =
    tab === "Admin"
      ? register
        ? "Create a society and become its admin."
        : "Manage members, payments and expenses."
      : register
        ? "Use the email your society admin added for you, and choose a password."
        : "See your dues, payments and notices.";
  const label = busy
    ? "Please wait…"
    : register
      ? tab === "Admin"
        ? "Register society"
        : "Activate account"
      : `Login as ${tab}`;

  return (
    <ScrollView
      style={{ backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 24, paddingTop: 70, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <Ionicons name="business" size={52} color={colors.navy} />
        <Text style={{ fontSize: 26, fontWeight: "800", color: colors.navy }}>
          SocietyHub
        </Text>
      </View>
      <Segmented<Tab>
        options={["Member", "Admin"]}
        value={tab}
        onChange={switchTab}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: colors.ink,
          marginTop: 20,
        }}
      >
        {title}
      </Text>
      <Text style={{ color: colors.mute, marginTop: 2 }}>{hint}</Text>
      {register && (
        <Field
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
        />
      )}
      {register && tab === "Admin" && (
        <Field
          label="Society name"
          value={society}
          onChangeText={setSociety}
          placeholder="e.g. Greenview Residency"
        />
      )}
      <Field
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
      />
      <Field
        label="Password"
        secureTextEntry={!show}
        value={pw}
        onChangeText={setPw}
        placeholder="At least 6 characters"
      />
      <TouchableOpacity
        onPress={() => setShow(!show)}
        style={{ marginTop: 10, alignSelf: "flex-end" }}
      >
        <Text style={{ color: colors.navy2 }}>
          {show ? "Hide" : "Show"} password
        </Text>
      </TouchableOpacity>
      <Button label={label} onPress={busy ? () => {} : submit} />
      <TouchableOpacity onPress={() => setRegister(!register)}>
        <Text
          style={{ textAlign: "center", color: colors.navy2, marginTop: 18 }}
        >
          {register
            ? "Already have an account? Login"
            : tab === "Admin"
              ? "New society? Register as admin"
              : "First time? Activate your account"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

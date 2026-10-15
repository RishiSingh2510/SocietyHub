import React, { useState } from "react";
import { Alert } from "react-native";
import Screen from "../components/Screen";
import Button from "../components/Button";
import { Field } from "../components/Form";
import { useDb } from "../store";
import { useNav } from "../navigation";
import { useSession } from "../session";

export default function AddComplaintScreen() {
  const { api } = useDb();
  const { flat } = useSession();
  const nav = useNav();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const save = async () => {
    if (!flat)
      return Alert.alert(
        "Your account is not linked to a flat yet",
        "Ask your admin to add your email under Members.",
      );
    if (!title.trim()) return Alert.alert("Add a short title");
    if (await api.addComplaint(title.trim(), details.trim())) nav.back();
  };
  return (
    <Screen title="Raise Complaint" back>
      <Field
        label="What is the problem?"
        required
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Lift not working"
      />
      <Field
        label="Details"
        value={details}
        onChangeText={setDetails}
        placeholder="Add any details"
        multiline
        style={{ minHeight: 110, textAlignVertical: "top" }}
      />
      <Button label="Submit complaint" onPress={save} />
    </Screen>
  );
}

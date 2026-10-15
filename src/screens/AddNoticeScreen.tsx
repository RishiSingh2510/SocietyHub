import React, { useState } from "react";
import { Alert } from "react-native";
import Screen from "../components/Screen";
import Button from "../components/Button";
import { Field } from "../components/Form";
import { useDb } from "../store";
import { useNav } from "../navigation";

export default function AddNoticeScreen() {
  const { api } = useDb();
  const nav = useNav();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const save = async () => {
    if (!title.trim()) return Alert.alert("Add a title");
    if (await api.addNotice(title.trim(), body.trim())) nav.back();
  };
  return (
    <Screen title="Post Notice" back>
      <Field
        label="Title"
        required
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Water tank cleaning on Sunday"
      />
      <Field
        label="Details"
        value={body}
        onChangeText={setBody}
        placeholder="Write the notice"
        multiline
        style={{ minHeight: 110, textAlignVertical: "top" }}
      />
      <Button label="Post notice" onPress={save} />
    </Screen>
  );
}

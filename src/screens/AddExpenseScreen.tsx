import React, { useState } from "react";
import { Alert } from "react-native";
import Screen from "../components/Screen";
import Button from "../components/Button";
import { Field, Select } from "../components/Form";
import { useDb } from "../store";
import { useNav } from "../navigation";
import { FundName } from "../types";
import { EXPENSE_CATEGORIES, monthKey, today, validDate } from "../utils";

export default function AddExpenseScreen({
  params,
}: {
  params?: { month?: string };
}) {
  const { api } = useDb();
  const nav = useNav();
  const [description, setDescription] = useState("");
  const [fund, setFund] = useState<FundName>("Maintenance Fund");
  const [category, setCategory] = useState("Other");
  const [amount, setAmount] = useState("");
  // new expenses default to today, or the 1st of the month being viewed
  const [date, setDate] = useState(
    !params?.month || params.month === monthKey()
      ? today()
      : `${params.month}-01`,
  );
  const save = async () => {
    if (!description.trim() || !(Number(amount) > 0))
      return Alert.alert("Enter a description and an amount");
    if (!validDate(date)) return Alert.alert("Date must look like 2025-04-12");
    if (
      await api.addExpense({
        description: description.trim(),
        fund,
        category,
        amount: Number(amount),
        date,
      })
    )
      nav.back();
  };
  return (
    <Screen title="Add Expense" back>
      <Field
        label="Description"
        required
        value={description}
        onChangeText={setDescription}
        placeholder="Enter expense description"
      />
      <Select
        label="Category"
        required
        options={EXPENSE_CATEGORIES}
        value={category}
        onChange={setCategory}
      />
      <Select
        label="Paid from"
        required
        options={["Maintenance Fund", "Other Collection"] as FundName[]}
        value={fund}
        onChange={setFund}
      />
      <Field
        label="Amount (₹)"
        required
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Field
        label="Date"
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />
      <Button label="Save" onPress={save} />
    </Screen>
  );
}

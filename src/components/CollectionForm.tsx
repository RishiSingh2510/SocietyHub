import React, { useState } from "react";
import { Alert } from "react-native";
import Screen from "./Screen";
import Button from "./Button";
import { Field, Select, Segmented } from "./Form";
import { statusColor } from "./StatusPill";
import { Category, Status } from "../types";
import { useDb } from "../store";
import { useNav } from "../navigation";
import { useSession } from "../session";
import { monthKey, today, validDate, validMonth } from "../utils";

const CATS: Category[] = ["Maintenance", "Parking", "Event", "Other"];

// Shared by "Record Maintenance Payment" (fixed category) and "Add Collection".
// A maintenance payment for a flat/month that already has a bill updates that bill instead of duplicating it.
export default function CollectionForm({
  title,
  fixed,
  defaultMonth,
}: {
  title: string;
  fixed?: Category;
  defaultMonth?: string;
}) {
  const { db, api } = useDb();
  const nav = useNav();
  const { maintenance } = useSession();
  const [flat, setFlat] = useState("");
  const [category, setCategory] = useState<Category>(fixed ?? "Maintenance");
  const [month, setMonth] = useState(defaultMonth ?? monthKey());
  const [amount, setAmount] = useState(String(maintenance));
  const [status, setStatus] = useState<Status>("Paid");
  const [date, setDate] = useState(today());
  const [remarks, setRemarks] = useState("");

  const save = async () => {
    if (!flat || !(Number(amount) > 0))
      return Alert.alert("Select a flat and enter an amount");
    if (!validMonth(month)) return Alert.alert("Month must look like 2025-04");
    if (!validDate(date)) return Alert.alert("Date must look like 2025-04-12");
    const rec = {
      flat,
      category,
      amount: Number(amount),
      status,
      date,
      month,
      remarks,
    };
    const bill =
      category === "Maintenance"
        ? db.collections.find(
            (c) =>
              c.flat === flat &&
              c.category === "Maintenance" &&
              c.month === month,
          )
        : undefined;
    if (
      await (bill
        ? api.updateCollection(bill.id, {
            amount: rec.amount,
            status,
            date,
            remarks,
          })
        : api.addCollection(rec))
    )
      nav.back();
  };
  return (
    <Screen title={title} back>
      <Select
        label="Flat / Unit Number"
        required
        options={[...new Set(db.members.map((m) => m.flat))]}
        value={flat}
        onChange={setFlat}
        placeholder="Select flat"
      />
      {!fixed && (
        <Select
          label="Category"
          required
          options={CATS}
          value={category}
          onChange={setCategory}
        />
      )}
      <Field
        label="For month (YYYY-MM)"
        required
        value={month}
        onChangeText={setMonth}
        placeholder="2025-04"
      />
      <Field
        label="Amount (₹)"
        required
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Segmented
        label="Payment Status"
        required
        options={["Paid", "Pending", "Overdue"] as Status[]}
        value={status}
        onChange={setStatus}
        tint={statusColor}
      />
      <Field
        label="Payment Date"
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />
      <Field
        label="Remarks (optional)"
        value={remarks}
        onChangeText={setRemarks}
        placeholder="Enter remarks"
      />
      <Button label="Save" onPress={save} />
    </Screen>
  );
}

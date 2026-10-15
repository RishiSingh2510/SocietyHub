import React from "react";
import CollectionForm from "../components/CollectionForm";

export default function RecordPaymentScreen({
  params,
}: {
  params?: { month?: string };
}) {
  return (
    <CollectionForm
      title="Record Maintenance Payment"
      fixed="Maintenance"
      defaultMonth={params?.month}
    />
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../theme";

export const Label = ({
  text,
  required,
}: {
  text: string;
  required?: boolean;
}) => (
  <Text style={st.label}>
    {text}
    {required ? <Text style={{ color: colors.red }}> *</Text> : null}
  </Text>
);

export function Field({
  label,
  required,
  ...p
}: TextInputProps & { label: string; required?: boolean }) {
  return (
    <View>
      <Label text={label} required={required} />
      <TextInput placeholderTextColor="#A5B0BD" style={st.input} {...p} />
    </View>
  );
}

type SegProps<T extends string> = {
  label?: string;
  required?: boolean;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  text?: (o: T) => string;
  tint?: (o: T) => string;
  icon?: (o: T) => React.ReactNode;
};
export function Segmented<T extends string>({
  label,
  required,
  options,
  value,
  onChange,
  text,
  tint,
  icon,
}: SegProps<T>) {
  return (
    <View>
      {label ? <Label text={label} required={required} /> : null}
      <View style={st.seg}>
        {options.map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => onChange(o)}
            style={[
              st.pill,
              value === o && {
                backgroundColor: tint ? tint(o) : colors.navy,
                borderColor: "transparent",
              },
            ]}
          >
            {icon && icon(o) ? (
              <View style={{ marginRight: 6 }}>{icon(o)}</View>
            ) : null}
            <Text style={[st.pillT, value === o && { color: "#fff" }]}>
              {text ? text(o) : o}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

type SelProps<T extends string> = {
  label: string;
  required?: boolean;
  options: T[];
  value: T | "";
  onChange: (v: T) => void;
  placeholder?: string;
};
export function Select<T extends string>({
  label,
  required,
  options,
  value,
  onChange,
  placeholder = "Select",
}: SelProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Label text={label} required={required} />
      <TouchableOpacity
        style={[
          st.input,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
        onPress={() => setOpen(!open)}
      >
        <Text style={{ color: value ? colors.ink : "#A5B0BD", fontSize: 15 }}>
          {value || placeholder}
        </Text>
        <Text style={{ color: colors.mute }}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {open && (
        <View style={st.menu}>
          {options.map((o) => (
            <TouchableOpacity
              key={o}
              style={st.opt}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
            >
              <Text style={{ color: colors.ink }}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
const st = StyleSheet.create({
  label: {
    fontSize: 13,
    color: colors.ink,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
  },
  seg: { flexDirection: "row", gap: 8 },
  pill: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  pillT: { color: colors.mute, fontWeight: "600", fontSize: 13 },
  menu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    marginTop: 4,
  },
  opt: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
});

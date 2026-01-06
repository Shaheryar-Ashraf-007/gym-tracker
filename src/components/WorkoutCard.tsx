import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Workout } from "../db/db";
import { prettyDate } from "../utils/dates";
import Chip from "./Chip";

export default function WorkoutCard({
  item,
  isPR,
  onDelete,
}: {
  item: Workout;
  isPR: boolean;
  onDelete: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.exercise}>{item.exercise}</Text>
        <Pressable onPress={onDelete} style={styles.trash}>
          <Ionicons name="trash-outline" size={18} color="#e2e8f0" />
        </Pressable>
      </View>

      <View style={styles.metaRow}>
        <Chip text={`${item.sets} sets`} />
        <Chip text={`${item.reps} reps`} />
        <Chip text={`${Math.round(item.weight)} kg`} />
        {isPR && (
          <View style={styles.prBadge}>
            <Ionicons name="trophy" size={14} color="#0b1220" />
            <Text style={styles.prText}>PR</Text>
          </View>
        )}
      </View>

      {!!item.notes && <Text style={styles.notes}>{item.notes}</Text>}

      <Text style={styles.date}>Date: {prettyDate(item.dayISO)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0b1220",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#111827",
    marginBottom: 12,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  exercise: { color: "#e2e8f0", fontWeight: "900", fontSize: 16 },
  trash: { padding: 8, borderRadius: 12, backgroundColor: "#111827" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10, alignItems: "center" },
  prBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#a3e635",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  prText: { color: "#0b1220", fontWeight: "900", fontSize: 12 },
  notes: { marginTop: 10, color: "#cbd5e1", fontWeight: "700" },
  date: { marginTop: 10, color: "#94a3b8", fontWeight: "700", fontSize: 12 },
});

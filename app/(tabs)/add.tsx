import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import DB, { Exercise } from "../../src/db/db";

const exercises: Exercise[] = ["Bench Press", "Squat", "Deadlift", "Overhead Press", "Pull Ups", "Other"];

export default function AddTab() {
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise>("Bench Press");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("8");
  const [weight, setWeight] = useState("60");
  const [notes, setNotes] = useState("");

  const currentPR = useMemo(() => DB.getPRForExercise(exercise), [exercise]);

  const save = () => {
    const s = Number(sets);
    const r = Number(reps);
    const w = Number(weight);

    if (!Number.isFinite(s) || s <= 0) return Alert.alert("Validation", "Sets must be a positive number.");
    if (!Number.isFinite(r) || r <= 0) return Alert.alert("Validation", "Reps must be a positive number.");
    if (!Number.isFinite(w) || w < 0) return Alert.alert("Validation", "Weight must be 0 or more.");

    DB.addWorkout({ exercise, sets: s, reps: r, weight: w, notes });

    const isNewPR = w > (currentPR ?? 0);
    Alert.alert(isNewPR ? "New PR!" : "Saved", isNewPR ? `New Personal Record for ${exercise}: ${w} kg` : "Workout entry saved.");

    setNotes("");
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 28 }}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="barbell-outline" size={20} color="#0b1220" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.hTitle}>Add Workout</Text>
          <Text style={styles.hSub}>Track sets, reps and weight. PRs are detected automatically.</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Exercise</Text>

        <View style={styles.grid}>
          {exercises.map((ex) => {
            const active = ex === exercise;
            return (
              <Pressable key={ex} onPress={() => setExercise(ex)} style={[styles.exBtn, active && styles.exBtnActive]}>
                <Text style={[styles.exText, active && styles.exTextActive]}>{ex}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.prLine}>Current PR: <Text style={{ color: "#a3e635" }}>{Math.round(currentPR)} kg</Text></Text>

        <Text style={styles.label}>Sets</Text>
        <TextInput value={sets} onChangeText={setSets} keyboardType="numeric" style={styles.input} />

        <Text style={styles.label}>Reps</Text>
        <TextInput value={reps} onChangeText={setReps} keyboardType="numeric" style={styles.input} />

        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput value={notes} onChangeText={setNotes} style={[styles.input, { height: 90 }]} multiline />

        <Pressable onPress={save} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Entry</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#060b16", padding: 14 },
  header: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "#0b1220", borderRadius: 20, padding: 14, borderWidth: 1, borderColor: "#111827" },
  iconWrap: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#a3e635", alignItems: "center", justifyContent: "center" },
  hTitle: { color: "#e2e8f0", fontWeight: "900", fontSize: 18 },
  hSub: { marginTop: 4, color: "#94a3b8", fontWeight: "700" },

  card: { marginTop: 14, backgroundColor: "#0b1220", borderRadius: 20, padding: 14, borderWidth: 1, borderColor: "#111827" },
  label: { marginTop: 10, marginBottom: 6, fontWeight: "900", color: "#e2e8f0" },
  input: { backgroundColor: "#060b16", borderWidth: 1, borderColor: "#111827", borderRadius: 16, padding: 12, fontWeight: "800", color: "#e2e8f0" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  exBtn: { backgroundColor: "#060b16", borderWidth: 1, borderColor: "#111827", borderRadius: 999, paddingVertical: 10, paddingHorizontal: 12 },
  exBtnActive: { backgroundColor: "#a3e635", borderColor: "#a3e635" },
  exText: { color: "#e2e8f0", fontWeight: "800", fontSize: 12 },
  exTextActive: { color: "#0b1220", fontWeight: "900" },

  prLine: { marginTop: 12, color: "#94a3b8", fontWeight: "800" },

  saveBtn: { marginTop: 14, backgroundColor: "#a3e635", borderRadius: 16, padding: 14, alignItems: "center" },
  saveText: { color: "#0b1220", fontWeight: "900" },
});

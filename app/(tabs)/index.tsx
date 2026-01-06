import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import WorkoutCard from "../../src/components/WorkoutCard";
import DB, { Workout } from "../../src/db/db";

export default function DashboardTab() {
  const [items, setItems] = useState<Workout[]>([]);

  const load = () => setItems(DB.getWorkouts(200));

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const todaySets = useMemo(() => DB.getTodayTotalSets(), [items]);

  // Compute PR per exercise for badge
  const prMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const pr of DB.getPRs()) map.set(pr.exercise, pr.pr);
    return map;
  }, [items]);

  const onDelete = (id: number) => {
    Alert.alert("Delete entry?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          DB.deleteWorkout(id);
          load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gym Tracker</Text>
      <Text style={styles.sub}>Log workouts, track progress, and see PRs.</Text>

      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>Total Sets Today</Text>
        <Text style={styles.kpiValue}>{todaySets}</Text>
      </View>

      <Text style={styles.section}>Recent Entries</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <WorkoutCard
            item={item}
            isPR={(prMap.get(item.exercise) ?? 0) === item.weight && item.weight > 0}
            onDelete={() => onDelete(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>No workouts yet. Add one from the Add tab.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#060b16", padding: 14 },
  title: { fontSize: 22, fontWeight: "900", color: "#e2e8f0" },
  sub: { marginTop: 4, marginBottom: 14, color: "#94a3b8", fontWeight: "700" },

  kpiCard: { backgroundColor: "#0b1220", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#111827", marginBottom: 14 },
  kpiLabel: { color: "#94a3b8", fontWeight: "800", fontSize: 12 },
  kpiValue: { marginTop: 6, color: "#a3e635", fontWeight: "900", fontSize: 26 },

  section: { marginBottom: 10, fontWeight: "900", color: "#e2e8f0" },
  empty: { marginTop: 30, textAlign: "center", color: "#94a3b8", fontWeight: "700" },
});

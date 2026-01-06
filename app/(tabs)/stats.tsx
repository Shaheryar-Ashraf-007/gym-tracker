import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import DB from "../../src/db/db";

export default function StatsTab() {
  const [prs, setPrs] = useState<{ exercise: string; pr: number }[]>([]);

  const load = () => setPrs(DB.getPRs());

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const reset = () => {
    Alert.alert("Reset all data?", "This will delete all workouts permanently.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          DB.resetAll();
          load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Records</Text>
      <Text style={styles.sub}>Your best weight for each exercise.</Text>

      <FlatList
        data={prs}
        keyExtractor={(i) => i.exercise}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.ex}>{item.exercise}</Text>
            <Text style={styles.val}>{Math.round(item.pr)} kg</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No PRs yet. Add workouts first.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Pressable onPress={reset} style={styles.resetBtn}>
        <Text style={styles.resetText}>Reset All Data</Text>
      </Pressable>

      <Text style={styles.footer}>✅ Extra feature: PR tracking + PR badge for max weight entries.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#060b16", padding: 14 },
  title: { fontSize: 22, fontWeight: "900", color: "#e2e8f0" },
  sub: { marginTop: 4, marginBottom: 14, color: "#94a3b8", fontWeight: "700" },

  row: { backgroundColor: "#0b1220", borderWidth: 1, borderColor: "#111827", borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ex: { color: "#e2e8f0", fontWeight: "900" },
  val: { color: "#a3e635", fontWeight: "900" },
  empty: { marginTop: 30, textAlign: "center", color: "#94a3b8", fontWeight: "700" },

  resetBtn: { marginTop: 8, backgroundColor: "#ef4444", padding: 14, borderRadius: 16, alignItems: "center" },
  resetText: { color: "white", fontWeight: "900" },

  footer: { marginTop: 12, color: "#94a3b8", fontWeight: "700" },
});

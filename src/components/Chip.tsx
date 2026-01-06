import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Chip({ text }: { text: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.txt}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  txt: { color: "#e2e8f0", fontWeight: "800", fontSize: 12 },
});

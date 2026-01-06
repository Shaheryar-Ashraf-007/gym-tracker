import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import DB from "../src/db/db";

export default function RootLayout() {
  useEffect(() => {
    DB.initDb();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#0b1220" />
      <Stack screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

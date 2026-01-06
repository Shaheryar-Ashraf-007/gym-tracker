import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#a3e635",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: { height: 70, paddingTop: 10, paddingBottom: 10, backgroundColor: "#0b1220", borderTopColor: "#111827" },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "800" },
        headerStyle: { backgroundColor: "#0b1220" },
        headerTintColor: "#e2e8f0",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "barbell" : "barbell-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "PRs",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "trophy" : "trophy-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

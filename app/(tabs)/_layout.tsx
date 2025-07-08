import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "#3dffa8",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {

          backgroundColor: "#25292e",
        },
      }}
    >

      <Tabs.Screen
        name="setting"
        options={{
          title: "تنظیمات",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings-sharp" : "settings-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
            <Tabs.Screen
        name="index"
        options={{
          title: "اوقات شرعی",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "moon-sharp" : "moon-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

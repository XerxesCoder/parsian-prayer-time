import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ title: "اوقات شرعی شهرستان پارسیان", headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

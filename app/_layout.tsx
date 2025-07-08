import "@/global.css";

import { useFonts } from "expo-font";

import {
  handleNotificationResponse,
  registerForPushNotificationsAsync,
} from "@/utils/NotificationManager";
import * as Notifications from "expo-notifications";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Vazirmatn-Bold": require("@/assets/fonts/Vazirmatn-Bold.ttf"),
    "Vazirmatn-Regular": require("@/assets/fonts/Vazirmatn-Regular.ttf"),
  });

  useEffect(() => {
    // Set up notifications
    const setupNotifications = async () => {
      await registerForPushNotificationsAsync();

      const subscription =
        Notifications.addNotificationResponseReceivedListener(
          handleNotificationResponse
        );

      return () => subscription.remove();
    };

    if (fontsLoaded && !error) {
      SplashScreen.hideAsync();
      setupNotifications();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer } from "expo-audio";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { adhanOptions } from "../helpers/constants";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldPlaySound: notification.request.content.data.playSound || false,
    shouldShowBanner: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("prayer_channel", {
      name: "اذان و اعلانات نماز",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("دسترسی اعلان داده نشد");
      return null;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) throw new Error("شناسه پروژه یافت نشد");

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      return token;
    } catch (err) {
      console.error("Expo Push Token Error:", err);
      return null;
    }
  } else {
    console.log("اعلان‌ها فقط در دستگاه واقعی پشتیبانی می‌شوند");
    return null;
  }
}

export async function schedulePrayerNotifications(prayerTimes) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const [
    adhanEnabled,
    notify10min,
    notify5min,
    adhanSoundIndex,
    defaultPrayerMethod,
  ] = await Promise.all([
    AsyncStorage.getItem("adhanEnabled"),
    AsyncStorage.getItem("notify10min"),
    AsyncStorage.getItem("notify5min"),
    AsyncStorage.getItem("adhanSoundIndex"),
    AsyncStorage.getItem("defaultPrayerMethod"),
  ]);

  const now = new Date();
  const nextPrayer = prayerTimes[defaultPrayerMethod || "shia"]?.nextPrayer;

  if (!nextPrayer) return;

  const prayerName = getPrayerName(nextPrayer.name);
  const prayerTime = new Date(nextPrayer.time);

  const secondsUntilPrayer = Math.floor((prayerTime - now) / 1000);
  const secondsUntil10MinBefore = secondsUntilPrayer - 10 * 60;
  const secondsUntil5MinBefore = secondsUntilPrayer - 5 * 60;

  if (adhanEnabled === "true" && secondsUntilPrayer > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `وقت ${prayerName}`,
        body: "اذان",
        sound: true,
        data: {
          playSound: true,
          adhanSoundIndex: parseInt(adhanSoundIndex || "0"),
          type: "adhan",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilPrayer,
        repeats: false,
      },
    });
  }

  // Schedule 10 minute reminder if enabled
  if (notify10min === "true" && secondsUntil10MinBefore > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `۱۰ دقیقه به ${prayerName}`,
        body: "آماده شوید",
        sound: false,
        data: { type: "reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntil10MinBefore,
        repeats: false,
      },
    });
  }

  // Schedule 5 minute reminder if enabled
  if (notify5min === "true" && secondsUntil5MinBefore > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `۵ دقیقه به ${prayerName}`,
        body: "آماده شوید",
        sound: false,
        data: { type: "reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntil5MinBefore,
        repeats: false,
      },
    });
  }
}

export async function scheduleNotification({ adhanSoundIndexx }) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `وقت نماز`,
        body: "اذان",
        sound: true,
        data: {
          playSound: true,
          adhanSoundIndex: parseInt(adhanSoundIndexx || "0"),
          type: "adhan",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: null,
        repeats: false,
      },
    });
  } catch (error) {
    console.error(`خطا در زمان‌بندی اعلان ${type}:`, error);
  }
}

// Handle notification received
export async function handleNotificationResponse(response) {
  console.log(response);
  const { playSound, adhanSoundIndex, type } =
    response.notification.request.content.data;

  if (playSound && type === "adhan") {
    await playAdhanSound(adhanSoundIndex || 0);
  }
}

async function playAdhanSound(index) {
  try {
    const adhanSound = adhanOptions[index].value;
    const player = useAudioPlayer(adhanSound);
    player.seekTo(0);
    player.play();
  } catch (error) {
    console.error("خطا در پخش اذان:", error);
  }
}

function getPrayerName(key) {
  const names = {
    fajr: "اذان صبح",
    dhuhr: "اذان ظهر",
    asr: "اذان عصر",
    maghrib: "اذان مغرب",
    isha: "اذان عشا",
    sunrise: "طلوع آفتاب",
  };
  return names[key] || key;
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

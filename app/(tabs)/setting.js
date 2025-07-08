import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer } from "expo-audio";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { adhanOptions, calculationMethods } from "../../helpers/constants";

export default function Settings() {
  const [adhanSoundIndex, setAdhanSoundIndex] = useState(0);
  const adhanSound = adhanOptions[adhanSoundIndex].value;
  const player = useAudioPlayer(adhanSound);
  const [isPlaying, setIsPlaying] = useState(false);
  const [adhanEnabled, setadhanEnabled] = useState(true);
  const [notify10min, setNotify10min] = useState(false);
  const [notify5min, setNotify5min] = useState(false);
  const [defaultPrayerMethod, setDefaultPrayerMethod] = useState("shia");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const soundIndex = await AsyncStorage.getItem("adhanSoundIndex");
        const notif = await AsyncStorage.getItem("adhanEnabled");
        const ten = await AsyncStorage.getItem("notify10min");
        const five = await AsyncStorage.getItem("notify5min");
        const defaultMethod = await AsyncStorage.getItem("defaultPrayerMethod");

        if (soundIndex !== null) setAdhanSoundIndex(parseInt(soundIndex));
        if (notif !== null) setadhanEnabled(notif === "true");
        if (ten !== null) setNotify10min(ten === "true");
        if (five !== null) setNotify5min(five === "true");
        if (defaultMethod) setDefaultPrayerMethod(defaultMethod);
      } catch (e) {
        console.error("Error loading settings", e);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await AsyncStorage.multiSet([
        ["adhanSoundIndex", adhanSoundIndex.toString()],
        ["adhanEnabled", adhanEnabled.toString()],
        ["notify10min", notify10min.toString()],
        ["notify5min", notify5min.toString()],
        ["defaultPrayerMethod", defaultPrayerMethod],
      ]);

      if (adhanEnabled) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          await Notifications.requestPermissionsAsync();
        }
      }

      Alert.alert("تنظیمات ذخیره شد", "تغییرات شما با موفقیت ذخیره شد");
    } catch (e) {
      Alert.alert("خطا", "خطا در ذخیره تنظیمات");
    }
  };

  return (
    <ScrollView className="bg-slate-950">
      <SafeAreaView className="flex-1 px-6 py-4">
        <Text className="text-white text-3xl font-bold mb-6 text-right border-b-2 border-emerald-900 pb-1">
          تنظیمات
        </Text>

        <View className="mb-6">
          <Text className="text-white text-base mb-2 text-right">
            روش پیش‌ فرض نمایش اوقات شرعی
          </Text>
          {calculationMethods.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`p-3 rounded-lg mb-2 flex-row-reverse justify-between items-center ${
                defaultPrayerMethod === item.value
                  ? "bg-emerald-700 border border-slate-950"
                  : "bg-slate-900/40 border border-emerald-500/50"
              }`}
              onPress={() => setDefaultPrayerMethod(item.value)}
            >
              <Text className="text-white text-right">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-3 flex-row-reverse justify-between items-center">
          <Text className="text-white text-base">
            اعلان ۱۰ دقیقه قبل از اذان
          </Text>
          <Switch
            value={notify10min}
            onValueChange={setNotify10min}
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={notify10min ? "#3dffa8" : "#f4f3f4"}
          />
        </View>
        <View className="mb-6 flex-row-reverse justify-between items-center">
          <Text className="text-white text-base">
            اعلان ۵ دقیقه قبل از اذان
          </Text>
          <Switch
            value={notify5min}
            onValueChange={setNotify5min}
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={notify5min ? "#3dffa8" : "#f4f3f4"}
          />
        </View>

        <View className="mb-3 flex-row-reverse justify-between items-center">
          <Text className="text-white text-base">فعال‌ سازی اذان</Text>
          <Switch
            value={adhanEnabled}
            onValueChange={setadhanEnabled}
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={adhanEnabled ? "#3dffa8" : "#f4f3f4"}
          />
        </View>

        {adhanEnabled && (
          <>
            {/* Adhan Sound Selection */}
            <View className="mb-6">
              <Text className="text-white text-base mb-2 text-right">
                انتخاب صدای اذان
              </Text>
              {adhanOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-3 rounded-lg mb-2 flex-row-reverse justify-between items-center border ${
                    adhanSoundIndex === index
                      ? "bg-emerald-400/80 border-slate-950"
                      : "bg-slate-900/40  border-emerald-500/40"
                  }`}
                  onPress={() => {
                    setAdhanSoundIndex(index);
                    player.pause();
                    player.seekTo(0);
                    setIsPlaying(false);
                  }}
                  activeOpacity={0.9}
                >
                  <View className="flex-row-reverse items-center gap-x-2">
                    <Text className="text-white text-right">{item.label}</Text>
                    <View className="bg-blue-700 px-2 py-0.5 rounded-full">
                      <Text className="text-white text-xs">{item.tag}</Text>
                    </View>
                  </View>

                  {adhanSoundIndex === index && (
                    <TouchableOpacity
                      className="bg-slate-950 border px-3 py-1 rounded-md"
                      onPress={(e) => {
                        e.stopPropagation();
                        if (isPlaying) {
                          player.pause();
                          player.seekTo(0);
                          setIsPlaying(false);
                        } else {
                          player.seekTo(0);
                          player.play();
                          setIsPlaying(true);
                        }
                      }}
                    >
                      <Text className="text-white text-xs">
                        {isPlaying ? "توقف" : "پخش"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          className="bg-emerald-300 py-3 rounded-lg mt-4"
          onPress={saveSettings}
        >
          <Text className="text-black text-center font-bold">
            ذخیره تنظیمات
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

import PrayCard from "@/components/PrayCard";
import TimeCard from "@/components/TimeCard";
import usePrayerTimes from "@/hooks/prayerTime";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { prayerCards } from "../../helpers/constants";
import { schedulePrayerNotifications } from "../../utils/NotificationManager";
export default function Index() {
  const { Shia, Sunni } = usePrayerTimes();
  const [activeTab, setActiveTab] = useState("Shia");
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const prayerData = activeTab === "Shia" ? Shia : Sunni;

  useEffect(() => {
    if (!prayerData) return;

    const interval = setInterval(() => {
      const now = new Date();

      if (prayerData.nextPrayer) {
        const remaining = Math.floor(
          (prayerData.nextPrayer.time.getTime() - now.getTime()) / 1000
        );
        setCountdown(remaining > 0 ? remaining : 0);
        setNextPrayer(prayerData.nextPrayer.name);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerData, activeTab]);

  useEffect(() => {
    const loadDefaultMethod = async () => {
      try {
        const defaultMethod = await AsyncStorage.getItem("defaultPrayerMethod");
        if (defaultMethod) {
          setActiveTab(defaultMethod === "sunni" ? "Sunni" : "Shia");
        }
      } catch (e) {
        console.error("Error loading default method", e);
      }
    };

    loadDefaultMethod();
  }, []);

  useEffect(() => {
    if (Shia && Sunni) {
      schedulePrayerNotifications({
        shia: Shia,
        sunni: Sunni,
      });
    }
  }, [Shia, Sunni]);

  return (
    <ScrollView className="bg-slate-950">
      <SafeAreaView className="flex-1 items-center px-6 py-4">
        <TimeCard name={activeTab === "Shia" ? "تـشـیـع" : "تـسـنـن"} />
        <View className="flex-row justify-center mt-4 w-full">
          <TouchableOpacity
            className={`px-6 py-2 rounded-l-full ${
              activeTab === "Shia" ? "bg-blue-600" : "bg-slate-800"
            }`}
            onPress={() => setActiveTab("Shia")}
          >
            <Text className="text-white font-bold">تـشـیـع</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-r-full ${
              activeTab === "Sunni" ? "bg-blue-600" : "bg-slate-800"
            }`}
            onPress={() => setActiveTab("Sunni")}
          >
            <Text className="text-white font-bold">تـسـنـن</Text>
          </TouchableOpacity>
        </View>

        <View className="w-full flex-col items-center gap-3 mt-6">
          {prayerCards.map((p) => (
            <PrayCard
              key={p.key}
              type={p.name}
              time={prayerData?.times?.[p.key] || "--:--"}
              isNextPrayer={nextPrayer === p.key}
              icon={<Ionicons name={p.icon} size={20} color="white" />}
              countdown={nextPrayer === p.key ? countdown : undefined}
              img={p.image}
            />
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

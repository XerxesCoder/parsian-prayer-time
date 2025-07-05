import PrayCard from "@/components/PrayCard";
import TimeCard from "@/components/TimeCard";
import usePrayerTimes from "@/hooks/prayerTime";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const timeToDate = (timeString: string, currentDate: Date) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date(currentDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export default function Sunni() {
  const { Sunni } = usePrayerTimes();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const prayers = [
      { name: "اذان صبح", time: Sunni.fajr },
      { name: "طلوع آفتاب", time: Sunni.sunrise },
      { name: "اذان ظهر", time: Sunni.dhuhr },
      { name: "اذان عصر", time: Sunni.asr },
      { name: "اذان مغرب", time: Sunni.maghrib },
      { name: "اذان عشا", time: Sunni.isha },
    ];

    let current: string | null = null;
    let next: string | null = null;

    const prayerTimes = prayers.map((prayer) => ({
      name: prayer.name,
      time: timeToDate(prayer.time, currentTime),
    }));

    for (let i = prayerTimes.length - 1; i >= 0; i--) {
      if (currentTime >= prayerTimes[i].time) {
        current = prayerTimes[i].name;
        break;
      }
    }

    for (let i = 0; i < prayerTimes.length; i++) {
      if (currentTime < prayerTimes[i].time) {
        next = prayerTimes[i].name;
        break;
      }
    }

    if (!next && prayerTimes.length > 0) {
      next = prayerTimes[0].name;
    }

    setCurrentPrayer(current);
    setNextPrayer(next);
  }, [Sunni, currentTime]);

  return (
    <SafeAreaView className="flex-1 items-center justify-start px-6 py-10 bg-slate-950">
      <TimeCard name={"تـسـنـن"} />
      <View className="w-full flex-col justify-between items-center gap-3 mt-6">
        <PrayCard
          type="اذان صبح"
          time={Sunni.fajr}
          currentTime={currentTime}
          isCurrentPrayer={currentPrayer === "اذان صبح"}
          isNextPrayer={nextPrayer === "اذان صبح"}
          icon={<Ionicons name={"sunny-sharp"} size={20} color={"white"} />}
        />
        <PrayCard
          type="طلوع آفتاب"
          time={Sunni.sunrise}
          currentTime={currentTime}
          isCurrentPrayer={currentPrayer === "طلوع آفتاب"}
          isNextPrayer={nextPrayer === "طلوع آفتاب"}
          icon={<Ionicons name={"sunny"} size={20} color={"white"} />}
        />
        <PrayCard
          type="اذان ظهر"
          time={Sunni.dhuhr}
          currentTime={currentTime}
          isCurrentPrayer={currentPrayer === "اذان ظهر"}
          isNextPrayer={nextPrayer === "اذان ظهر"}
          icon={<Ionicons name={"moon-sharp"} size={20} color={"white"} />}
        />
        <PrayCard
          type="اذان عصر"
          time={Sunni.asr}
          currentTime={currentTime}
          isCurrentPrayer={currentPrayer === "اذان عصر"}
          isNextPrayer={nextPrayer === "اذان عصر"}
          icon={<Ionicons name={"moon-sharp"} size={20} color={"white"} />}
        />
        <PrayCard
          type="اذان مغرب"
          time={Sunni.maghrib}
          currentTime={currentTime}
          isCurrentPrayer={currentPrayer === "اذان مغرب"}
          isNextPrayer={nextPrayer === "اذان مغرب"}
          icon={<Ionicons name={"moon-sharp"} size={20} color={"white"} />}
        />
        <PrayCard
          type="اذان عشا"
          time={Sunni.isha}
          currentTime={currentTime}
          isCurrentPrayer={currentPrayer === "اذان عشا"}
          isNextPrayer={nextPrayer === "اذان عشا"}
          icon={<Ionicons name={"moon-sharp"} size={20} color={"white"} />}
        />
      </View>
    </SafeAreaView>
  );
}

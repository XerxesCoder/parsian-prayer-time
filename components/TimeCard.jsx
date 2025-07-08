import {
  formatDate,
  formatDateQamari,
  getPersianWeekday,
} from "@/helpers/utils";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
export default function TimeCard({ name }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 w-full shadow-lg shadow-emerald-500/10 border border-emerald-500/20">
      <Text className="text-center text-emerald-400 text-lg font-bold mb-2 font-vazir-bold">
        اوقات شرعی پارسیان
      </Text>

      <View className="flex-col items-center gap-2">
        <View className="bg-emerald-500/10 px-4 py-2 rounded-full w-full items-center">
          <Text className="text-3xl font-bold text-emerald-400">
            اهل {name}
          </Text>
        </View>

        <View className="flex-col items-center gap-1 w-full">
          <View className="flex-row justify-center gap-3 w-full">
            <Text className="text-base text-emerald-300/80">
              {formatDateQamari(currentTime)}
            </Text>
            <Text className="text-base text-emerald-300">|</Text>
            <Text className="text-base text-emerald-300">
              {formatDate(currentTime)}
            </Text>
            <Text className="text-base text-emerald-300">|</Text>
            <Text className="text-base text-emerald-300">
              {getPersianWeekday(currentTime)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

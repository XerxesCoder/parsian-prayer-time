import { toPersianDigits } from "@/helpers/utils";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type PrayCardProps = {
  type: string;
  time: string;
  currentTime: Date;
  isNextPrayer?: boolean;
  isCurrentPrayer?: boolean;
  icon: any;
};

export default function PrayCard({
  type,
  time,
  currentTime,
  isNextPrayer = false,
  isCurrentPrayer = false,
  icon,
}: PrayCardProps) {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = currentTime;
      const [hours, minutes] = time.split(":").map(Number);
      const prayerTime = new Date(now);
      prayerTime.setHours(hours, minutes, 0, 0);

      if (prayerTime > now) {
        const diff = prayerTime.getTime() - now.getTime();
        const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
        const minutesRemaining = Math.floor(
          (diff % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeRemaining(
          `${hoursRemaining}:${minutesRemaining.toString().padStart(2, "0")}`
        );
      } else {
        setTimeRemaining("");
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 30000);

    return () => clearInterval(interval);
  }, [time, currentTime]);

  return (
    <View
      className={`
        flex-row-reverse items-center justify-between gap-4 
        rounded-xl p-4 w-full
        ${
          isCurrentPrayer
            ? "bg-blue-900/30 border-2 border-blue-400"
            : isNextPrayer
              ? "bg-emerald-900/40 border border-emerald-500/50"
              : "bg-slate-900/50 border border-slate-700/50"
        }
        shadow-md ${isCurrentPrayer ? "shadow-blue-500/20" : "shadow-slate-500/10"}
      `}
    >
      <View className="flex-row-reverse items-center gap-3">
        <View className="p-2 bg-slate-800/50 rounded-full">{icon}</View>

        <View className="flex-row items-center gap-2">
          <Text
            className={`
              font-bold text-lg
              ${
                isCurrentPrayer
                  ? "text-blue-300"
                  : isNextPrayer
                    ? "text-emerald-300"
                    : "text-slate-200"
              }
            `}
          >
            {type}
          </Text>

          {isNextPrayer && (
            <View className="bg-emerald-600/80 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">بعدی</Text>
            </View>
          )}

          {isCurrentPrayer && (
            <View className="bg-blue-600 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">هم اکنون</Text>
            </View>
          )}
        </View>
      </View>

      <View className="items-start">
        <Text
          className={`
            font-bold text-2xl 
            ${
              isCurrentPrayer
                ? "text-blue-300"
                : isNextPrayer
                  ? "text-emerald-300"
                  : "text-slate-100"
            }
            tracking-widest
          `}
        >
          {toPersianDigits(time)}
        </Text>

        {isNextPrayer && timeRemaining && (
          <Text className="text-emerald-200/80 text-xs mt-1">
            {toPersianDigits(timeRemaining)} باقی مانده
          </Text>
        )}
      </View>
    </View>
  );
}

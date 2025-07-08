import { toPersianDigits } from "@/helpers/utils";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

export default function PrayCard({
  type,
  time,
  isNextPrayer = false,
  icon,
  countdown,
  img,
}) {
  const [timeRemaining, setTimeRemaining] = useState("");

  const allImages = {
    "1.png": require("@/assets/images/1.png"),
    "2.png": require("@/assets/images/2.png"),
    "3.png": require("@/assets/images/3.png"),
    "4.png": require("@/assets/images/4.png"),
    "5.png": require("@/assets/images/5.png"),
    "6.png": require("@/assets/images/6.png"),
  };

  useEffect(() => {
    if (countdown === undefined) return;

    const formatCountdown = (seconds) => {
      if (seconds <= 0) return "00:00:00";

      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    setTimeRemaining(formatCountdown(countdown));
  }, [countdown]);

  return (
    <View
      className={`
        flex-row-reverse items-center justify-between gap-4 
        rounded-xl p-4 w-full
        ${
          isNextPrayer
            ? "bg-emerald-900/40 border border-emerald-500/50"
            : "bg-slate-900/50 border border-slate-700/50"
        }
        shadow-md
      `}
    >
      <View className="flex-row-reverse items-center gap-3">
       {/*  <View className="p-2 bg-slate-800/50 rounded-full">{icon}</View> */}
        <Image source={allImages[img]} className="w-6 h-6" />
        <View className="flex-row items-center gap-2">
          <Text
            className={`
              font-bold text-lg
              ${isNextPrayer ? "text-emerald-300" : "text-slate-200"}
            `}
          >
            {type}
          </Text>

          {isNextPrayer && (
            <View className="bg-emerald-600/80 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">بعدی</Text>
            </View>
          )}
        </View>
      </View>

      <View className="items-start">
        <Text
          className={`
            font-bold text-2xl 
            ${isNextPrayer ? "text-emerald-300" : "text-slate-100"}
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

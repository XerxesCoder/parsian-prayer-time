import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";

// Define once at top level
const sources = {
  "mecca.mp3": require("@/assets/adhan.mp3"),
  "medina.mp3": require("@/assets/adhan.mp3"),
  "aqsa.mp3": require("@/assets/adhan.mp3"),
};

// Default fallback
const defaultSound = "mecca.mp3";

export default function useAdhan() {
  const [adhanKey, setAdhanKey] = useState(defaultSound);
  const player = useAudioPlayer(sources[adhanKey]);

  // Load adhan selection on mount
  useEffect(() => {
    const loadSound = async () => {
      const stored = await AsyncStorage.getItem("adhanSound");
      if (stored && sources[stored]) setAdhanKey(stored);
    };
    loadSound();
  }, []);

  // Expose controls
  const playAdhan = async () => {
    try {
      await player.play();
    } catch (err) {
      console.error("خطا در پخش اذان:", err);
    }
  };

  const stopAdhan = async () => {
    try {
      await player.stop();
    } catch (err) {
      console.error("خطا در توقف اذان:", err);
    }
  };

  const replayAdhan = async () => {
    try {
      await player.seekTo(0);
      await player.play();
    } catch (err) {
      console.error("خطا در پخش مجدد اذان:", err);
    }
  };

  return {
    adhanKey,
    playAdhan,
    stopAdhan,
    replayAdhan,
  };
}

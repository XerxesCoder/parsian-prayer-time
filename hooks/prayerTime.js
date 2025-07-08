import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";

export default function usePrayerTimes() {
  const coordinates = new Coordinates(27.21, 53.03);
  const params = CalculationMethod.MoonsightingCommittee();
  const paramsShia = CalculationMethod.Tehran();
  const date = new Date();

  const Sunni = new PrayerTimes(coordinates, date, params);
  const Shia = new PrayerTimes(coordinates, date, paramsShia);

  function formatPrayerTimes(prayerTimes, timeZone) {
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    };

    const formatter = new Intl.DateTimeFormat("en-US", timeOptions);

    const formatTime = (date) => {
      return formatter.format(date).replace("24:", "00:");
    };

    return {
      fajr: formatTime(prayerTimes.fajr),
      sunrise: formatTime(prayerTimes.sunrise),
      dhuhr: formatTime(prayerTimes.dhuhr),
      asr: formatTime(prayerTimes.asr),
      sunset: formatTime(prayerTimes.sunset),
      maghrib: formatTime(prayerTimes.maghrib),
      isha: formatTime(prayerTimes.isha),
    };
  }

  function getNextPrayerInfo(prayerTimes) {
    const now = new Date();
    const prayers = [
      { name: "fajr", time: prayerTimes.fajr },
      { name: "sunrise", time: prayerTimes.sunrise },
      { name: "dhuhr", time: prayerTimes.dhuhr },
      { name: "asr", time: prayerTimes.asr },
      { name: "maghrib", time: prayerTimes.maghrib },
      { name: "isha", time: prayerTimes.isha },
    ];

    // Find next prayer
    for (const prayer of prayers) {
      if (prayer.time > now) {
        return {
          name: prayer.name,
          time: prayer.time,
          remaining: Math.floor((prayer.time.getTime() - now.getTime()) / 1000),
        };
      }
    }

    // If no prayer found, return first prayer of next day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params);
    return {
      name: "fajr",
      time: tomorrowPrayerTimes.fajr,
      remaining: Math.floor((tomorrowPrayerTimes.fajr.getTime() - now.getTime()) / 1000),
    };
  }

  const formattedSunni = formatPrayerTimes(Sunni, "Asia/Tehran");
  const formattedShia = formatPrayerTimes(Shia, "Asia/Tehran");

  const nextSunniPrayer = getNextPrayerInfo(Sunni);
  const nextShiaPrayer = getNextPrayerInfo(Shia);

  return {
    Sunni: {
      times: formattedSunni,
      nextPrayer: nextSunniPrayer,
    },
    Shia: {
      times: formattedShia,
      nextPrayer: nextShiaPrayer,
    },
  };
}
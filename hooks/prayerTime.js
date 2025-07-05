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

  const formattedSunni = formatPrayerTimes(Sunni, "Asia/Tehran");
  const formattedShia = formatPrayerTimes(Shia, "Asia/Tehran");

  return {
    Sunni: formattedSunni,
    Shia: formattedShia,
  };
}

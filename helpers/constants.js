  export const prayerCards = [
    {
      key: "fajr",
      name: "اذان صبح",
      icon: "sunny-sharp",
      image: "1.png",
    },
    {
      key: "sunrise",
      name: "طلوع آفتاب",
      icon: "sunny",
      image: "2.png",
    },
    {
      key: "dhuhr",
      name: "اذان ظهر",
      icon: "moon-sharp",
      image: "3.png",
    },
    {
      key: "asr",
      name: "اذان عصر",
      icon: "moon-sharp",
      image: "4.png",
    },
    {
      key: "maghrib",
      name: "اذان مغرب",
      icon: "moon-sharp",
      image: "5.png",
    },
    {
      key: "isha",
      name: "اذان عشا",
      icon: "moon-sharp",
      image: "6.png",
    },
  ];



  export const adhanOptions = [
  { label: "اذان 1", value: require("@/assets/adhan/a1.mp3"), tag: "تسنن" },
  { label: "اذان 2", value: require("@/assets/adhan/a2.mp3"), tag: "تسنن" },
  { label: "اذان 3", value: require("@/assets/adhan/a3.mp3"), tag: "تسنن" },
  { label: "اذان 4", value: require("@/assets/adhan/a4.mp3"), tag: "تسنن" },
  { label: "اذان 5", value: require("@/assets/adhan/s1.mp3"), tag: "تشیع" },
  { label: "اذان 6", value: require("@/assets/adhan/s2.mp3"), tag: "تشیع" },
  { label: "اذان 7", value: require("@/assets/adhan/s3.mp3"), tag: "تشیع" },
  { label: "اذان 8", value: require("@/assets/adhan/s4.mp3"), tag: "تشیع" },
];

export const calculationMethods = [
  { label: "تشیع (تهران)", value: "shia" },
  { label: "تسنن (کمیته رویت هلال)", value: "sunni" },
];

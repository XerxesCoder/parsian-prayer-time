export const formatTime = (date) => {
  return date.toLocaleTimeString("fa-IR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: "persian",
  }).format(date);
};

export const formatDateQamari = (date) => {
  return new Intl.DateTimeFormat("fa-IR-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const getPersianWeekday = (date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
  }).format(date);
};


  export const toPersianDigits = (num) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(num).replace(
      /[0-9]/g,
      (digit) => persianDigits[parseInt(digit)]
    );
  };
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  calendar: {
    lastDay: "[Yesterday] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[Tomorrow] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[Today] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("ko", {
  calendar: {
    lastDay: "[어제] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[내일] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[오늘] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});

dayjs.updateLocale("es", {
  calendar: {
    lastDay: "[Ayer] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Semana Pasada] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[Mañana] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[Hoy] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});

dayjs.updateLocale("de", {
  calendar: {
    lastDay: "[Gestern] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[Morgen] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[Heute] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("fr", {
  calendar: {
    lastDay: "[Hier] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[Demain] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[Aujourd'hui] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("id", {
  calendar: {
    lastDay: "[Kemarin] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[Kemarin] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[Hari ini] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("ja", {
  calendar: {
    lastDay: "[昨日] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[明日] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[今日] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("ms", {
  calendar: {
    lastDay: "[Semalam] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[Esok] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[Hari ini] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("pt", {
  calendar: {
    lastDay: "[Ontem] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[Amanhã] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[Hoje] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("ru", {
  calendar: {
    lastDay: "[Вчерашний день] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[Завтра] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[Сегодня] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("th", {
  calendar: {
    lastDay: "[เมื่อวาน] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[พรุ่งนี้] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[วันนี้] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("vi", {
  calendar: {
    lastDay: "[Hôm qua] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[Ngày mai] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[Hôm nay] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("zh", {
  calendar: {
    lastDay: "[昨天] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[明天] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[今天] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("hi", {
  calendar: {
    lastDay: "[कल] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[कल का दिन] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[आज] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("te", {
  calendar: {
    lastDay: "[నిన్న] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[రేపు] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[ఈరోజు] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});
dayjs.updateLocale("km", {
  calendar: {
    lastDay: "[ម្សិលមិញ] HH:mm", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd HH:mm", // Last week ( Last Monday at 2:30 AM )
    nextDay: "[ថ្ងៃស្អែក] HH:mm", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd HH:mm", // The next week ( Sunday at 2:30 AM )
    sameDay: "[ថ្ងៃនេះ] HH:mm", // The same day ( Today at 2:30 AM )
    sameElse: "DD/MM HH:mm", // Everything else ( 7/10/2011 )
  },
});

export default dayjs;

import dayjs from "dayjs";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getMonths = (language) =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthIndex) =>
    capitalizeFirstLetter(dayjs().set("month", monthIndex).toDate().toLocaleString(language, { month: "long" })),
  );

export const getWeekdaysLong = (language) =>
  [0, 1, 2, 3, 4, 5, 6].map((monthIndex) =>
    capitalizeFirstLetter(dayjs().day(monthIndex).toDate().toLocaleString(language, { weekday: "long" })),
  );

export const getWeekdaysShort = (language) =>
  [0, 1, 2, 3, 4, 5, 6].map((monthIndex) =>
    capitalizeFirstLetter(dayjs().day(monthIndex).toDate().toLocaleString(language, { weekday: "short" })),
  );

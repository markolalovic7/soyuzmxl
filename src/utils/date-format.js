import {
  DATE_DAY_NUMBER_MONTH_TIME_FORMAT_EN,
  DATE_DAY_NUMBER_MONTH_TIME_FORMAT_KO,
  DATE_EZ_FORMAT_DAY_NUMBER_MONTH_EN,
  DATE_EZ_FORMAT_DAY_NUMBER_MONTH_KO,
  DATE_FORMAT_DAY_NUMBER_MONTH_EN,
  DATE_FORMAT_DAY_NUMBER_MONTH_KO,
  DATE_FORMAT_EN,
  DATE_FORMAT_KO,
  DATE_MY_BETS_EN,
  DATE_MY_BETS_KO,
  DATE_SHORT_WEEKDAY_MONTH_DAY_NUMBER_YEAR_EN,
  DATE_SHORT_WEEKDAY_MONTH_DAY_NUMBER_YEAR_KO,
  DATE_SLASH_TIME_FORMAT_EN,
  DATE_SLASH_TIME_FORMAT_KO,
  DATE_WEEKDAY_MONTH_DAY_NUMBER_EN,
  DATE_WEEKDAY_MONTH_DAY_NUMBER_KO,
} from "constants/date";

// Example: Tuesday, 23 March 23:00
export const getLocaleFullDateFormat = (locale) =>
  ({
    en: DATE_FORMAT_EN,
    ko: DATE_FORMAT_KO,
  }[locale] ?? DATE_FORMAT_EN);

// Example: 23 March
export const getLocaleDateDayNumberMonth = (locale) =>
  ({
    en: DATE_FORMAT_DAY_NUMBER_MONTH_EN,
    ko: DATE_FORMAT_DAY_NUMBER_MONTH_KO,
  }[locale] ?? DATE_FORMAT_DAY_NUMBER_MONTH_EN);

// Example: 23 March
export const getLocaleEZDateDayNumberMonth = (locale) =>
  ({
    en: DATE_EZ_FORMAT_DAY_NUMBER_MONTH_EN,
    ko: DATE_EZ_FORMAT_DAY_NUMBER_MONTH_KO,
  }[locale] ?? DATE_FORMAT_DAY_NUMBER_MONTH_EN);

// Example: 24 May | 08:00
export const getLocaleDateSlashTimeFormat = (locale) =>
  ({
    en: DATE_SLASH_TIME_FORMAT_EN,
    ko: DATE_SLASH_TIME_FORMAT_KO,
  }[locale] ?? DATE_SLASH_TIME_FORMAT_EN);

// Example: Saturday March 20
export const getLocaleWeekdayMonthDayNumber = (locale) =>
  ({
    en: DATE_WEEKDAY_MONTH_DAY_NUMBER_EN,
    ko: DATE_WEEKDAY_MONTH_DAY_NUMBER_KO,
  }[locale] ?? DATE_WEEKDAY_MONTH_DAY_NUMBER_EN);

// Example: 23 March 21:30
export const getLocaleDateDayNumberMonthTimeFormat = (locale) =>
  ({
    en: DATE_DAY_NUMBER_MONTH_TIME_FORMAT_EN,
    ko: DATE_DAY_NUMBER_MONTH_TIME_FORMAT_KO,
  }[locale] ?? DATE_DAY_NUMBER_MONTH_TIME_FORMAT_EN);

export const getLocaleDateDayNumberMonthTimeFormatKOSpecific = (locale) =>
  ({
    en: DATE_DAY_NUMBER_MONTH_TIME_FORMAT_EN,
    ko: DATE_DAY_NUMBER_MONTH_TIME_FORMAT_KO,
  }[locale] ?? DATE_DAY_NUMBER_MONTH_TIME_FORMAT_EN);

// Example: Tue, Apr 06, 2021
export const getLocaleShortDateWeekdayMonthDayNumberYearFormat = (locale) =>
  ({
    en: DATE_SHORT_WEEKDAY_MONTH_DAY_NUMBER_YEAR_EN,
    ko: DATE_SHORT_WEEKDAY_MONTH_DAY_NUMBER_YEAR_KO,
  }[locale] ?? DATE_SHORT_WEEKDAY_MONTH_DAY_NUMBER_YEAR_EN);

export const getLocaleDateMyBetsFormat = (locale) =>
  ({
    en: DATE_MY_BETS_EN,
    ko: DATE_MY_BETS_KO,
  }[locale] ?? DATE_MY_BETS_EN);

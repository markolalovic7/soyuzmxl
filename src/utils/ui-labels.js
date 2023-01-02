import { GENDER_FEMALE, GENDER_MALE } from "constants/account-registration-gender-items";

export function formatDateNext7Days(dayjsObject) {
  const dateAddSevenDays = dayjsObject.add(7, "day");

  return `${dayjsObject.format("MMM DD")}-${dateAddSevenDays.format("MMM DD, YYYY")}`;
}

// Note: `dayObject` months started from `0`.
export function getDateParsed(dayObject) {
  const { day, month, year } = dayObject;
  // Therefore, manually added + 1.
  const dateMonth = String(month + 1).padStart(2, "0");
  const dateDay = String(day).padStart(2, "0");

  return `${year}-${dateMonth}-${dateDay}`;
}

export function formatCurrency(value, currencyCode, lang) {
  const currencyOptions = new Intl.NumberFormat(lang, {
    currency: currencyCode,
    style: "currency",
  }).resolvedOptions();

  return value.toLocaleString("de-DE", {
    ...currencyOptions,
    style: "decimal",
  });
}

export const getGenderTranslated = (gender, t) =>
  ({
    [GENDER_FEMALE]: t("forms.gender_female"),
    [GENDER_MALE]: t("forms.gender_male"),
  }[gender] ?? t("forms.gender_male"));

import dayjs from "dayjs";

export function getDatejsNow() {
  return dayjs();
}

export function getDatejsObject(date) {
  return dayjs(date);
}

export function getDatejsObjectTimestamp(dayjsObject) {
  return dayjsObject.valueOf();
}

export function getDatejsNowTimestamp() {
  return getDatejsObjectTimestamp(getDatejsNow());
}

export function getDatejsObjectHours00Min00Sec00(dayjsObject) {
  return dayjsObject.set("hour", 0).set("minute", 0).set("second", 0).set("milliseconds", 0);
}

export function getDatejsObjectHours00Min00Sec00Timestamp(dayjsObject) {
  return getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(dayjsObject));
}

export function getDatejsObjectHours23Min59Sec59(dayjsObject) {
  return dayjsObject.set("hour", 23).set("minute", 59).set("second", 59);
}

export function getDatejsNowHours00Min00Sec00Timestamp() {
  return getDatejsObjectTimestamp(getDatejsObjectHours00Min00Sec00(getDatejsNow()));
}

export function getDatejsAdd(dayjsObject, value, units) {
  return dayjsObject.add(value, units);
}

export function getDatejsSubtract(dayjsObject, value, units) {
  return dayjsObject.subtract(value, units);
}

export function getDatejsNowMinus18Years() {
  return getDatejsSubtract(getDatejsNow(), 18, "year");
}

export function getDatejsDay(dayjsObject) {
  return dayjsObject.get("date");
}

export function getDatejsMonth(dayjsObject) {
  return dayjsObject.get("month");
}

export function getDatejsYear(dayjsObject) {
  return dayjsObject.get("year");
}

export function getDatejsHour(dayjsObject) {
  return dayjsObject.get("hour");
}

export function getDatejsNowDay() {
  return getDatejsDay(getDatejsNow());
}

export function getDatejsNowMonth() {
  return getDatejsMonth(getDatejsNow());
}

export function getDatejsNowYear() {
  return getDatejsYear(getDatejsNow());
}

export function getDatejsObjectISO(dayjsObject) {
  return dayjsObject.format();
}

export function getDateObjectNowSubtract18Years() {
  const dateNowMinus18Years = getDatejsNowMinus18Years();

  return {
    day: getDatejsDay(dateNowMinus18Years),
    month: getDatejsMonth(dateNowMinus18Years),
    year: getDatejsYear(dateNowMinus18Years),
  };
}

export function parseDateFromDayjsObject(dayjsObject) {
  return dayjsObject.toDate();
}

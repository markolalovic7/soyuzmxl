export function getDatejsObjectFormatted(dayjsObject, format) {
  return dayjsObject.format(format);
}

export function format12DateHoursMinutes(dayjsObject) {
  return getDatejsObjectFormatted(dayjsObject, "hh:mm a");
}

export function formatDateHoursMinutes(dayjsObject) {
  return getDatejsObjectFormatted(dayjsObject, "HH:mm");
}

export function formatDateDayMonthShort(dayjsObject) {
  return getDatejsObjectFormatted(dayjsObject, "DD MMM");
}

export function formatDateWeekDayMonthLong(dayjsObject) {
  return getDatejsObjectFormatted(dayjsObject, "dddd, MMMM DD[th]");
}

export function formatDateDayMonthLong(dayjsObject) {
  return getDatejsObjectFormatted(dayjsObject, "DD MMMM");
}

export function formatDateYearMonthDay(dayjsObject) {
  return getDatejsObjectFormatted(dayjsObject, "YYYY-MM-DD");
}

export function formatDateDayMonthYear(dayjsObject) {
  return getDatejsObjectFormatted(dayjsObject, "DD-MM-YYYY");
}

export function formatDateMonthLongDayHourMinutes(dayjsObject) {
  return getDatejsObjectFormatted(dayjsObject, "MMMM D, HH:mm");
}

export function formatDateMonthYearShortDayHour(dayjsObject) {
  return getDatejsObjectFormatted(dayjsObject, "MM/YY hh:mm A");
}

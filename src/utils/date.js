export const SEC_MSEC = 1000;
export const MINUTE_MSEC = SEC_MSEC * 60;
export const HOUR_MSEC = MINUTE_MSEC * 60;
export const DAY_MSEC = HOUR_MSEC * 24;
export const YEAR_MSEC = DAY_MSEC * 365;

export function getNow() {
  return new Date();
}

export function getNowTimestamp() {
  return getNow().valueOf();
}

export function getHourTimestamp(hour) {
  return hour * HOUR_MSEC;
}

export function parseDate(date) {
  return new Date(date);
}

export function parseDateToISO(date) {
  return parseDate(date).toISOString();
}

export function parseDateToTimestamp(date) {
  return parseDate(date).valueOf();
}

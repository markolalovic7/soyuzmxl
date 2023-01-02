import isEmpty from "lodash.isempty";

export function isDefined(value) {
  return typeof value !== "undefined";
}

export function isNotEmpty(value) {
  return !isEmpty(value);
}

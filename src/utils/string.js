import isEmpty from "lodash.isempty";
import trim from "lodash.trim";

export function isStringTrimmedEmpty(string) {
  return isEmpty(trim(string));
}

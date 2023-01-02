function getComposedRegexOR(...regexes) {
  return new RegExp(regexes.map((regex) => regex.source).join("|"));
}

function getComposedRegexAND(...regexes) {
  return new RegExp(regexes.map((regex) => regex.source).join(""));
}

const CURRENCY_OR_SPECIAL_SYMBOLS_REGEX =
  /(?=.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]|[\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6])/;
const ASIAN_SYMBOLS_REGEX =
  /(?=.*[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u00C0-\u1FFF\u2C00-\uD7FF])/;
const UPPER_REGEX = /(?=.*[A-Z])/;
const LOWER_REGEX = /(?=.*[a-z])/;
const DIGIT_REGEX = /(?=.*[0-9])/;

// Accepts any character (Asian alphabet, such as Korean / Chinese / Japanese characters), digits, '-'.
export const USERNAME_REGEX =
  /^[-,\w,\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u00C0-\u1FFF\u2C00-\uD7FF]*$/;

// Accepts any character (Asian alphabet, such as Korean / Chinese / Japanese characters), space, '-'.
export const FIRST_NAME_REGEX =
  /^[-," ",\w,\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u00C0-\u1FFF\u2C00-\uD7FF]+$/;

// Accepts any character (Asian alphabet, such as Korean / Chinese / Japanese characters), space, '-'.
export const IDENTITY_DOCUMENT =
  /^[-," ",\w,\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u00C0-\u1FFF\u2C00-\uD7FF]+$/;

export const LAST_NAME_REGEX = FIRST_NAME_REGEX;

// Accepts only digits.
export const PIN_REGEX = /^\d+$/;

// Accepts at least 3 out of 5 rules:
// Upper Case Letters, Lower Case Letters, Digits, Special Symbols and Currency Symbols, Without Case Letters.
export const PASSWORD_REGEX = getComposedRegexAND(
  /^/,
  getComposedRegexOR(
    getComposedRegexAND(UPPER_REGEX, LOWER_REGEX, DIGIT_REGEX),
    getComposedRegexAND(UPPER_REGEX, LOWER_REGEX, ASIAN_SYMBOLS_REGEX),
    getComposedRegexAND(UPPER_REGEX, LOWER_REGEX, CURRENCY_OR_SPECIAL_SYMBOLS_REGEX),
    getComposedRegexAND(UPPER_REGEX, DIGIT_REGEX, ASIAN_SYMBOLS_REGEX),
    getComposedRegexAND(UPPER_REGEX, DIGIT_REGEX, CURRENCY_OR_SPECIAL_SYMBOLS_REGEX),
    getComposedRegexAND(UPPER_REGEX, ASIAN_SYMBOLS_REGEX, CURRENCY_OR_SPECIAL_SYMBOLS_REGEX),
    getComposedRegexAND(LOWER_REGEX, DIGIT_REGEX, ASIAN_SYMBOLS_REGEX),
    getComposedRegexAND(LOWER_REGEX, DIGIT_REGEX, CURRENCY_OR_SPECIAL_SYMBOLS_REGEX),
    getComposedRegexAND(LOWER_REGEX, ASIAN_SYMBOLS_REGEX, CURRENCY_OR_SPECIAL_SYMBOLS_REGEX),
    getComposedRegexAND(DIGIT_REGEX, ASIAN_SYMBOLS_REGEX, CURRENCY_OR_SPECIAL_SYMBOLS_REGEX),
  ),
);

// Reference: https://github.com/validatorjs/validator.js/blob/master/src/lib/isMobilePhone.js.
/*  eslint-disable sort-keys-fix/sort-keys-fix */
export const PHONE_NUMBERS_REGEX = {
  AM: /^(\+?374|0)((10|[9|7][0-9])\d{6}$|[2-4]\d{7}$)/,
  AE: /^((\+?971)|0)?5[024568]\d{7}$/,
  BH: /^(\+?973)?(3|6)\d{7}$/,
  DZ: /^(\+?213|0)(5|6|7)\d{8}$/,
  LB: /^(\+?961)?((3|81)\d{6}|7\d{7})$/,
  EG: /^((\+?20)|0)?1[0125]\d{8}$/,
  IQ: /^(\+?964|0)?7[0-9]\d{8}$/,
  JO: /^(\+?962|0)?7[789]\d{7}$/,
  KW: /^(\+?965)[569]\d{7}$/,
  LY: /^((\+?218)|0)?(9[1-6]\d{7}|[1-8]\d{7,9})$/,
  MA: /^(?:(?:\+|00)212|0)[5-7]\d{8}$/,
  OM: /^((\+|00)968)?(9[1-9])\d{6}$/,
  SA: /^(!?(\+?966)|0)?5\d{8}$/,
  SY: /^(!?(\+?963)|0)?9\d{8}$/,
  TN: /^(\+?216)?[2459]\d{7}$/,
  AZ: /^(\+994|0)(5[015]|7[07]|99)\d{7}$/,
  BA: /^((((\+|00)3876)|06))((([0-3]|[5-6])\d{6})|(4\d{7}))$/,
  BY: /^(\+?375)?(24|25|29|33|44)\d{7}$/,
  BG: /^(\+?359|0)?8[789]\d{7}$/,
  BD: /^(\+?880|0)1[13456789][0-9]{8}$/,
  AD: /^(\+376)?[346]\d{5}$/,
  CZ: /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  DK: /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
  DE: /^(\+49)?0?[1|3]([0|5][0-45-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7}$/,
  AT: /^(\+43|0)\d{1,4}\d{3,12}$/,
  CH: /^(\+41|0)([1-9])\d{1,9}$/,
  LU: /^(\+352)?((6\d1)\d{6})$/,
  GR: /^(\+?30|0)?(69\d{8})$/,
  AU: /^(\+?61|0)4\d{8}$/,
  GB: /^(\+?44|0)7\d{9}$/,
  GG: /^(\+?44|0)1481\d{6}$/,
  GH: /^(\+233|0)(20|50|24|54|27|57|26|56|23|28)\d{7}$/,
  HK: /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/,
  MO: /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/,
  IE: /^(\+?353|0)8[356789]\d{7}$/,
  IN: /^(\+?91|0)?[6789]\d{9}$/,
  KE: /^(\+?254|0)(7|1)\d{8}$/,
  MT: /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/,
  MU: /^(\+?230|0)?\d{8}$/,
  NG: /^(\+?234|0)?[789]\d{9}$/,
  NZ: /^(\+?64|0)[28]\d{7,9}$/,
  PK: /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
  PH: /^(09|\+639)\d{9}$/,
  RW: /^(\+?250|0)?[7]\d{8}$/,
  SG: /^(\+65)?[689]\d{7}$/,
  SL: /^(?:0|94|\+94)?(7(0|1|2|5|6|7|8)( |-)?\d)\d{6}$/,
  TZ: /^(\+?255|0)?[67]\d{8}$/,
  UG: /^(\+?256|0)?[7]\d{8}$/,
  US: /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  ZA: /^(\+?27|0)\d{9}$/,
  ZM: /^(\+?26)?09[567]\d{7}$/,
  ZW: /^(\+263)[0-9]{9}$/,
  AR: /^\+?549(11|[2368]\d)\d{8}$/,
  BO: /^(\+?591)?(6|7)\d{7}$/,
  CO: /^(\+?57)?([1-8]{1}|3[0-9]{2})?[0-9]{1}\d{6}$/,
  CL: /^(\+?56|0)[2-9]\d{1}\d{7}$/,
  CR: /^(\+506)?[2-8]\d{7}$/,
  DO: /^(\+?1)?8[024]9\d{7}$/,
  HN: /^(\+?504)?[9|8]\d{7}$/,
  EC: /^(\+?593|0)([2-7]|9[2-9])\d{7}$/,
  ES: /^(\+?34)?[6|7]\d{8}$/,
  PE: /^(\+?51)?9\d{8}$/,
  MX: /^(\+?52)?(1|01)?\d{10,11}$/,
  PA: /^(\+?507)\d{7,8}$/,
  PY: /^(\+?595|0)9[9876]\d{7}$/,
  UY: /^(\+598|0)9[1-9][\d]{6}$/,
  EE: /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
  IR: /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
  FI: /^(\+?358|0)\s?(4(0|1|2|4|5|6)?|50)\s?(\d\s?){4,8}\d$/,
  FJ: /^(\+?679)?\s?\d{3}\s?\d{4}$/,
  FO: /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  FR: /^(\+?33|0)[67]\d{8}$/,
  GF: /^(\+?594|0|00594)[67]\d{8}$/,
  GP: /^(\+?590|0|00590)[67]\d{8}$/,
  MQ: /^(\+?596|0|00596)[67]\d{8}$/,
  RE: /^(\+?262|0|00262)[67]\d{8}$/,
  IL: /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/,
  HU: /^(\+?36)(20|30|70)\d{7}$/,
  ID: /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
  IT: /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
  SM: /^((\+378)|(0549)|(\+390549)|(\+3780549))?6\d{5,9}$/,
  JP: /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/,
  GE: /^(\+?995)?(5|79)\d{7}$/,
  KZ: /^(\+?7|8)?7\d{9}$/,
  GL: /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  KR: /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
  LT: /^(\+370|8)\d{8}$/,
  MY: /^(\+?6?01){1}(([0145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
  NO: /^(\+?47)?[49]\d{7}$/,
  NP: /^(\+?977)?9[78]\d{8}$/,
  BE: /^(\+?32|0)4?\d{8}$/,
  NL: /^(((\+|00)?31\(0\))|((\+|00)?31)|0)6{1}\d{8}$/,
  PL: /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
  BR: /^((\+?55\ ?[1-9]{2}\ ?)|(\+?55\ ?\([1-9]{2}\)\ ?)|(0[1-9]{2}\ ?)|(\([1-9]{2}\)\ ?)|([1-9]{2}\ ?))((\d{4}\-?\d{4})|(9[2-9]{1}\d{3}\-?\d{4}))$/,
  PT: /^(\+?351)?9[1236]\d{7}$/,
  AO: /^(\+244)\d{9}$/,
  RO: /^(\+?4?0)\s?7\d{2}(\/|\s|\.|\-)?\d{3}(\s|\.|\-)?\d{3}$/,
  RU: /^(\+?7|8)?9\d{9}$/,
  SI: /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/,
  SK: /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  AL: /^(\+355|0)6[789]\d{6}$/,
  RS: /^(\+3816|06)[- \d]{5,9}$/,
  SE: /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/,
  TH: /^(\+66|66|0)\d{9}$/,
  TR: /^(\+?90|0)?5\d{9}$/,
  UA: /^(\+?38|8)?0\d{9}$/,
  UZ: /^(\+?998)?(6[125-79]|7[1-69]|88|9\d)\d{7}$/,
  VN: /^(\+?84|0)((3([2-9]))|(5([2689]))|(7([0|6-9]))|(8([1-9]))|(9([0-9])))([0-9]{7})$/,
  CN: /^((\+|00)86)?1([3568][0-9]|4[579]|6[67]|7[01235678]|9[012356789])[0-9]{8}$/,
  TW: /^(\+?886\-?|0)?9\d{8}$/,
};
/*  eslint-enable sort-keys-fix/sort-keys-fix */

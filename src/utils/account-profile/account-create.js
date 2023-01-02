import {
  ACCOUNT_FIELD_ADDRESS,
  ACCOUNT_FIELD_DATE_OF_BIRTH,
  ACCOUNT_FIELD_COUNTRY_CODE,
  ACCOUNT_FIELD_CURRENCY_CODE,
  ACCOUNT_FIELD_CITY,
  ACCOUNT_FIELD_EMAIL,
  ACCOUNT_FIELD_GENDER,
  ACCOUNT_FIELD_FIRST_NAME,
  ACCOUNT_FIELD_IDENTITY_DOCUMENT,
  ACCOUNT_FIELD_LANGUAGE_CODE,
  ACCOUNT_FIELD_LAST_NAME,
  ACCOUNT_FIELD_MOBILE,
  ACCOUNT_FIELD_PASSWORD,
  ACCOUNT_FIELD_PIN,
  ACCOUNT_FIELD_PRICE_FORMAT,
  ACCOUNT_FIELD_POSTCODE,
  ACCOUNT_FIELD_REFERRAL_METHOD,
  ACCOUNT_FIELD_SECURITY_ANSWER,
  ACCOUNT_FIELD_USERNAME,
  ACCOUNT_FIELD_PASSWORD_CONFIRM,
  ACCOUNT_FIELD_SECURITY_QUESTION,
} from "constants/account-fields";
import { ACCOUNT_REGISTRATION_GENDER_ITEMS } from "constants/account-registration-gender-items";
import { PHONE_NUMBER_COUNTRY_CODES } from "constants/phone-numbers";

import { getDateObjectNowSubtract18Years } from "../dayjs";
import { isDefined } from "../lodash";
import { getDateParsed } from "../ui-labels";

function getFieldByType(type) {
  return {
    address: ACCOUNT_FIELD_ADDRESS,
    city: ACCOUNT_FIELD_CITY,
    countryCode: ACCOUNT_FIELD_COUNTRY_CODE,
    currencyCode: ACCOUNT_FIELD_CURRENCY_CODE,
    dateOfBirth: ACCOUNT_FIELD_DATE_OF_BIRTH,
    email: ACCOUNT_FIELD_EMAIL,
    firstName: ACCOUNT_FIELD_FIRST_NAME,
    gender: ACCOUNT_FIELD_GENDER,
    identityDocument: ACCOUNT_FIELD_IDENTITY_DOCUMENT,
    languageCode: ACCOUNT_FIELD_LANGUAGE_CODE,
    lastName: ACCOUNT_FIELD_LAST_NAME,
    mobile: ACCOUNT_FIELD_MOBILE,
    password: ACCOUNT_FIELD_PASSWORD,
    pin: ACCOUNT_FIELD_PIN,
    postcode: ACCOUNT_FIELD_POSTCODE,
    priceFormat: ACCOUNT_FIELD_PRICE_FORMAT,
    referralMethodId: ACCOUNT_FIELD_REFERRAL_METHOD,
    securityQuestionAnswers: ACCOUNT_FIELD_SECURITY_ANSWER,
    username: ACCOUNT_FIELD_USERNAME,
  }[type];
}

export function getErrors({ errors }) {
  return errors.reduce((acc, item) => {
    const field = getFieldByType(item.field);

    return field
      ? {
          ...acc,
          [field]: item.message,
        }
      : acc;
  }, {});
}

export function getInitialValues({
  defaultCountry,
  defaultCurrency,
  defaultLanguage,
  defaultPriceFormat,
  fields,
  referrals,
  securityQuestions,
}) {
  return {
    ...(isDefined(fields[ACCOUNT_FIELD_ADDRESS]) ? { [ACCOUNT_FIELD_ADDRESS]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_COUNTRY_CODE]) ? { [ACCOUNT_FIELD_COUNTRY_CODE]: defaultCountry } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_CURRENCY_CODE]) ? { [ACCOUNT_FIELD_CURRENCY_CODE]: defaultCurrency } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_CITY]) ? { [ACCOUNT_FIELD_CITY]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_DATE_OF_BIRTH])
      ? { [ACCOUNT_FIELD_DATE_OF_BIRTH]: getDateParsed(getDateObjectNowSubtract18Years()) }
      : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_EMAIL]) ? { [ACCOUNT_FIELD_EMAIL]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_GENDER])
      ? { [ACCOUNT_FIELD_GENDER]: ACCOUNT_REGISTRATION_GENDER_ITEMS[0].value }
      : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_FIRST_NAME]) ? { [ACCOUNT_FIELD_FIRST_NAME]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_IDENTITY_DOCUMENT]) ? { [ACCOUNT_FIELD_IDENTITY_DOCUMENT]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_LANGUAGE_CODE]) ? { [ACCOUNT_FIELD_LANGUAGE_CODE]: defaultLanguage } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_LAST_NAME]) ? { [ACCOUNT_FIELD_LAST_NAME]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_MOBILE])
      ? { [ACCOUNT_FIELD_MOBILE]: PHONE_NUMBER_COUNTRY_CODES[defaultCountry] }
      : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_PASSWORD]) ? { [ACCOUNT_FIELD_PASSWORD]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_PASSWORD_CONFIRM]) ? { [ACCOUNT_FIELD_PASSWORD_CONFIRM]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_PIN]) ? { [ACCOUNT_FIELD_PIN]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_PRICE_FORMAT]) ? { [ACCOUNT_FIELD_PRICE_FORMAT]: defaultPriceFormat } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_POSTCODE]) ? { [ACCOUNT_FIELD_POSTCODE]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_REFERRAL_METHOD])
      ? { [ACCOUNT_FIELD_REFERRAL_METHOD]: referrals[0]?.value }
      : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_SECURITY_ANSWER]) ? { [ACCOUNT_FIELD_SECURITY_ANSWER]: "" } : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_SECURITY_QUESTION])
      ? { [ACCOUNT_FIELD_SECURITY_QUESTION]: securityQuestions[0]?.value }
      : {}),
    ...(isDefined(fields[ACCOUNT_FIELD_USERNAME]) ? { [ACCOUNT_FIELD_USERNAME]: "" } : {}),
  };
}

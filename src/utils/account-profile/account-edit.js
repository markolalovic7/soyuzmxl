import {
  ACCOUNT_FIELD_ADDRESS,
  ACCOUNT_FIELD_CITY,
  ACCOUNT_FIELD_IDENTITY_DOCUMENT,
  ACCOUNT_FIELD_LANGUAGE_CODE,
  ACCOUNT_FIELD_POSTCODE,
  ACCOUNT_FIELD_PRICE_FORMAT,
} from "constants/account-fields";

export function getAccountEditInitialValues({
  address,
  city,
  defaultLanguage,
  defaultPriceFormat,
  identityDocument,
  postcode,
}) {
  return {
    [ACCOUNT_FIELD_ADDRESS]: address || "",
    [ACCOUNT_FIELD_CITY]: city || "",
    [ACCOUNT_FIELD_IDENTITY_DOCUMENT]: identityDocument ? identityDocument.toUpperCase() : "",
    [ACCOUNT_FIELD_LANGUAGE_CODE]: defaultLanguage,
    [ACCOUNT_FIELD_POSTCODE]: postcode,
    [ACCOUNT_FIELD_PRICE_FORMAT]: defaultPriceFormat,
  };
}

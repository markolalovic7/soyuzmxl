import {
  ACCOUNT_FIELD_ADDRESS,
  ACCOUNT_FIELD_COUNTRY_CODE,
  ACCOUNT_FIELD_CITY,
  ACCOUNT_FIELD_EMAIL,
  ACCOUNT_FIELD_FIRST_NAME,
  ACCOUNT_FIELD_IDENTITY_DOCUMENT,
  ACCOUNT_FIELD_LAST_NAME,
  ACCOUNT_FIELD_MOBILE,
  ACCOUNT_FIELD_PASSWORD,
  ACCOUNT_FIELD_PASSWORD_CONFIRM,
  ACCOUNT_FIELD_PIN,
  ACCOUNT_FIELD_POSTCODE,
  ACCOUNT_FIELD_SECURITY_QUESTION,
  ACCOUNT_FIELD_SECURITY_ANSWER,
  ACCOUNT_FIELD_USERNAME,
} from "constants/account-fields";
import * as Yup from "yup";

import {
  IDENTITY_DOCUMENT,
  FIRST_NAME_REGEX,
  LAST_NAME_REGEX,
  PASSWORD_REGEX,
  PIN_REGEX,
  PHONE_NUMBERS_REGEX,
  USERNAME_REGEX,
} from "../regex";

// Generate f.e. `use-ACCOUNT_FIELD_SECURITY_QUESTION` field which will indicate if the field is `required`.
const getIsFieldRequired = ({ fields }) =>
  [
    ACCOUNT_FIELD_ADDRESS,
    ACCOUNT_FIELD_CITY,
    ACCOUNT_FIELD_EMAIL,
    ACCOUNT_FIELD_FIRST_NAME,
    ACCOUNT_FIELD_IDENTITY_DOCUMENT,
    ACCOUNT_FIELD_LAST_NAME,
    ACCOUNT_FIELD_MOBILE,
    ACCOUNT_FIELD_PIN,
    ACCOUNT_FIELD_POSTCODE,
    ACCOUNT_FIELD_SECURITY_QUESTION,
    ACCOUNT_FIELD_USERNAME,
  ].reduce(
    (prevValue, field) => ({
      ...prevValue,
      [`use-${field}`]: Yup.boolean().default(!!fields[field]).required(),
    }),
    {},
  );

// Generate schema which set `is required` based on the value.
const getFieldSchema = (t, field) =>
  Yup.string().when(`use-${field}`, {
    is: true,
    then: Yup.string().required(t("forms.validation_field_required_message")),
  });

// Validation schema for account profile form.
export function getProfileFormValidation({ fields, t }) {
  return Yup.lazy((values) =>
    Yup.object().shape({
      ...getIsFieldRequired({ fields }),
      [ACCOUNT_FIELD_ADDRESS]: getFieldSchema(t, ACCOUNT_FIELD_ADDRESS),
      [ACCOUNT_FIELD_CITY]: getFieldSchema(t, ACCOUNT_FIELD_CITY),
      [ACCOUNT_FIELD_COUNTRY_CODE]: getFieldSchema(t, ACCOUNT_FIELD_COUNTRY_CODE),
      [ACCOUNT_FIELD_EMAIL]: getFieldSchema(t, ACCOUNT_FIELD_EMAIL).email(
        t("forms.validation_field_email_error_message"),
      ),
      [ACCOUNT_FIELD_FIRST_NAME]: getFieldSchema(t, ACCOUNT_FIELD_FIRST_NAME).matches(
        FIRST_NAME_REGEX,
        t("forms.validation_field_only_letters_message"),
      ),
      [ACCOUNT_FIELD_IDENTITY_DOCUMENT]: getFieldSchema(t, ACCOUNT_FIELD_IDENTITY_DOCUMENT).matches(
        IDENTITY_DOCUMENT,
        t("forms.validation_field_only_letters_and_numbers_message"),
      ),
      [ACCOUNT_FIELD_LAST_NAME]: getFieldSchema(t, ACCOUNT_FIELD_LAST_NAME).matches(
        LAST_NAME_REGEX,
        t("forms.validation_field_only_letters_message"),
      ),
      [ACCOUNT_FIELD_MOBILE]: getFieldSchema(t, ACCOUNT_FIELD_MOBILE).matches(
        PHONE_NUMBERS_REGEX[values[ACCOUNT_FIELD_COUNTRY_CODE]],
        t("forms.validation_field_invalid_phone_error_message"),
      ),
      [ACCOUNT_FIELD_PASSWORD]: Yup.string()
        .required(t("forms.validation_field_required_message"))
        .matches(PASSWORD_REGEX, t("forms.validation_field_password_error_message"))
        .min(8, t("forms.validation_field_min_password_length_error_message")),
      [ACCOUNT_FIELD_PASSWORD_CONFIRM]: Yup.string()
        .required(t("forms.validation_field_required_message"))
        .oneOf([Yup.ref(ACCOUNT_FIELD_PASSWORD), null], t("forms.validation_field_password_match_message")),
      [ACCOUNT_FIELD_PIN]: getFieldSchema(t, ACCOUNT_FIELD_PIN)
        .matches(PIN_REGEX, t("forms.validation_field_only_digits_message"))
        .min(6, t("forms.validation_field_exact_chars_error_message", { exactChars: 6 }))
        .max(6, t("forms.validation_field_exact_chars_error_message", { exactChars: 6 })),
      [ACCOUNT_FIELD_POSTCODE]: getFieldSchema(t, ACCOUNT_FIELD_POSTCODE),
      [ACCOUNT_FIELD_SECURITY_ANSWER]: getFieldSchema(t, ACCOUNT_FIELD_SECURITY_QUESTION),
      [ACCOUNT_FIELD_USERNAME]: getFieldSchema(t, ACCOUNT_FIELD_USERNAME)
        .trim()
        .matches(USERNAME_REGEX, t("forms.validation_field_only_letters_and_numbers_and_extra_message"))
        .min(3, t("forms.validation_field_min_chars_error_message", { minChars: 3 })),
    }),
  );
}

import * as Yup from "yup";

import { ACCOUNT_FIELD_PIN } from "../../constants/account-fields";
import { PIN_REGEX } from "../regex";

const getFieldSchema = (t, field) =>
  Yup.string().when(`use-${field}`, {
    is: true,
    then: Yup.string().required(t("forms.validation_field_required_message")),
  });

// Validation schema for account pin change form.
export function getAccountPinChangeFormValidation({ t }) {
  return Yup.object().shape({
    [ACCOUNT_FIELD_PIN]: getFieldSchema(t, ACCOUNT_FIELD_PIN)
      .matches(PIN_REGEX, t("forms.validation_field_only_digits_message"))
      .min(6, t("forms.validation_field_exact_chars_error_message", { exactChars: 6 }))
      .max(6, t("forms.validation_field_exact_chars_error_message", { exactChars: 6 })),
  });
}

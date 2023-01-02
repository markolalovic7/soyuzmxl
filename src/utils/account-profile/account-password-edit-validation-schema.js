import {
  ACCOUNT_PASSWORD_CHANGE_OLD,
  ACCOUNT_PASSWORD_CHANGE_NEW,
  ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM,
} from "constants/account-password-change-fields";
import * as Yup from "yup";

import { PASSWORD_REGEX } from "../regex";

// Validation schema for account password change form.
export function getAccountPasswordChangeFormValidation({ t }) {
  return Yup.object().shape({
    [ACCOUNT_PASSWORD_CHANGE_NEW]: Yup.string()
      .required(t("forms.validation_field_required_message"))
      .matches(PASSWORD_REGEX, t("forms.validation_field_password_error_message"))
      .min(8, t("forms.validation_field_min_password_length_error_message")),
    [ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]: Yup.string()
      .required(t("forms.validation_field_required_message"))
      .oneOf([Yup.ref(ACCOUNT_PASSWORD_CHANGE_NEW), null], t("forms.validation_field_password_match_message")),
    [ACCOUNT_PASSWORD_CHANGE_OLD]: Yup.string().required(t("forms.validation_field_required_message")),
  });
}

// Validation schema for account password reset form.
export function getAccountPasswordResetFormValidation({ t }) {
  return Yup.object().shape({
    [ACCOUNT_PASSWORD_CHANGE_NEW]: Yup.string()
      .required(t("forms.validation_field_required_message"))
      .matches(PASSWORD_REGEX, t("forms.validation_field_password_error_message"))
      .min(8, t("forms.validation_field_min_password_length_error_message")),
    [ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]: Yup.string()
      .required(t("forms.validation_field_required_message"))
      .oneOf([Yup.ref(ACCOUNT_PASSWORD_CHANGE_NEW), null], t("forms.validation_field_password_match_message")),
  });
}

import * as Yup from "yup";

import { ACCOUNT_FIELD_SECURITY_ANSWER, ACCOUNT_FIELD_SECURITY_QUESTION } from "../../constants/account-fields";

// Generate schema which set `is required` based on the value.
const getFieldSchema = (t, field) =>
  Yup.string().when(`use-${field}`, {
    is: true,
    then: Yup.string().required(t("forms.validation_field_required_message")),
  });

// Validation schema for account password change form.
export function getAccountSecurityQuestionsChangeFormValidation({ t }) {
  return Yup.object().shape({
    [ACCOUNT_FIELD_SECURITY_ANSWER]: getFieldSchema(t, ACCOUNT_FIELD_SECURITY_QUESTION),
  });
}

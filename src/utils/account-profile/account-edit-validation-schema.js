import {
  ACCOUNT_FIELD_ADDRESS,
  ACCOUNT_FIELD_CITY,
  ACCOUNT_FIELD_IDENTITY_DOCUMENT,
  ACCOUNT_FIELD_POSTCODE,
} from "constants/account-fields";
import * as Yup from "yup";

import { IDENTITY_DOCUMENT } from "../regex";

// Generate f.e. `use-ACCOUNT_FIELD_SECURITY_QUESTION` field which will indicate if the field is `required`.
const getIsFieldRequired = ({ fields }) =>
  [ACCOUNT_FIELD_ADDRESS, ACCOUNT_FIELD_CITY, ACCOUNT_FIELD_IDENTITY_DOCUMENT, ACCOUNT_FIELD_POSTCODE].reduce(
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
      [ACCOUNT_FIELD_IDENTITY_DOCUMENT]: getFieldSchema(t, ACCOUNT_FIELD_IDENTITY_DOCUMENT).matches(
        IDENTITY_DOCUMENT,
        t("forms.validation_field_only_letters_and_numbers_message"),
      ),
      [ACCOUNT_FIELD_POSTCODE]: getFieldSchema(t, ACCOUNT_FIELD_POSTCODE),
    }),
  );
}

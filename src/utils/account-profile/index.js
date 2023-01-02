import { ACCOUNT_FIELD_USERNAME } from "../../constants/account-fields";
import {
  ACCOUNT_REGISTRATION_MODE_EMAIL,
  ACCOUNT_REGISTRATION_MODE_MOBILE,
  ACCOUNT_REGISTRATION_MODE_USERNAME,
} from "../../constants/account-registration-modes";

export const getAccountFields = ({ fields = {}, registrationMode }) =>
  Object.entries(fields).reduce((acc, [field, isRequired]) => {
    if ([ACCOUNT_REGISTRATION_MODE_USERNAME, ACCOUNT_REGISTRATION_MODE_MOBILE].includes(registrationMode)) {
      return {
        ...acc,
        [field]: isRequired || field === registrationMode,
      };
    }
    if (registrationMode === ACCOUNT_REGISTRATION_MODE_EMAIL) {
      if (field === ACCOUNT_FIELD_USERNAME) {
        return acc;
      }

      return {
        ...acc,
        [field]: isRequired || field === registrationMode,
      };
    }

    return {
      ...acc,
      [field]: isRequired || field === registrationMode,
    };
  }, {});

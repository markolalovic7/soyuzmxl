/* eslint-disable no-alert */
import {
  EXCEPTION_INVALID_PARAMS_ACCOUNT_CREATE,
  EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE,
  EXCEPTION_INVALID_PARAMS_ACCOUNT_UPDATE,
} from "constants/exceptions-types";

export function getAlertErrorMessage(errorType, t) {
  return (
    {
      [EXCEPTION_INVALID_PARAMS_ACCOUNT_CREATE]: t("alert-error-invalid-params-account-create"),
      [EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE]: t("alert-error-invalid-params-account-password-update"),
      [EXCEPTION_INVALID_PARAMS_ACCOUNT_UPDATE]: t("alert-error-invalid-params-account-update"),
    }[errorType] ?? t("alert-error-internal-error")
  );
}

// TODO: Use third-party library.
export function alertError(text) {
  alert(text);
}

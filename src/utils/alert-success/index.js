/* eslint-disable no-alert */
import {
  ALERT_SUCCESS_ACCOUNT_CREATED,
  ALERT_SUCCESS_ACCOUNT_UPDATED,
  ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED,
  ALERT_SUCCESS_BET_SUBMITTED,
} from "constants/alert-success-types";

export function getAlertSuccessMessage(alertType, t) {
  return {
    [ALERT_SUCCESS_ACCOUNT_CREATED]: t("alert-success-account-created"),
    [ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED]: t("alert-success-account-password-updated"),
    [ALERT_SUCCESS_ACCOUNT_UPDATED]: t("alert-success-account-updated"),
    [ALERT_SUCCESS_BET_SUBMITTED]: t("alert-success-bet-submitted"),
  }[alertType];
}

// TODO: Use third-party library.
export function alertSuccess(text) {
  if (!text) {
    return;
  }
  alert(text);
}

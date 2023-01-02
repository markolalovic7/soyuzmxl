/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getAlertSuccessMessage } from "utils/alert-success";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getAlertSuccessMessage", () => {
    const t = (value) => value;
    it("should return alert message when `alertType` is `ALERT_SUCCESS_ACCOUNT_CREATED`", () => {
      expect(getAlertSuccessMessage("ALERT_SUCCESS_ACCOUNT_CREATED", t)).is.equal("alert-success-account-created");
    });
    it("should return alert message when `alertType` is `ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED`", () => {
      expect(getAlertSuccessMessage("ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED", t)).is.equal(
        "alert-success-account-password-updated",
      );
    });
    it("should return alert message when `alertType` is `ALERT_SUCCESS_ACCOUNT_UPDATED`", () => {
      expect(getAlertSuccessMessage("ALERT_SUCCESS_ACCOUNT_UPDATED", t)).is.equal("alert-success-account-updated");
    });
    it("should return alert message when `alertType` is `ALERT_SUCCESS_BET_SUBMITTED`", () => {
      expect(getAlertSuccessMessage("ALERT_SUCCESS_BET_SUBMITTED", t)).is.equal("alert-success-bet-submitted");
    });
    it("should return default `undefined` when `alertType` is not supported", () => {
      expect(getAlertSuccessMessage(undefined, t)).is.undefined;
    });
  });
});

/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getAlertErrorMessage } from "utils/alert-error";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getAlertErrorMessage", () => {
    const t = (value) => value;
    it("should return alert message when `errorType` is `EXCEPTION_INVALID_PARAMS_ACCOUNT_CREATE`", () => {
      expect(getAlertErrorMessage("EXCEPTION_INVALID_PARAMS_ACCOUNT_CREATE", t)).is.equal(
        "alert-error-invalid-params-account-create",
      );
    });
    it("should return alert message when `errorType` is `EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE`", () => {
      expect(getAlertErrorMessage("EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE", t)).is.equal(
        "alert-error-invalid-params-account-password-update",
      );
    });
    it("should return alert message when `errorType` is `EXCEPTION_INVALID_PARAMS_ACCOUNT_UPDATE`", () => {
      expect(getAlertErrorMessage("EXCEPTION_INVALID_PARAMS_ACCOUNT_UPDATE", t)).is.equal(
        "alert-error-invalid-params-account-update",
      );
    });
    it("should return default message when `errorType` is not supported", () => {
      expect(getAlertErrorMessage(undefined, t)).is.equal("alert-error-internal-error");
    });
  });
});

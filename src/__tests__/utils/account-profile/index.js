/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getAccountEditInitialValues } from "utils/account-profile/account-edit";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getAccountEditInitialValues", () => {
    it("should return valid object", () => {
      expect(
        getAccountEditInitialValues({
          address: "address",
          city: "city",
          defaultLanguage: "defaultLanguage",
          defaultPriceFormat: "defaultPriceFormat",
          identityDocument: "identityDocument",
          postcode: "postcode",
        }),
      ).is.deep.equal({
        ADDRESS: "address",
        CITY: "city",
        IDENTITY_DOCUMENT: "IDENTITYDOCUMENT",
        LANGUAGE_CODE: "defaultLanguage",
        POSTCODE: "postcode",
        PRICE_FORMAT: "defaultPriceFormat",
      });
    });
    it("should return default object", () => {
      expect(getAccountEditInitialValues({})).is.deep.equal({
        ADDRESS: "",
        CITY: "",
        IDENTITY_DOCUMENT: "",
        LANGUAGE_CODE: undefined,
        POSTCODE: undefined,
        PRICE_FORMAT: undefined,
      });
    });
  });
});

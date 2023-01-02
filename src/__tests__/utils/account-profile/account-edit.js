/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getAccountFields } from "utils/account-profile";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getAccountFields", () => {
    it("should return valid `fields` object when registrationMode is `USERNAME`", () => {
      expect(
        getAccountFields({
          fields: {
            EMAIL: true,
            USERNAME: false,
          },
          registrationMode: "USERNAME",
        }),
      ).is.deep.equal({
        EMAIL: true,
        USERNAME: true,
      });
      expect(
        getAccountFields({
          fields: {
            EMAIL: true,
            USERNAME: true,
          },
          registrationMode: "USERNAME",
        }),
      ).is.deep.equal({
        EMAIL: true,
        USERNAME: true,
      });
    });
    it("should return valid `fields` object when registrationMode is `MOBILE`", () => {
      expect(
        getAccountFields({
          fields: {
            EMAIL: true,
            MOBILE: false,
            USERNAME: false,
          },
          registrationMode: "MOBILE",
        }),
      ).is.deep.equal({
        EMAIL: true,
        MOBILE: true,
        USERNAME: false,
      });
      expect(
        getAccountFields({
          fields: {
            EMAIL: true,
            MOBILE: false,
            USERNAME: true,
          },
          registrationMode: "MOBILE",
        }),
      ).is.deep.equal({
        EMAIL: true,
        MOBILE: true,
        USERNAME: true,
      });
    });
    it("should return valid `fields` object when registrationMode is `EMAIL`", () => {
      expect(
        getAccountFields({
          fields: {
            EMAIL: false,
            USERNAME: false,
          },
          registrationMode: "EMAIL",
        }),
      ).is.deep.equal({
        EMAIL: true,
      });
      expect(
        getAccountFields({
          fields: {
            EMAIL: true,
            USERNAME: true,
          },
          registrationMode: "EMAIL",
        }),
      ).is.deep.equal({
        EMAIL: true,
      });
    });
    it("should return default `fields` object ", () => {
      expect(
        getAccountFields({
          fields: {},
          registrationMode: undefined,
        }),
      ).is.deep.equal({});
      expect(
        getAccountFields({
          fields: {
            EMAIL: true,
            USERNAME: true,
          },
          registrationMode: undefined,
        }),
      ).is.deep.equal({
        EMAIL: true,
        USERNAME: true,
      });
    });
  });
});

/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { getAccountSelector, getAccountDataSelector } from "../../../redux/reselect/account-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getAccountSelector", () => {
    it("should return `account` from store", () => {
      expect(
        getAccountSelector({
          account: {
            accountData: [
              {
                id: 1,
              },
            ],
          },
        }),
      ).is.deep.equal({
        accountData: [
          {
            id: 1,
          },
        ],
      });
    });
    it("should return `empty object` when `account` is empty", () => {
      expect(getAccountSelector({ account: {} })).is.deep.equal({});
      expect(getAccountSelector({})).is.deep.equal({});
    });
  });
  describe("getAccountDataSelector", () => {
    it("should return `account` from store", () => {
      expect(
        getAccountDataSelector({
          account: {
            accountData: [
              {
                id: 1,
              },
            ],
          },
        }),
      ).is.deep.equal([
        {
          id: 1,
        },
      ]);
    });
    it("should return `empty object` when `account` is empty", () => {
      expect(getAccountDataSelector({ account: {} })).is.deep.equal({});
      expect(getAccountDataSelector({})).is.deep.equal({});
    });
  });
});

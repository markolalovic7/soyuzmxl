/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getCmsLayout, getCmsLayoutMobileVanilla } from "redux/reselect/cms-layout-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getCmsLayout", () => {
    it("should return `layouts` from store", () => {
      expect(
        getCmsLayout({
          auth: {
            mobileView: "VANILLA",
          },
          cms: {
            config: {
              layouts: [
                {
                  id: 1,
                },
              ],
            },
          },
        }),
      ).is.deep.equal([
        {
          id: 1,
        },
      ]);
    });
    it("should return `empty array` when `sport` is empty", () => {
      expect(getCmsLayout({})).is.deep.equal({});
      expect(getCmsLayout({ sportsTree: {} })).is.deep.equal({});
      expect(getCmsLayout({ sportsTree: { ept: {} } })).is.deep.equal({});
    });
  });
  describe("getCmsLayoutMobileVanilla", () => {
    it("should return `layouts` for `vanilla` from store", () => {
      expect(
        getCmsLayoutMobileVanilla({
          auth: {
            mobileView: "VANILLA",
          },
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: {
                  id: 1,
                },
              },
            },
          },
        }),
      ).is.deep.equal({
        id: 1,
      });
    });
    it("should return `empty array` when `sport` is empty", () => {
      expect(getCmsLayoutMobileVanilla({})).is.undefined;
      expect(getCmsLayoutMobileVanilla({ sportsTree: {} })).is.undefined;
      expect(getCmsLayoutMobileVanilla({ sportsTree: { ept: {} } })).is.undefined;
    });
  });
});

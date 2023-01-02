/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { getCachedAssets } from "../../../redux/reselect/assets-selectors";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getCachedAssets", () => {
    it("should return `cachedAssets` from store", () => {
      expect(
        getCachedAssets({
          asset: {
            cachedAssets: [
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
    it("should return `empty object` when `asset` is empty", () => {
      expect(getCachedAssets({ asset: {} })).is.deep.equal({});
      expect(getCachedAssets({})).is.deep.equal({});
    });
  });
});

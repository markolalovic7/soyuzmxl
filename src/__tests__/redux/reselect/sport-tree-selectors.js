/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { getSportsTreeSelector } from "../../../redux/reselect/sport-tree-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getSportsTreeSelector", () => {
    it("should return `sportsTree` from store", () => {
      expect(
        getSportsTreeSelector({
          sportsTree: {
            sportsTreeData: {
              ept: [
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
      expect(getSportsTreeSelector({})).is.deep.equal([]);
      expect(getSportsTreeSelector({ sportsTree: {} })).is.deep.equal([]);
      expect(getSportsTreeSelector({ sportsTree: { ept: {} } })).is.deep.equal([]);
    });
  });
});

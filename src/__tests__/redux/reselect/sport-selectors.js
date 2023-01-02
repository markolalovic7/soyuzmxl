/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { getSportsSelector } from "../../../redux/reselect/sport-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getSportsSelector", () => {
    it("should return `sports` from store", () => {
      expect(
        getSportsSelector({
          sport: {
            sports: [
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
    it("should return `empty array` when `sport` is empty", () => {
      expect(getSportsSelector({})).is.deep.equal([]);
      expect(getSportsSelector({ sport: {} })).is.deep.equal([]);
    });
  });
});

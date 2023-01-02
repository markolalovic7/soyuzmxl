/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getSortedSportTreesBySportsOrder } from "utils/sort/sport-tree-sort";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getSortedSportTreesBySportsOrder", () => {
    it("should sort `sportTree` by `code` and `sportsOrder`", () => {
      const sportsTree1 = {
        code: "A-28",
        id: "45363510-1aea-11e8-a3e2-73fde16f7e58",
      };
      const sportsTree2 = {
        code: "A-29",
        id: "0e621ae0-1aea-11e8-a3e2-73fde16f7e58",
      };
      const sportsTree3 = {
        code: "A-30",
        id: "e30d85a0-1ae4-11e8-a38f-ef45d908c4b2",
      };
      const sportsTree4 = {
        code: "A-50",
        id: "cc1254b0-1ae0-11e8-8564-f56c6cfad19e",
      };
      expect(
        getSortedSportTreesBySportsOrder(
          [sportsTree1, sportsTree2, sportsTree3, sportsTree4],
          ["A-28", "A-29", "A-30", "A-31", "A-40", "A-50"],
        ),
      ).to.be.deep.equal([sportsTree1, sportsTree2, sportsTree3, sportsTree4]);
      expect(
        getSortedSportTreesBySportsOrder(
          [sportsTree1, sportsTree3, sportsTree2, sportsTree4],
          ["A-50", "A-28", "A-48", "A-47"],
        ),
      ).to.be.deep.equal([sportsTree4, sportsTree1, sportsTree3, sportsTree2]);
      expect(
        getSortedSportTreesBySportsOrder(
          [sportsTree2, sportsTree1, sportsTree3, sportsTree4],
          ["A-1", "A-27", "A-28", "A-50"],
        ),
      ).to.be.deep.equal([sportsTree1, sportsTree4, sportsTree2, sportsTree3]);
      expect(
        getSortedSportTreesBySportsOrder(
          [sportsTree2, sportsTree3, sportsTree1, sportsTree4],
          ["A-29", "A-50", "A-30", "A-28"],
        ),
      ).to.be.deep.equal([sportsTree2, sportsTree4, sportsTree3, sportsTree1]);
      expect(
        getSortedSportTreesBySportsOrder(
          [sportsTree2, sportsTree3, sportsTree1, sportsTree4],
          ["A-129", "A-150", "A-130", "A-128"],
        ),
      ).to.be.deep.equal([sportsTree2, sportsTree3, sportsTree1, sportsTree4]);
    });
  });
});

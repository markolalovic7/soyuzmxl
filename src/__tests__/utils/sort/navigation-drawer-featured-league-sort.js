/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getSortedFeaturedLeagues } from "utils/sort/navigation-drawer-featured-league-sort";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getSortedFeaturedLeagues", () => {
    it("should sort leagues by `ordinal`", () => {
      const featuredLeague1 = {
        id: "45363510-1aea-11e8-a3e2-73fde16f7e58",
        ordinal: 50,
      };
      const featuredLeague2 = {
        id: "0e621ae0-1aea-11e8-a3e2-73fde16f7e58",
        ordinal: 28,
      };
      const featuredLeague3 = {
        id: "e30d85a0-1ae4-11e8-a38f-ef45d908c4b2",
        ordinal: 30,
      };
      const featuredLeague4 = {
        id: "cc1254b0-1ae0-11e8-8564-f56c6cfad19e",
        ordinal: 29,
      };
      expect(
        getSortedFeaturedLeagues([featuredLeague1, featuredLeague2, featuredLeague3, featuredLeague4]),
      ).to.be.deep.equal([featuredLeague2, featuredLeague4, featuredLeague3, featuredLeague1]);
      expect(
        getSortedFeaturedLeagues([featuredLeague1, featuredLeague3, featuredLeague2, featuredLeague4]),
      ).to.be.deep.equal([featuredLeague2, featuredLeague4, featuredLeague3, featuredLeague1]);
      expect(
        getSortedFeaturedLeagues([featuredLeague2, featuredLeague1, featuredLeague3, featuredLeague4]),
      ).to.be.deep.equal([featuredLeague2, featuredLeague4, featuredLeague3, featuredLeague1]);
      expect(
        getSortedFeaturedLeagues([featuredLeague2, featuredLeague3, featuredLeague1, featuredLeague4]),
      ).to.be.deep.equal([featuredLeague2, featuredLeague4, featuredLeague3, featuredLeague1]);
      expect(
        getSortedFeaturedLeagues([featuredLeague3, featuredLeague1, featuredLeague2, featuredLeague4]),
      ).to.be.deep.equal([featuredLeague2, featuredLeague4, featuredLeague3, featuredLeague1]);
      expect(
        getSortedFeaturedLeagues([featuredLeague3, featuredLeague2, featuredLeague1, featuredLeague4]),
      ).to.be.deep.equal([featuredLeague2, featuredLeague4, featuredLeague3, featuredLeague1]);
    });
  });
});

/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { sortByDescription } from "utils/sort/result-sort";

describe(path.relative(process.cwd(), __filename), () => {
  describe("sortByDescription", () => {
    it("should sort results by `ordinal`", () => {
      const result1 = {
        description: "A-50",
        id: "45363510-1aea-11e8-a3e2-73fde16f7e58",
      };
      const result2 = {
        description: "A-28",
        id: "0e621ae0-1aea-11e8-a3e2-73fde16f7e58",
      };
      const result3 = {
        description: "A-30",
        id: "e30d85a0-1ae4-11e8-a38f-ef45d908c4b2",
      };
      const result4 = {
        description: "A-29",
        id: "cc1254b0-1ae0-11e8-8564-f56c6cfad19e",
      };
      expect(sortByDescription([result1, result2, result3, result4])).to.be.deep.equal([
        result2,
        result4,
        result3,
        result1,
      ]);
      expect(sortByDescription([result1, result3, result2, result4])).to.be.deep.equal([
        result2,
        result4,
        result3,
        result1,
      ]);
      expect(sortByDescription([result2, result1, result3, result4])).to.be.deep.equal([
        result2,
        result4,
        result3,
        result1,
      ]);
      expect(sortByDescription([result2, result3, result1, result4])).to.be.deep.equal([
        result2,
        result4,
        result3,
        result1,
      ]);
      expect(sortByDescription([result3, result1, result2, result4])).to.be.deep.equal([
        result2,
        result4,
        result3,
        result1,
      ]);
      expect(sortByDescription([result3, result2, result1, result4])).to.be.deep.equal([
        result2,
        result4,
        result3,
        result1,
      ]);
    });
  });
});

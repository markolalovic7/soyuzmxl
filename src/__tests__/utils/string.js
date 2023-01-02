/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { isStringTrimmedEmpty } from "utils/string";

describe(path.relative(process.cwd(), __filename), () => {
  describe("isStringTrimmedEmpty", () => {
    it("should return `true` when string is empty", () => {
      expect(isStringTrimmedEmpty("")).is.true;
      expect(isStringTrimmedEmpty("simple")).is.false;
    });
    it("should return `true` when string has spaces", () => {
      expect(isStringTrimmedEmpty("      ")).is.true;
      expect(isStringTrimmedEmpty("   ")).is.true;
    });
  });
});

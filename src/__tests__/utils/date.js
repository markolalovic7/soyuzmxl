/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getNow, parseDate, parseDateToISO, parseDateToTimestamp } from "utils/date";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getNow", () => {
    it("should return date now", () => {
      expect(getNow()).is.instanceOf(Date);
    });
  });
  describe("parseDate", () => {
    it("should return parsed date", () => {
      const date = new Date();
      expect(parseDate(date)).is.instanceOf(Date);
    });
  });
  describe("parseDateToISO", () => {
    it("should return date converted to ISO string", () => {
      const date = new Date();
      expect(parseDateToISO(date)).to.be.equal(date.toISOString());
    });
  });
  describe("parseDateToTimestamp", () => {
    it("should return date converted to timestamp", () => {
      const date = new Date();
      expect(parseDateToTimestamp(date)).to.be.equal(date.valueOf());
    });
  });
});

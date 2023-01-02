/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import {
  getLocaleDateDayNumberMonth,
  getLocaleDateDayNumberMonthTimeFormat,
  getLocaleDateDayNumberMonthTimeFormatKOSpecific,
  getLocaleDateSlashTimeFormat,
  getLocaleFullDateFormat,
  getLocaleShortDateWeekdayMonthDayNumberYearFormat,
  getLocaleWeekdayMonthDayNumber,
} from "utils/date-format";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getLocaleFullDateFormat", () => {
    it("should return format for `en`", () => {
      expect(getLocaleFullDateFormat("en")).is.equal("dddd, DD MMMM HH:mm");
    });
    it("should return format for `ko`", () => {
      expect(getLocaleFullDateFormat("ko")).is.equal("YYYY년 MM월 DD일 dddd HH:mm");
    });
    it("should return default value", () => {
      expect(getLocaleFullDateFormat()).is.equal("dddd, DD MMMM HH:mm");
    });
  });
  describe("getLocaleDateDayNumberMonth", () => {
    it("should return format for `en`", () => {
      expect(getLocaleDateDayNumberMonth("en")).is.equal("DD MMMM");
    });
    it("should return format for `ko`", () => {
      expect(getLocaleDateDayNumberMonth("ko")).is.equal("MM월 DD일");
    });
    it("should return default value", () => {
      expect(getLocaleDateDayNumberMonth()).is.equal("DD MMMM");
    });
  });
  describe("getLocaleDateSlashTimeFormat", () => {
    it("should return format for `en`", () => {
      expect(getLocaleDateSlashTimeFormat("en")).is.equal("DD MMMM | HH:mm");
    });
    it("should return format for `ko`", () => {
      expect(getLocaleDateSlashTimeFormat("ko")).is.equal("MM월 DD일 | HH:mm");
    });
    it("should return default value", () => {
      expect(getLocaleDateSlashTimeFormat()).is.equal("DD MMMM | HH:mm");
    });
  });
  describe("getLocaleWeekdayMonthDayNumber", () => {
    it("should return format for `en`", () => {
      expect(getLocaleWeekdayMonthDayNumber("en")).is.equal("dddd MMMM DD");
    });
    it("should return format for `ko`", () => {
      expect(getLocaleWeekdayMonthDayNumber("ko")).is.equal("MM월 DD일 dddd");
    });
    it("should return default value", () => {
      expect(getLocaleWeekdayMonthDayNumber()).is.equal("dddd MMMM DD");
    });
  });
  describe("getLocaleDateDayNumberMonthTimeFormat", () => {
    it("should return format for `en`", () => {
      expect(getLocaleDateDayNumberMonthTimeFormat("en")).is.equal("DD MMMM HH:mm");
    });
    it("should return format for `ko`", () => {
      expect(getLocaleDateDayNumberMonthTimeFormat("ko")).is.equal("MM월 DD일 HH:mm");
    });
    it("should return default value", () => {
      expect(getLocaleDateDayNumberMonthTimeFormat()).is.equal("DD MMMM HH:mm");
    });
  });
  describe("getLocaleDateDayNumberMonthTimeFormatKOSpecific", () => {
    it("should return format for `en`", () => {
      expect(getLocaleDateDayNumberMonthTimeFormatKOSpecific("en")).is.equal("DD MMMM HH:mm");
    });
    it("should return format for `ko`", () => {
      expect(getLocaleDateDayNumberMonthTimeFormatKOSpecific("ko")).is.equal("MM월 DD일 HH:mm");
    });
    it("should return default value", () => {
      expect(getLocaleDateDayNumberMonthTimeFormatKOSpecific()).is.equal("DD MMMM HH:mm");
    });
  });
  describe("getLocaleShortDateWeekdayMonthDayNumberYearFormat", () => {
    it("should return format for `en`", () => {
      expect(getLocaleShortDateWeekdayMonthDayNumberYearFormat("en")).is.equal("ddd, MMM DD, YYYY");
    });
    it("should return format for `ko`", () => {
      expect(getLocaleShortDateWeekdayMonthDayNumberYearFormat("ko")).is.equal("YY년 MM월 DD일 dd요일");
    });
    it("should return default value", () => {
      expect(getLocaleShortDateWeekdayMonthDayNumberYearFormat()).is.equal("ddd, MMM DD, YYYY");
    });
  });
});

/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import dayjs from "dayjs";
import { describe, it } from "mocha";
import {
  getDatejsObjectFormatted,
  formatDateHoursMinutes,
  formatDateDayMonthLong,
  formatDateDayMonthShort,
  formatDateYearMonthDay,
  formatDateDayMonthYear,
  formatDateMonthLongDayHourMinutes,
} from "utils/dayjs-format";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getDatejsObject", () => {
    it("should format dayjs object", () => {
      const dayjsObject = dayjs("2021-01-01T00:00:15.000Z");
      expect(getDatejsObjectFormatted(dayjsObject, "YYYY MM DD")).is.equal("2021 01 01");
      expect(getDatejsObjectFormatted(dayjsObject, "MM DD")).is.equal("01 01");
    });
  });
  describe("formatDateHoursMinutes", () => {
    it("should format dayjs object", () => {
      const dayjsObject = dayjs("2021-01-01T01:00:00.000");
      expect(formatDateHoursMinutes(dayjsObject)).is.equal("01:00");
    });
  });
  describe("formatDateDayMonthShort", () => {
    it("should format dayjs object", () => {
      expect(formatDateDayMonthShort(dayjs("2021-01-01T00:00:15.000Z"))).is.equal("01 Jan");
      expect(formatDateDayMonthShort(dayjs("2021-05-11T00:00:15.000Z"))).is.equal("11 May");
    });
  });
  describe("formatDateDayMonthLong", () => {
    it("should format dayjs object", () => {
      expect(formatDateDayMonthLong(dayjs("2021-01-01T00:00:15.000Z"))).is.equal("01 January");
      expect(formatDateDayMonthLong(dayjs("2021-05-11T00:00:15.000Z"))).is.equal("11 May");
    });
  });
  describe("formatDateYearMonthDay", () => {
    it("should format dayjs object", () => {
      expect(formatDateYearMonthDay(dayjs("2021-01-01T00:00:15.000Z"))).is.equal("2021-01-01");
      expect(formatDateYearMonthDay(dayjs("2021-05-11T00:00:15.000Z"))).is.equal("2021-05-11");
    });
  });
  describe("formatDateDayMonthYear", () => {
    it("should format dayjs object", () => {
      expect(formatDateDayMonthYear(dayjs("2021-01-01T00:00:15.000Z"))).is.equal("01-01-2021");
      expect(formatDateDayMonthYear(dayjs("2021-05-11T00:00:15.000Z"))).is.equal("11-05-2021");
    });
  });
  describe("formatDateMonthLongDayHourMinutes", () => {
    it("should format dayjs object", () => {
      expect(formatDateMonthLongDayHourMinutes(dayjs("2021-01-01T01:00:15.000"))).is.equal("January 1, 01:00");
      expect(formatDateMonthLongDayHourMinutes(dayjs("2021-05-11T02:00:15.000"))).is.equal("May 11, 02:00");
    });
  });
});

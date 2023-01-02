/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import dayjs from "dayjs";
import { describe, it } from "mocha";
import {
  getDatejsNow,
  getDatejsObject,
  getDatejsObjectTimestamp,
  getDatejsObjectHours00Min00Sec00,
  getDatejsObjectHours23Min59Sec59,
  getDatejsDay,
  getDatejsMonth,
  getDatejsYear,
  getDatejsObjectISO,
} from "utils/dayjs";

const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);
dayjs.extend(timezone);

describe(path.relative(process.cwd(), __filename), () => {
  describe("getDatejsNow", () => {
    it("should return dayjs object", () => {
      expect(getDatejsNow()).is.instanceOf(dayjs);
      expect(getDatejsNow().isAfter("2021-01-01")).is.true;
    });
  });
  describe("getDatejsObject", () => {
    it("should return dayjs object from ISO string", () => {
      const date = "2021-01-01T00:00:15.000Z";
      expect(getDatejsObject(date)).is.instanceOf(dayjs);
      expect(getDatejsObject(date).isAfter("2021-01-01")).is.true;
      expect(getDatejsObject(date).get("year")).is.equal(2021);
      expect(getDatejsObject(date).get("month")).is.equal(0);
      expect(getDatejsObject(date).get("date")).is.equal(1);
    });
  });
  describe("getDatejsObjectTimestamp", () => {
    it("should return timestamp dayjs object", () => {
      const date = dayjs("2021-01-01T00:00:15.000Z");
      expect(getDatejsObjectTimestamp(date)).is.equal(1609459215000);
    });
  });
  describe("getDatejsObjectHours00Min00Sec00", () => {
    it("should return datejs object with 0 hour, 0 minute and 0 seconds", () => {
      const date = dayjs("2021-05-05T23:44:15.000Z");
      expect(getDatejsObjectHours00Min00Sec00(date)).is.instanceOf(dayjs);
      expect(getDatejsObjectHours00Min00Sec00(date).get("hour")).is.equal(0);
      expect(getDatejsObjectHours00Min00Sec00(date).get("minute")).is.equal(0);
      expect(getDatejsObjectHours00Min00Sec00(date).get("second")).is.equal(0);
    });
  });
  describe("getDatejsObjectHours23Min59Sec59", () => {
    it("should return datejs object with 23 hour, 59 minute and 59 seconds", () => {
      const date = dayjs("2021-05-05T23:44:15.000Z");
      expect(getDatejsObjectHours23Min59Sec59(date)).is.instanceOf(dayjs);
      expect(getDatejsObjectHours23Min59Sec59(date).get("hour")).is.equal(23);
      expect(getDatejsObjectHours23Min59Sec59(date).get("minute")).is.equal(59);
      expect(getDatejsObjectHours23Min59Sec59(date).get("second")).is.equal(59);
    });
  });
  describe("getDatejsDay", () => {
    it("should return day from dayjs object", () => {
      expect(getDatejsDay(dayjs("2021-05-01T00:00:00.000Z"))).is.equal(1);
      expect(getDatejsDay(dayjs("2021-05-05T00:00:00.000Z"))).is.equal(5);
    });
  });
  describe("getDatejsDay", () => {
    it("should return month from dayjs object", () => {
      expect(getDatejsMonth(dayjs("2021-01-01T00:00:00.000Z"))).is.equal(0);
      expect(getDatejsMonth(dayjs("2021-04-05T00:00:00.000Z"))).is.equal(3);
    });
  });
  describe("getDatejsYear", () => {
    it("should return year from dayjs object", () => {
      expect(getDatejsYear(dayjs("2021-01-01T00:00:00.000Z"))).is.equal(2021);
      expect(getDatejsYear(dayjs("2022-04-05T00:00:00.000Z"))).is.equal(2022);
    });
  });
  describe("getDatejsObjectISO", () => {
    it("should return date in iso format from dayjs object", () => {
      expect(getDatejsObjectISO(dayjs("2021-01-01T00:00:00.000Z").tz("Europe/Amsterdam"))).is.equal(
        "2021-01-01T01:00:00+01:00",
      );
      expect(getDatejsObjectISO(dayjs("2022-04-05T00:00:00.000Z").tz("Europe/Amsterdam"))).is.equal(
        "2022-04-05T02:00:00+02:00",
      );
    });
  });
});

/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import dayjs from "dayjs";
import { describe, it } from "mocha";
import { formatDateNext7Days, getGenderTranslated, getDateParsed } from "utils/ui-labels";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getGenderTranslated", () => {
    it("should format dayjs object", () => {
      const t = (value) => value;
      expect(getGenderTranslated("M", t)).is.equal("forms.gender_male");
      expect(getGenderTranslated("F", t)).is.equal("forms.gender_female");
    });
  });
  describe("formatDateNext7Days", () => {
    it("should formatted date", () => {
      expect(formatDateNext7Days(dayjs("2021-01-01T00:00:15.000Z"))).is.equal("Jan 01-Jan 08, 2021");
      expect(formatDateNext7Days(dayjs("2021-08-05T00:00:15.000Z"))).is.equal("Aug 05-Aug 12, 2021");
    });
  });
  describe("getDateParsed", () => {
    it("should format dayjs object", () => {
      expect(getDateParsed({ day: 1, month: 0, year: 2021 })).is.equal("2021-01-01");
      expect(getDateParsed({ day: 1, month: 11, year: 2021 })).is.equal("2021-12-01");
    });
  });
});

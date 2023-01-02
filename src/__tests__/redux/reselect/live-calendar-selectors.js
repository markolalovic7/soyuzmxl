/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { makeGetLiveCalendarDataInRange } from "../../../redux/reselect/live-calendar-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("makeGetLiveCalendarDataInRange", () => {
    const getLiveCalendarDataInRange = makeGetLiveCalendarDataInRange();
    it("should return `liveCalendarData` filtered by `dateEnd` and `dateStart`", () => {
      expect(
        getLiveCalendarDataInRange(
          {
            liveCalendar: {
              liveCalendarData: [
                {
                  epoch: 4,
                  id: 1,
                  sportCode: "sportCode1",
                },
                {
                  epoch: 7,
                  id: 2,
                  sportCode: "sportCode1",
                },
                {
                  epoch: 2,
                  id: 3,
                  sportCode: "sportCode2",
                },
              ],
            },
            sport: {
              sports: {
                sportCode1: {
                  description: "description",
                },
              },
            },
          },
          {
            dateEnd: 10,
            dateStart: 5,
          },
        ),
      ).is.deep.equal([
        {
          epoch: 7,
          id: 2,
          sportCode: "sportCode1",
          sportDescription: "description",
        },
      ]);
    });
    it("should return `empty array` when `liveCalendarData` is empty", () => {
      expect(
        getLiveCalendarDataInRange(
          {},
          {
            dateEnd: 10,
            dateStart: 5,
          },
        ),
      ).is.deep.equal([]);
      expect(
        getLiveCalendarDataInRange(
          {
            liveCalendar: {},
          },
          {
            dateEnd: 10,
            dateStart: 5,
          },
        ),
      ).is.deep.equal([]);
    });
  });
});

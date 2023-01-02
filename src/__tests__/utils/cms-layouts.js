/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getLayoutViewByRoute } from "utils/cms-layouts";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getLayoutViewByRoute", () => {
    it("should return 'PLAYER_PRIVATE_AREA` layout when route is /createaccount", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PLAYER_PRIVATE_AREA",
            },
          ],
          "/createaccount",
        ),
      ).is.deep.equal({
        route: "PLAYER_PRIVATE_AREA",
      });
    });
    it("should return 'PLAYER_PRIVATE_AREA` layout when route is /editaccount", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PLAYER_PRIVATE_AREA",
            },
          ],
          "/editaccount",
        ),
      ).is.deep.equal({
        route: "PLAYER_PRIVATE_AREA",
      });
    });
    it("should return 'PLAYER_PRIVATE_AREA` layout when route is /security", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PLAYER_PRIVATE_AREA",
            },
          ],
          "/security",
        ),
      ).is.deep.equal({
        route: "PLAYER_PRIVATE_AREA",
      });
    });
    it("should return 'PLAYER_PRIVATE_AREA` layout when route is /mybets", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PLAYER_PRIVATE_AREA",
            },
          ],
          "/mybets",
        ),
      ).is.deep.equal({
        route: "PLAYER_PRIVATE_AREA",
      });
    });
    it("should return 'PLAYER_PRIVATE_AREA` layout when route is /mystatements", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PLAYER_PRIVATE_AREA",
            },
          ],
          "/mystatements",
        ),
      ).is.deep.equal({
        route: "PLAYER_PRIVATE_AREA",
      });
    });
    it("should return 'PREMATCH` layout when route is /jackpots", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PREMATCH",
            },
          ],
          "/jackpots",
        ),
      ).is.deep.equal({
        route: "PREMATCH",
      });
    });
    it("should return 'PREMATCH` layout when route is /jackpots/:jackpotId", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PREMATCH",
            },
          ],
          "/jackpots/42",
        ),
      ).is.deep.equal({
        route: "PREMATCH",
      });
    });
    it("should return 'BETRADAR_VIRTUAL_SPORTS` layout when route is /brvirtual/:feedCode", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "BETRADAR_VIRTUAL_SPORTS",
            },
          ],
          "/brvirtual/42",
        ),
      ).is.deep.equal({
        route: "BETRADAR_VIRTUAL_SPORTS",
      });
    });
    it("should return 'KIRON_VIRTUAL_SPORTS` layout when route is /krvirtual/:feedCode", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "KIRON_VIRTUAL_SPORTS",
            },
          ],
          "/krvirtual/42",
        ),
      ).is.deep.equal({
        route: "KIRON_VIRTUAL_SPORTS",
      });
    });
    it("should return 'DASHBOARD` layout when route is /", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "DASHBOARD",
            },
          ],
          "/",
        ),
      ).is.deep.equal({
        route: "DASHBOARD",
      });
    });
    it("should return 'LIVE` layout when route is /live", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "LIVE",
            },
          ],
          "/live",
        ),
      ).is.deep.equal({
        route: "LIVE",
      });
    });
    it("should return 'LIVE` layout when route is /live/event/:eventId", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "LIVE",
            },
            {
              route: "LIVE_EVENT_DETAIL",
            },
          ],
          "/live/event/42",
        ),
      ).is.deep.equal({
        route: "LIVE_EVENT_DETAIL",
      });
    });
    it("should return 'CALENDAR` layout when route is /livecalendar", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "CALENDAR",
            },
          ],
          "/livecalendar",
        ),
      ).is.deep.equal({
        route: "CALENDAR",
      });
    });
    it("should return 'PREMATCH` layout when route is /prematch/eventpath/:eventPathId/:eventId and eventPathId is not in list", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PREMATCH",
            },
            {
              eventPathIds: [1, 2, 3],
              route: "PREMATCH_SPECIFIC_EVENT_PATH",
            },
          ],
          "/prematch/eventpath/42/111",
        ),
      ).is.deep.equal({
        route: "PREMATCH",
      });
    });
    it("should return 'PREMATCH` layout when route is /prematch/eventpath/:eventPathId/:eventId and eventPathId is in list", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PREMATCH",
            },
            {
              eventPathIds: [42, 2, 3],
              route: "PREMATCH_SPECIFIC_EVENT_PATH",
            },
          ],
          "/prematch/eventpath/42/111",
        ),
      ).is.deep.equal({
        eventPathIds: [42, 2, 3],
        route: "PREMATCH_SPECIFIC_EVENT_PATH",
      });
    });
    it("should return 'PREMATCH` layout when route is /prematch/eventpath/:eventPathId and eventPathId is not in list", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PREMATCH",
            },
            {
              eventPathIds: [1, 2, 3],
              route: "PREMATCH_SPECIFIC_EVENT_PATH",
            },
          ],
          "/prematch/eventpath/42",
        ),
      ).is.deep.equal({
        route: "PREMATCH",
      });
    });
    it("should return 'PREMATCH` layout when route is /prematch/eventpath/:eventPathId and eventPathId is in list", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PREMATCH",
            },
            {
              eventPathIds: [42, 2, 3],
              route: "PREMATCH_SPECIFIC_EVENT_PATH",
            },
          ],
          "/prematch/eventpath/42",
        ),
      ).is.deep.equal({
        eventPathIds: [42, 2, 3],
        route: "PREMATCH_SPECIFIC_EVENT_PATH",
      });
    });
    it("should return 'PREMATCH` layout when route is /prematch/search", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "PREMATCH",
            },
          ],
          "/prematch/search",
        ),
      ).is.deep.equal({
        route: "PREMATCH",
      });
    });
    it("should return 'RESULTS` layout when route is /results", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "RESULTS",
            },
          ],
          "/results",
        ),
      ).is.deep.equal({
        route: "RESULTS",
      });
    });
    it("should return 'undefined` layout when route is not supported", () => {
      expect(
        getLayoutViewByRoute(
          [
            {
              route: "ROUTE-1",
            },
            {
              route: "RESULTS",
            },
          ],
          "/some_cool_route",
        ),
      ).is.undefined;
    });
  });
});

/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getRouteByInternalComponent } from "utils/navigation-drawer";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getRouteByInternalComponent", () => {
    it("should return `/` when `internalComponent` is `undefined`", () => {
      expect(getRouteByInternalComponent(undefined)).is.equal("/");
    });
    it("should return valid pattern", () => {
      expect(getRouteByInternalComponent("BET_CALCULATOR")).is.equal("/betcalculator");
      expect(getRouteByInternalComponent("HOME")).is.equal("/");
      expect(getRouteByInternalComponent("LIVE_CALENDAR")).is.equal("/livecalendar");
    });
  });
});

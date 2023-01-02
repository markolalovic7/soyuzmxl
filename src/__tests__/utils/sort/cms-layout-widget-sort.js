/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getSortedWidgets } from "utils/sort/cms-layout-widget-sort";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getSortedWidgets", () => {
    it("should sort widgets by `ordinal`", () => {
      const widget1 = {
        id: "45363510-1aea-11e8-a3e2-73fde16f7e58",
        ordinal: 50,
      };
      const widget2 = {
        id: "0e621ae0-1aea-11e8-a3e2-73fde16f7e58",
        ordinal: 28,
      };
      const widget3 = {
        id: "e30d85a0-1ae4-11e8-a38f-ef45d908c4b2",
        ordinal: 30,
      };
      const widget4 = {
        id: "cc1254b0-1ae0-11e8-8564-f56c6cfad19e",
        ordinal: 29,
      };
      expect(getSortedWidgets([widget1, widget2, widget3, widget4])).to.be.deep.equal([
        widget2,
        widget4,
        widget3,
        widget1,
      ]);
      expect(getSortedWidgets([widget1, widget3, widget2, widget4])).to.be.deep.equal([
        widget2,
        widget4,
        widget3,
        widget1,
      ]);
      expect(getSortedWidgets([widget2, widget1, widget3, widget4])).to.be.deep.equal([
        widget2,
        widget4,
        widget3,
        widget1,
      ]);
      expect(getSortedWidgets([widget2, widget3, widget1, widget4])).to.be.deep.equal([
        widget2,
        widget4,
        widget3,
        widget1,
      ]);
      expect(getSortedWidgets([widget3, widget1, widget2, widget4])).to.be.deep.equal([
        widget2,
        widget4,
        widget3,
        widget1,
      ]);
      expect(getSortedWidgets([widget3, widget2, widget1, widget4])).to.be.deep.equal([
        widget2,
        widget4,
        widget3,
        widget1,
      ]);
    });
  });
});

/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getBetradarFeedCodeTranslated } from "utils/betradar-virtual-sport";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getBetradarFeedCodeTranslated", () => {
    const t = (value) => value;
    it("should return alert message when `feedCode` is `VBI`", () => {
      expect(getBetradarFeedCodeTranslated("VBI", t)).is.equal("virtual.betradar.VBI");
    });
    it("should return alert message when `feedCode` is `VBL`", () => {
      expect(getBetradarFeedCodeTranslated("VBL", t)).is.equal("virtual.betradar.VBL");
    });
    it("should return alert message when `feedCode` is `VFAC`", () => {
      expect(getBetradarFeedCodeTranslated("VFAC", t)).is.equal("virtual.betradar.VFAC");
    });
    it("should return alert message when `feedCode` is `VFC`", () => {
      expect(getBetradarFeedCodeTranslated("VFC", t)).is.equal("virtual.betradar.VFC");
    });
    it("should return alert message when `feedCode` is `VFLC`", () => {
      expect(getBetradarFeedCodeTranslated("VFLC", t)).is.equal("virtual.betradar.VFLC");
    });
    it("should return alert message when `feedCode` is `VFNC`", () => {
      expect(getBetradarFeedCodeTranslated("VFNC", t)).is.equal("virtual.betradar.VFNC");
    });
    it("should return alert message when `feedCode` is `VFWC`", () => {
      expect(getBetradarFeedCodeTranslated("VFWC", t)).is.equal("virtual.betradar.VFWC");
    });
    it("should return alert message when `feedCode` is `VTI`", () => {
      expect(getBetradarFeedCodeTranslated("VTI", t)).is.equal("virtual.betradar.VTI");
    });
    it("should return default `undefined` when `feedCode` is not supported", () => {
      expect(getBetradarFeedCodeTranslated(undefined, t)).is.undefined;
    });
  });
});

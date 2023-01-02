/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getKironFeedCodeTranslated } from "utils/kiron-virtual-sport";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getKironFeedCodeTranslated", () => {
    const t = (value) => value;
    it("should return alert message when `feedCode` is `BADM`", () => {
      expect(getKironFeedCodeTranslated("BADM", t)).is.equal("kiron_virtual.feed_code_badm");
    });
    it("should return alert message when `feedCode` is `BASK`", () => {
      expect(getKironFeedCodeTranslated("BASK", t)).is.equal("kiron_virtual.feed_code_bask");
    });
    it("should return alert message when `feedCode` is `CAR`", () => {
      expect(getKironFeedCodeTranslated("CAR", t)).is.equal("kiron_virtual.feed_code_car");
    });
    it("should return alert message when `feedCode` is `FFL`", () => {
      expect(getKironFeedCodeTranslated("FFL", t)).is.equal("kiron_virtual.feed_code_ffl");
    });
    it("should return alert message when `feedCode` is `FSM`", () => {
      expect(getKironFeedCodeTranslated("FSM", t)).is.equal("kiron_virtual.feed_code_fsm");
    });
    it("should return alert message when `feedCode` is `GREY`", () => {
      expect(getKironFeedCodeTranslated("GREY", t)).is.equal("kiron_virtual.feed_code_grey");
    });
    it("should return alert message when `feedCode` is `HORS`", () => {
      expect(getKironFeedCodeTranslated("HORS", t)).is.equal("kiron_virtual.feed_code_hors");
    });
    it("should return alert message when `feedCode` is `TABL`", () => {
      expect(getKironFeedCodeTranslated("TABL", t)).is.equal("kiron_virtual.feed_code_tabl");
    });
    it("should return default `undefined` when `feedCode` is not supported", () => {
      expect(getKironFeedCodeTranslated(undefined, t)).is.undefined;
    });
  });
});

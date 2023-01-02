/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getBannerLinkConfig } from "utils/banner";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getBannerLinkConfig", () => {
    it("should return default route when `mode` is not supported", () => {
      expect(getBannerLinkConfig({ mode: "SOME_MODE", url: "/home" })).is.deep.equal({ to: "/home" });
      expect(getBannerLinkConfig({ url: "/home" })).is.deep.equal({ to: "/home" });
    });
    it("should return valid link", () => {
      expect(getBannerLinkConfig({ mode: "POPUP", url: "/home" })).is.deep.equal({
        rel: "noopener noreferrer",
        target: "_blank",
        to: { pathname: "/home" },
      });
      expect(getBannerLinkConfig({ mode: "LINK", url: "/home" })).is.deep.equal({
        to: "/home",
      });
    });
  });
});

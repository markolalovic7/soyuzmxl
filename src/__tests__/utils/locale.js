/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getLocale } from "utils/locale";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getLocale", () => {
    it("should return default value when `locale` is `undefined`", () => {
      expect(getLocale(undefined)).is.equal("en-GB");
    });
    it("should return `locale`", () => {
      expect(getLocale("es")).is.equal("es-ES");
      expect(getLocale("vi")).is.equal("vi-VN");
    });
  });
});

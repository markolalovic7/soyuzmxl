/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { isDefined } from "utils/lodash";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getLocale", () => {
    it("should return `false` value when `value` is `undefined`", () => {
      expect(isDefined(undefined)).is.false;
    });
    it("should return `true` when value is defined ", () => {
      expect(isDefined(true)).is.true;
      expect(isDefined(null)).is.true;
    });
  });
});

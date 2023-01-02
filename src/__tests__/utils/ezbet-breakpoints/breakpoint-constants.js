import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import {
  LARGE_CONSTANTS,
  MEDIUM_CONSTANTS,
  SUPERLARGE_CONSTANTS,
  TABLET_CONSTANTS,
  XLARGE_CONSTANTS,
  XSMALL_CONSTANTS,
} from "../../../applications/ezbet/utils/breakpoint-constants";

describe(path.relative(process.cwd(), __filename), () => {
  it("XSMALL and TABLET must have the same keys list", () => {
    expect(Object.keys(XSMALL_CONSTANTS)).to.eql(Object.keys(TABLET_CONSTANTS));
  });
  it("TABLET and MEDIUM translation must have the same keys list", () => {
    expect(Object.keys(TABLET_CONSTANTS)).to.eql(Object.keys(MEDIUM_CONSTANTS));
  });
  it("MEDIUM and LARGE translation must have the same keys list", () => {
    expect(Object.keys(MEDIUM_CONSTANTS)).to.eql(Object.keys(LARGE_CONSTANTS));
  });
  it("LARGE and XLARGE translation must have the same keys list", () => {
    expect(Object.keys(LARGE_CONSTANTS)).to.eql(Object.keys(XLARGE_CONSTANTS));
  });
  it("XLARGE and SUPERLARGE translation must have the same keys list", () => {
    expect(Object.keys(XLARGE_CONSTANTS)).to.eql(Object.keys(SUPERLARGE_CONSTANTS));
  });
});

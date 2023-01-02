/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { getChatSessionId } from "../../../redux/reselect/chat-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getChatSessionId", () => {
    it("should return `referrals` from store", () => {
      expect(
        getChatSessionId({
          chat: {
            sessionId: 1,
          },
        }),
      ).is.equal(1);
    });
    it("should return `undefined` when `chat` is empty", () => {
      expect(getChatSessionId({})).is.undefined;
      expect(getChatSessionId({ chat: {} })).is.undefined;
    });
  });
});

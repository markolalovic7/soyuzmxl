/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { getSecurityQuestions } from "../../../redux/reselect/security-questions-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getSecurityQuestions", () => {
    it("should return `questions` from store", () => {
      expect(
        getSecurityQuestions({
          securityQuestion: {
            questions: [
              {
                description: "description",
                id: 1,
              },
            ],
          },
        }),
      ).is.deep.equal([
        {
          key: "1",
          label: "description",
          value: "1",
        },
      ]);
    });
    it("should return `empty array` when `questions` is empty", () => {
      expect(getSecurityQuestions({})).is.deep.equal([]);
      expect(getSecurityQuestions({ securityQuestion: {} })).is.deep.equal([]);
    });
  });
});

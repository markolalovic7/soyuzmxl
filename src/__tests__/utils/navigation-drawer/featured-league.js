/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getFeaturedLeagueItems } from "utils/navigation-drawer/featured-league";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getFeaturedLeagueItems", () => {
    it("should return `undefined` when `sportTreeData` is empty or `sportCode` is not found", () => {
      expect(
        getFeaturedLeagueItems(
          [
            {
              ordinal: 2,
              sportCode: "A",
            },
            {
              ordinal: 1,
              sportCode: "B",
            },
            {
              ordinal: 3,
              sportCode: "C",
            },
          ],
          [],
        ),
      ).is.deep.equal([]);
      expect(
        getFeaturedLeagueItems(
          [
            {
              ordinal: 2,
              sportCode: "A",
            },
            {
              ordinal: 1,
              sportCode: "B",
            },
            {
              ordinal: 3,
              sportCode: "C",
            },
          ],
          [
            {
              code: "Z",
            },
          ],
        ),
      ).is.deep.equal([]);
    });
    it("should return list of featured leagues", () => {
      expect(
        getFeaturedLeagueItems(
          [
            {
              eventPathId: 10,
              ordinal: 2,
              sportCode: "A",
            },
            {
              eventPathId: 12,
              ordinal: 1,
              sportCode: "B",
            },
            {
              eventPathId: 15,
              ordinal: 3,
              sportCode: "C",
            },
          ],
          [
            {
              code: "C",
              path: [
                {
                  path: [
                    {
                      criterias: {
                        live: 1,
                      },
                      id: 1,
                    },
                    {
                      criterias: {
                        live: 1,
                      },
                      id: 12,
                    },
                    {
                      criterias: {
                        live: 1,
                      },
                      id: 15,
                    },
                    {
                      criterias: {
                        live: 1,
                      },
                      id: 17,
                    },
                  ],
                },
              ],
            },
            {
              code: "A",
              path: [
                {
                  path: [
                    {
                      criterias: {
                        live: 1,
                      },
                      id: 1,
                      path: [
                        {
                          criterias: {
                            live: 1,
                          },
                          id: 12,
                        },
                        {
                          criterias: {
                            live: 0,
                          },
                          id: 10,
                        },
                        {
                          criterias: {
                            live: 1,
                          },
                          id: 17,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        ),
      ).to.be.deep.equal([
        {
          eventPathId: 10,
          live: true,
          ordinal: 2,
          sportCode: "A",
        },
        {
          eventPathId: 15,
          live: true,
          ordinal: 3,
          sportCode: "C",
        },
      ]);
    });
  });
});

/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import { getSortedCarouselImages } from "utils/sort/carousel-image-sort";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getSortedCarouselImages", () => {
    it("should sort images by `ordinal`", () => {
      const image1 = {
        id: "45363510-1aea-11e8-a3e2-73fde16f7e58",
        ordinal: 50,
      };
      const image2 = {
        id: "0e621ae0-1aea-11e8-a3e2-73fde16f7e58",
        ordinal: 28,
      };
      const image3 = {
        id: "e30d85a0-1ae4-11e8-a38f-ef45d908c4b2",
        ordinal: 30,
      };
      const image4 = {
        id: "cc1254b0-1ae0-11e8-8564-f56c6cfad19e",
        ordinal: 29,
      };
      expect(getSortedCarouselImages([image1, image2, image3, image4])).to.be.deep.equal([
        image2,
        image4,
        image3,
        image1,
      ]);
      expect(getSortedCarouselImages([image1, image3, image2, image4])).to.be.deep.equal([
        image2,
        image4,
        image3,
        image1,
      ]);
      expect(getSortedCarouselImages([image2, image1, image3, image4])).to.be.deep.equal([
        image2,
        image4,
        image3,
        image1,
      ]);
      expect(getSortedCarouselImages([image2, image3, image1, image4])).to.be.deep.equal([
        image2,
        image4,
        image3,
        image1,
      ]);
      expect(getSortedCarouselImages([image3, image1, image2, image4])).to.be.deep.equal([
        image2,
        image4,
        image3,
        image1,
      ]);
      expect(getSortedCarouselImages([image3, image2, image1, image4])).to.be.deep.equal([
        image2,
        image4,
        image3,
        image1,
      ]);
    });
  });
});

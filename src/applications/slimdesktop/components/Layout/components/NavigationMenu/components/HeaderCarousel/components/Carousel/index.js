import React from "react";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PropTypes from "prop-types";

const propTypes = {
  banners: PropTypes.array.isRequired,
};

const Carousel = ({ banners }) => (
  <ResponsiveCarousel
    autoPlay
    infiniteLoop
    showIndicators
    stopOnHover
    axis="horizontal"
    centerMode={false}
    showArrows={false}
    showStatus={false}
    showThumbs={false}
  >
    {banners.map((banner) => (
      <div key={banner.imageAssetId}>
        <img
          alt="text"
          src={banner.imageAsset}
          style={{ border: "1px solid #f9f9f9", height: "200px", objectFit: "cover" }}
        />
      </div>
    ))}
  </ResponsiveCarousel>
);

Carousel.propTypes = propTypes;

export default React.memo(Carousel);

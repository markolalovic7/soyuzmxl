import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const propTypes = {
  banners: PropTypes.array,
  renderBanner: PropTypes.func.isRequired,
};

const defaultProps = {
  banners: [],
};

const Carousel = ({ banners, renderBanner }) => {
  if (!banners) {
    return null;
  }

  const bannersWithImageAsset = banners.filter((banner) => !!banner.imageAsset);

  if (isEmpty(bannersWithImageAsset)) {
    return null;
  }

  if (bannersWithImageAsset.length === 1) {
    return renderBanner(bannersWithImageAsset[0]);
  }

  return (
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
      {bannersWithImageAsset.map((banner) => renderBanner(banner))}
    </ResponsiveCarousel>
  );
};

Carousel.propTypes = propTypes;
Carousel.defaultProps = defaultProps;

export default Carousel;

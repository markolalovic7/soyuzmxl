import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { Carousel } from "react-responsive-carousel";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import classes from "../styles/index.module.scss";

import { BannerLinkWrapper } from "utils/banner";

const propTypes = {
  banners: PropTypes.array,
};

const defaultProps = {
  banners: [],
};

const SectionCarousel = ({ banners }) => {
  if (!banners) {
    return null;
  }

  const bannersWithImageAsset = banners.filter((banner) => !!banner.imageAsset);

  if (isEmpty(bannersWithImageAsset)) {
    return null;
  }

  const renderBanner = (banner) => (
    <BannerLinkWrapper banner={banner} className={classes["img-wrapper"]} key={banner.imageAssetId}>
      <img alt={`Banner ${banner.imageAsset}`} className={classes["img"]} src={banner.imageAsset} />
    </BannerLinkWrapper>
  );

  if (bannersWithImageAsset.length === 1) {
    return renderBanner(bannersWithImageAsset[0]);
  }

  return (
    <Carousel
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
    </Carousel>
  );
};

SectionCarousel.propTypes = propTypes;
SectionCarousel.defaultProps = defaultProps;

export default SectionCarousel;

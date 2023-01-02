import PropTypes from "prop-types";
import { BannerLinkWrapper } from "utils/banner";

import Carousel from "../../Carousel";
import classes from "../styles/index.module.scss";

const propTypes = {
  banners: PropTypes.array,
};

const defaultProps = {
  banners: [],
};

const SectionCarousel = ({ banners }) => {
  const renderBanner = (banner) => (
    <BannerLinkWrapper banner={banner} className={classes["img-wrapper"]} key={banner.imageAssetId}>
      <img alt={`Banner ${banner.imageAsset}`} className={classes["img"]} src={banner.imageAsset} />
    </BannerLinkWrapper>
  );

  return (
    <div className={classes["main-slider"]}>
      <Carousel banners={banners} renderBanner={renderBanner} />
    </div>
  );
};

SectionCarousel.propTypes = propTypes;
SectionCarousel.defaultProps = defaultProps;

export default SectionCarousel;

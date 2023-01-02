import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { useEffect } from "react";
import "applications/vanilladesktop/scss/sportradar-match-tracker-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { getCachedAssets } from "../../../../redux/reselect/assets-selectors";
import { getCmsSelector } from "../../../../redux/reselect/cms-selector";
import { loadAsset } from "../../../../redux/slices/assetSlice";
import { BannerLinkWrapper } from "../../../../utils/banner";

const propTypes = {
  carouselWidget: PropTypes.object.isRequired,
  containerClassName: PropTypes.string.isRequired,
  titleClassName: PropTypes.string.isRequired,
};
const defaultProps = {};

const CarouselBanner = ({ carouselWidget, containerClassName, titleClassName }) => {
  const dispatch = useDispatch();
  const { lineId, originId } = useSelector(getCmsSelector);
  const cachedAssets = useSelector(getCachedAssets);

  const banners = carouselWidget.banners.filter(
    (v, i, a) => a.findIndex((t) => t.imageAssetId === v.imageAssetId) === i,
  );

  useEffect(() => {
    const bannerImageIds = banners
      ?.filter((banner) => !cachedAssets[banner.imageAssetId])
      ?.map((banner) => banner.imageAssetId);

    Promise.all([
      [...new Set(bannerImageIds)].map((bannerImageId) =>
        dispatch(loadAsset({ id: bannerImageId, lineId, originId, type: "images" })),
      ),
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lineId, originId]);

  const readyToRenderCarousel = banners?.filter((banner) => !cachedAssets[banner.imageAssetId]).length === 0;

  return (
    <div className={classes[containerClassName]}>
      <div style={{ height: "150px" }}>
        {readyToRenderCarousel && (
          <Carousel
            autoPlay
            emulateTouch
            infiniteLoop
            showIndicators
            stopOnHover
            swipeable
            centerMode={false}
            showArrows={false}
            showStatus={false}
            showThumbs={false}
            transitionTime={750}
            onClickItem={null}
          >
            {[...new Set(banners)].map((banner) => (
              <BannerLinkWrapper banner={banner} className={classes["homepage-slider__item"]} key={banner.imageAssetId}>
                <img
                  alt={`Banner ${banner.imageAssetId}`}
                  src={cachedAssets[banner.imageAssetId]}
                  style={{
                    // height: "100%",
                    // maxHeight: "150px",
                    height: "150px",
                    objectFit: "cover",
                    verticalAlign: "middle",
                    width: "100%",
                  }}
                />
              </BannerLinkWrapper>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

CarouselBanner.propTypes = propTypes;
CarouselBanner.defaultProps = defaultProps;

export default CarouselBanner;

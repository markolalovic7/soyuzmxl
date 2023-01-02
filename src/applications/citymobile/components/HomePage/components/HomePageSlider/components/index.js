import classes from "applications/citymobile/scss/citymobile.module.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";

import { getCmsLayoutCityMobileDashboardCarouselImages } from "../../../../../../../redux/reselect/cms-layout-widgets";
import { getCmsSelector } from "../../../../../../../redux/reselect/cms-selector";
import { loadAsset } from "../../../../../../../redux/slices/assetSlice";
import { BannerLinkWrapper } from "../../../../../../../utils/banner";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HomePageSlider = () => {
  const bannerWidth = "100%"; // 200px
  // const bannerHeight = "130px";

  const dispatch = useDispatch();
  const { lineId, originId } = useSelector(getCmsSelector);

  const banners = useSelector(getCmsLayoutCityMobileDashboardCarouselImages);

  useEffect(() => {
    const bannerImageIds = banners?.filter((banner) => !banner.imageAsset)?.map((banner) => banner.imageAssetId);

    Promise.all([
      [...new Set(bannerImageIds)].map((bannerImageId) =>
        dispatch(loadAsset({ id: bannerImageId, lineId, originId, type: "images" })),
      ),
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lineId, originId]);

  const readyToRenderCarousel = banners?.filter((banner) => !banner.imageAsset).length === 0;

  return (
    <>
      {/* <div style={{ paddingTop: "10px" }} /> */}

      <div>
        {readyToRenderCarousel && (
          <Carousel
            autoPlay
            emulateTouch
            infiniteLoop
            stopOnHover
            swipeable
            centerMode={false}
            showArrows={false}
            showIndicators={false}
            showStatus={false}
            showThumbs={false}
            transitionTime={750}
            onClickItem={null}
          >
            {banners?.map((banner) => (
              <BannerLinkWrapper banner={banner} className={classes["homepage-slider__item"]} key={banner.imageAssetId}>
                <img
                  alt={`Banner ${banner.imageAsset}`}
                  src={banner.imageAsset}
                  style={{
                    height: "100%",
                    objectFit: "cover",
                    verticalAlign: "middle",
                    width: bannerWidth,
                  }}
                />
              </BannerLinkWrapper>
            ))}
          </Carousel>
        )}
      </div>

      <div style={{ paddingTop: "15px" }} />
    </>
  );
};

export default HomePageSlider;

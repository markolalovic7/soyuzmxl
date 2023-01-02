import { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { useDispatch, useSelector } from "react-redux";

import {
  getCmsLayoutVanillaDesktopDashboardCenterSubHeroBannerImage,
  getCmsLayoutVanillaDesktopDashboardHeroBannerImages,
  getCmsLayoutVanillaDesktopDashboardLeftSubHeroBannerImage,
  getCmsLayoutVanillaDesktopDashboardRightSubHeroBannerImage,
} from "../../../../../redux/reselect/cms-layout-widgets";
import { getCmsSelector } from "../../../../../redux/reselect/cms-selector";
import { loadAsset } from "../../../../../redux/slices/assetSlice";
import { BannerLinkWrapper } from "../../../../../utils/banner";
import NewsBanner from "../../../components/NewsBanner";

const HomePage = () => {
  const dispatch = useDispatch();
  const { lineId, originId } = useSelector(getCmsSelector);
  const banners = useSelector(getCmsLayoutVanillaDesktopDashboardHeroBannerImages);
  const leftSubHeroBanner = useSelector(getCmsLayoutVanillaDesktopDashboardLeftSubHeroBannerImage);
  const centerSubHeroBanner = useSelector(getCmsLayoutVanillaDesktopDashboardCenterSubHeroBannerImage);
  const rightSubHeroBanner = useSelector(getCmsLayoutVanillaDesktopDashboardRightSubHeroBannerImage);

  useEffect(() => {
    const imageIds = [];
    const bannerImageIds = banners?.filter((banner) => !banner.imageAsset)?.map((banner) => banner.imageAssetId);

    if (bannerImageIds) imageIds.push(...bannerImageIds);

    if (leftSubHeroBanner && !leftSubHeroBanner.imageAsset) {
      imageIds.push(leftSubHeroBanner.imageAssetId);
    }
    if (centerSubHeroBanner && !centerSubHeroBanner.imageAsset) {
      imageIds.push(centerSubHeroBanner.imageAssetId);
    }
    if (rightSubHeroBanner && !rightSubHeroBanner.imageAsset) {
      imageIds.push(rightSubHeroBanner.imageAssetId);
    }

    Promise.all([
      [...new Set(imageIds)].map((bannerImageId) =>
        dispatch(loadAsset({ id: bannerImageId, lineId, originId, type: "images" })),
      ),
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lineId, originId]);

  const readyToRenderCarousel = banners?.filter((banner) => !banner.imageAsset).length === 0;

  return (
    <main className={classes["main"]}>
      <NewsBanner />
      <div className={classes["homepage-slider"]} style={{ height: "315px", width: "1260px" }}>
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
            {banners?.map((banner) => (
              <BannerLinkWrapper banner={banner} className={classes["homepage-slider__item"]} key={banner.imageAssetId}>
                <img
                  alt={`Banner ${banner.imageAsset}`}
                  src={banner.imageAsset}
                  style={{
                    height: "100%",
                    maxHeight: "315px",
                    objectFit: "cover",
                    verticalAlign: "middle",
                    width: "1260px",
                  }}
                />
              </BannerLinkWrapper>
            ))}
          </Carousel>
        )}
      </div>
      <div className={classes["homepage-links"]}>
        <div className={classes["homepage-links__item"]} style={{ height: "286px", width: "414px" }}>
          {leftSubHeroBanner?.imageAsset && (
            <BannerLinkWrapper banner={leftSubHeroBanner} key={leftSubHeroBanner?.imageAssetId}>
              <img
                alt="sport"
                src={leftSubHeroBanner?.imageAsset}
                style={{
                  height: "286px",
                  objectFit: "cover",
                  verticalAlign: "middle",
                  width: "414px",
                }}
              />
            </BannerLinkWrapper>
          )}
        </div>

        <div className={classes["homepage-links__item"]} style={{ height: "286px", width: "414px" }}>
          {centerSubHeroBanner?.imageAsset && (
            <BannerLinkWrapper banner={centerSubHeroBanner} key={centerSubHeroBanner?.imageAssetId}>
              <img
                alt="sport"
                src={centerSubHeroBanner?.imageAsset}
                style={{
                  height: "286px",
                  objectFit: "cover",
                  verticalAlign: "middle",
                  width: "414px",
                }}
              />
            </BannerLinkWrapper>
          )}
        </div>
        <div className={classes["homepage-links__item"]} style={{ height: "286px", width: "414px" }}>
          {rightSubHeroBanner?.imageAsset && (
            <BannerLinkWrapper banner={rightSubHeroBanner} key={rightSubHeroBanner?.imageAssetId}>
              <img
                alt="sport"
                src={rightSubHeroBanner?.imageAsset}
                style={{
                  height: "286px",
                  objectFit: "cover",
                  verticalAlign: "middle",
                  width: "414px",
                }}
              />
            </BannerLinkWrapper>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;

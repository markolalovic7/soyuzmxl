import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import React, { useEffect } from "react";

// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';
// import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Animate } from "react-simple-animate";

import { getCmsLayoutCityDesktopDashboardCarouselImages } from "../../../../../../redux/reselect/cms-layout-widgets";
import { getCmsSelector } from "../../../../../../redux/reselect/cms-selector";
import { loadAsset } from "../../../../../../redux/slices/assetSlice";
import { BannerLinkWrapper } from "../../../../../../utils/banner";
import Slider from "../../../../../common/components/Slider/Slider";

const HomepageSlider = () => {
  const dispatch = useDispatch();
  const { lineId, originId } = useSelector(getCmsSelector);

  const banners = useSelector(getCmsLayoutCityDesktopDashboardCarouselImages);

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
    // <div className={classes['slider']}>
    <Animate play end={{ opacity: 1 }} start={{ opacity: 0 }}>
      <div style={{ height: "250px", padding: "0px 16px" }}>
        {readyToRenderCarousel && (
          <Slider
            options={{
              adaptiveHeight: false,
              // autoPlay: 4000,
              // pauseAutoPlayOnHover: true,
              cellAlign: "left",
              fullscreen: false,
              prevNextButtons: true,
              wrapAround: true,
            }}
          >
            {banners?.map((banner) => (
              <BannerLinkWrapper banner={banner} className={classes["homepage-slider__item"]} key={banner.imageAssetId}>
                <img
                  alt={`Banner ${banner.imageAsset}`}
                  src={banner.imageAsset}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    verticalAlign: "middle",
                    width: "300px",
                  }}
                />
              </BannerLinkWrapper>
            ))}
          </Slider>
        )}
      </div>
    </Animate>
  );
};

export default React.memo(HomepageSlider);

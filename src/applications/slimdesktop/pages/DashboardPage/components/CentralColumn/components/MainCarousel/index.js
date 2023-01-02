import cx from "classnames";
import isEmpty from "lodash.isempty";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";

import { getCmsLayoutDesktopWidgetHeaderHeroBanner } from "../../../../../../../../redux/reselect/cms-layout-widgets";
import { getCmsSelector } from "../../../../../../../../redux/reselect/cms-selector";
import { loadAsset } from "../../../../../../../../redux/slices/assetSlice";
import classes from "../../../../../../scss/slimdesktop.module.scss";

const MainCarousel = () => {
  const dispatch = useDispatch();

  const { lineId, originId } = useSelector(getCmsSelector);
  const banners = useSelector((state) => getCmsLayoutDesktopWidgetHeaderHeroBanner(state, location));

  useEffect(() => {
    const bannerImageIds = banners?.map((banner) => banner.imageAssetId);
    if (isEmpty(bannerImageIds)) {
      return;
    }

    Promise.all([
      bannerImageIds.map((bannerImageId) =>
        dispatch(loadAsset({ id: bannerImageId, lineId, originId, type: "images" })),
      ),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lineId, originId]);

  if (!banners) {
    return null;
  }

  const bannersWithImageAsset = banners.filter((banner) => !!banner.imageAsset);

  // Only load when all images are downloaded, else we get stupid effects.
  if (bannersWithImageAsset.length < banners.length || isEmpty(bannersWithImageAsset)) {
    return null;
  }

  return (
    <div className={classes["content__slider"]}>
      <div
        className={cx(
          classes["content-slider"],
          classes["slick-initialized"],
          classes["slick-slider"],
          classes["slick-dotted"],
        )}
      >
        <div className={cx(classes["slick-list"], classes["draggable"])}>
          <div
            className={classes["slick-track"]}
            // style="opacity: 1; width: 9031px; transform: translate3d(-821px, 0px, 0px);"
          >
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
                <div
                  aria-hidden="true"
                  className={classes["slick-slide slick-cloned"]}
                  data-slick-index="-1"
                  id=""
                  key={banner.imageAssetId}
                  style={{ width: "821px;" }}
                  tabIndex="-1"
                >
                  <img
                    alt="text"
                    src={banner.imageAsset}
                    style={{
                      border: "1px solid #f9f9f9",

                      height: "auto",

                      maxHeight: "300px",

                      objectFit: "cover",
                      // height: "200px",
                      width: "100%",
                    }}
                  />
                </div>
              ))}
            </ResponsiveCarousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCarousel;

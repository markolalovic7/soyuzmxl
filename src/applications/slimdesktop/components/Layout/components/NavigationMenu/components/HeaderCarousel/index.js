import isEmpty from "lodash.isempty";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getCmsLayoutDesktopWidgetHeaderHeroBanner } from "../../../../../../../../redux/reselect/cms-layout-widgets";
import { getCmsSelector } from "../../../../../../../../redux/reselect/cms-selector";
import { loadAsset } from "../../../../../../../../redux/slices/assetSlice";
import classes from "../../../../../../scss/slimdesktop.module.scss";

import Carousel from "./components/Carousel";

const HeaderCarousel = () => {
  const dispatch = useDispatch();
  const location = useLocation();
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
    <div className={classes["navigation-submenu__slider"]}>
      <div className={classes["navigation-slider"]}>
        <Carousel banners={bannersWithImageAsset} />
      </div>
    </div>
  );
};

export default React.memo(HeaderCarousel);

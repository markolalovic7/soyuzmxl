import Carousel from "applications/slimmobile/common/components/Carousel";
import isEmpty from "lodash.isempty";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getCmsLayoutMobileSlimWidgetHeaderHeroBanner } from "redux/reselect/cms-layout-widgets";
import { getCmsSelector } from "redux/reselect/cms-selector";
import { loadAsset } from "redux/slices/assetSlice";
import { BannerLinkWrapper } from "utils/banner";

import classes from "../../styles/index.module.scss";

const propTypes = {};

const MenuCarousel = () => {
  const dispatch = useDispatch();
  const { lineId, originId } = useSelector(getCmsSelector);
  const location = useLocation();

  const banners = useSelector((state) => getCmsLayoutMobileSlimWidgetHeaderHeroBanner(state, location));

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

  const renderBanner = (banner) => (
    <BannerLinkWrapper banner={banner} className={classes["img-wrapper"]} key={banner.imageAssetId}>
      <img alt={`Banner ${banner.imageAsset}`} className={classes["img"]} src={banner.imageAsset} />
    </BannerLinkWrapper>
  );

  return <Carousel banners={banners} renderBanner={renderBanner} />;
};

MenuCarousel.propTypes = propTypes;

export default MenuCarousel;

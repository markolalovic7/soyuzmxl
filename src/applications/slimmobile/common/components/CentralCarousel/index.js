import isEmpty from "lodash.isempty";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import SectionCarousel from "applications/slimmobile/common/components/SectionCarousel";
import { useLocation } from "react-router";
import { getCmsLayoutMobileSlimBannerCarouselImages } from "redux/reselect/cms-layout-widgets";
import { getCmsSelector } from "redux/reselect/cms-selector";
import { loadAsset } from "redux/slices/assetSlice";

const CentralCarousel = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { lineId, originId } = useSelector(getCmsSelector);
  const banners = useSelector((state) => getCmsLayoutMobileSlimBannerCarouselImages(state, location));

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

  return <SectionCarousel banners={banners} />;
};

export default CentralCarousel;

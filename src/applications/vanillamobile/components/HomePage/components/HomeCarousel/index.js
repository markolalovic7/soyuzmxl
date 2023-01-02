import isEmpty from "lodash.isempty";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SectionCarousel from "applications/vanillamobile/common/components/SectionCarousel";
import { getCmsLayoutMobileVanillaDashboardBannerCarouselImages } from "redux/reselect/cms-layout-widgets";
import { getCmsSelector } from "redux/reselect/cms-selector";
import { loadAsset } from "redux/slices/assetSlice";

const HomeCarousel = () => {
  const dispatch = useDispatch();
  const { lineId, originId } = useSelector(getCmsSelector);
  const banners = useSelector(getCmsLayoutMobileVanillaDashboardBannerCarouselImages);

  useEffect(() => {
    const bannerImageIds = banners?.map((banner) => banner.imageAssetId);
    if (isEmpty(bannerImageIds)) {
      return;
    }

    Promise.all([
      bannerImageIds.map((bannerImageId) =>
        dispatch(
          loadAsset({
            id: bannerImageId,
            lineId,
            originId,
            type: "images",
          }),
        ),
      ),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lineId, originId]);

  return <SectionCarousel banners={banners} />;
};

export default HomeCarousel;

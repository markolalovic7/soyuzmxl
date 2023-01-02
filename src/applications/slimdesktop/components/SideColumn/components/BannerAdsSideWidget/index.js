import * as PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCachedAssets } from "../../../../../../redux/reselect/assets-selectors";
import { getCmsSelector } from "../../../../../../redux/reselect/cms-selector";
import { loadAsset } from "../../../../../../redux/slices/assetSlice";
import { BannerLinkWrapper } from "../../../../../../utils/banner";
import classes from "../../../../scss/slimdesktop.module.scss";

const BannerAdsSideWidget = ({ widgetData }) => {
  const dispatch = useDispatch();

  const { lineId, originId } = useSelector(getCmsSelector);
  const cachedAssets = useSelector(getCachedAssets);

  useEffect(() => {
    if (!cachedAssets[widgetData.imageAssetId])
      dispatch(loadAsset({ id: widgetData.imageAssetId, lineId, originId, type: "images" }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, widgetData, lineId, originId]);

  if (!cachedAssets[widgetData.imageAssetId]) return null;

  return (
    <div className={classes["sidebar__box"]}>
      <BannerLinkWrapper banner={widgetData} key={widgetData.imageAssetId}>
        <img
          alt={`Banner ${widgetData.imageAssetId}`}
          src={cachedAssets[widgetData.imageAssetId]}
          style={{
            height: "100%",
            objectFit: "cover",
            verticalAlign: "middle",
            width: "100%",
          }}
        />
      </BannerLinkWrapper>
    </div>
  );
};

BannerAdsSideWidget.propTypes = {
  widgetData: PropTypes.object.isRequired,
};

export default React.memo(BannerAdsSideWidget);

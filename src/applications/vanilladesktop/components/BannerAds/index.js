import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import "applications/vanilladesktop/scss/sportradar-match-tracker-theme.css";
import { useDispatch, useSelector } from "react-redux";

import { getCachedAssets } from "../../../../redux/reselect/assets-selectors";
import { getCmsSelector } from "../../../../redux/reselect/cms-selector";
import { loadAsset } from "../../../../redux/slices/assetSlice";
import { BannerLinkWrapper } from "../../../../utils/banner";

const propTypes = {
  bannerAdWidget: PropTypes.object.isRequired,
  containerClassName: PropTypes.string.isRequired,
  titleClassName: PropTypes.string.isRequired,
};
const defaultProps = {};

const BannerAds = ({ bannerAdWidget, containerClassName, titleClassName }) => {
  const dispatch = useDispatch();
  const { lineId, originId } = useSelector(getCmsSelector);
  const cachedAssets = useSelector(getCachedAssets);

  useEffect(() => {
    if (!cachedAssets[bannerAdWidget.imageAssetId])
      dispatch(loadAsset({ id: bannerAdWidget.imageAssetId, lineId, originId, type: "images" }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, bannerAdWidget, lineId, originId]);

  return (
    <div className={classes[containerClassName]}>
      <h3 className={classes[titleClassName]}>{bannerAdWidget.description}</h3>
      {cachedAssets[bannerAdWidget.imageAssetId] && (
        <BannerLinkWrapper
          banner={bannerAdWidget}
          className={classes["homepage-slider__item"]}
          key={bannerAdWidget.imageAssetId}
        >
          <img
            alt={`Banner ${bannerAdWidget.imageAssetId}`}
            src={cachedAssets[bannerAdWidget.imageAssetId]}
            style={{
              height: "100%",
              objectFit: "cover",
              verticalAlign: "middle",
              width: "100%",
            }}
          />
        </BannerLinkWrapper>
      )}
    </div>
  );
};

BannerAds.propTypes = propTypes;
BannerAds.defaultProps = defaultProps;

export default React.memo(BannerAds);

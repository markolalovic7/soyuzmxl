import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCmsSelector, getCmsConfigBrandLogos } from "redux/reselect/cms-selector";
import { loadAsset } from "redux/slices/assetSlice";

export function useAssets(dispatch) {
  const { lineId, originId } = useSelector(getCmsSelector);
  const { brandIconAssetId, brandLogoAssetId } = useSelector(getCmsConfigBrandLogos);

  useEffect(() => {
    if (brandIconAssetId && brandLogoAssetId && lineId && originId) {
      dispatch(loadAsset({ id: brandIconAssetId, lineId, originId, type: "icons" }));
      dispatch(loadAsset({ id: brandLogoAssetId, lineId, originId, type: "logos" }));
    }
  }, [dispatch, brandIconAssetId, brandLogoAssetId, lineId, originId]);
}

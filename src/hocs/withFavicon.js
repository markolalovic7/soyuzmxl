import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { getCachedAssets } from "redux/reselect/assets-selectors";
import { getCmsConfigBrandLogos } from "redux/reselect/cms-selector";

const withFavicon = (Component) => (props) => {
  const { brandIconAssetId } = useSelector(getCmsConfigBrandLogos);
  const assets = useSelector(getCachedAssets);
  const icon = assets[brandIconAssetId];

  return (
    <>
      <Helmet>
        <link href={icon} rel="icon" />
      </Helmet>
      <Component {...props} />
    </>
  );
};

export default withFavicon;

import { BANNER_ITEM_TYPE_EXTERNAL_LINK, BANNER_ITEM_TYPE_INTERNAL_LINK } from "constants/banner-types";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export function getBannerLinkConfig({ mode, url }) {
  return (
    {
      [BANNER_ITEM_TYPE_EXTERNAL_LINK]: {
        rel: "noopener noreferrer",
        target: "_blank",
        to: { pathname: url },
      },
      [BANNER_ITEM_TYPE_INTERNAL_LINK]: {
        to: url,
      },
    }[mode] ?? {
      to: url,
    }
  );
}

const propTypes = {
  banner: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};
export const BannerLinkWrapper = ({ banner, children, className }) => {
  if (isEmpty(banner.url)) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Link {...getBannerLinkConfig(banner)} className={className} key={banner.imageAssetId}>
      {children}
    </Link>
  );
};

BannerLinkWrapper.propTypes = propTypes;

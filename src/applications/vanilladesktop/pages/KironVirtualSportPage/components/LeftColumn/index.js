import SportBanner from "applications/vanilladesktop/components/VirtualSportsMenuBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getCmsConfigIframeMode, getCmsConfigKironVirtual } from "../../../../../../redux/reselect/cms-selector";
import { getKironSportList } from "../../../../../../utils/kiron-virtual-utils";

const LeftColumn = ({ feedCode }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const cmsConfigKironVirtual = useSelector(getCmsConfigKironVirtual);

  const {
    data: { feedCodes },
  } = cmsConfigKironVirtual || { data: {} };

  useEffect(() => {
    if (!feedCode && feedCodes.length > 0) {
      const newActiveFeedCode = getKironSportList(t).filter((b) => feedCodes.includes(b.code))[0].code;
      history.push(`/krvirtual/${newActiveFeedCode}`);
    }
  }, [feedCode, feedCodes]);

  return (
    <div className={cx(classes["left-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={cx(classes["banners"], classes["banner-racing"])}>
        {getKironSportList(t)
          .filter((b) => feedCodes.includes(b.code))
          .map(({ code, label }, index) => (
            <SportBanner code={code} isNow={feedCode === code} key={index} label={label} prefix="krvirtual" />
          ))}
      </div>
    </div>
  );
};

const propTypes = {
  feedCode: PropTypes.string,
};
const defaultProps = {
  feedCode: undefined,
};

LeftColumn.propTypes = propTypes;
LeftColumn.defaultProps = defaultProps;

export default LeftColumn;

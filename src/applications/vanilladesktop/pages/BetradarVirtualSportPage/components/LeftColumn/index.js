import SportBanner from "applications/vanilladesktop/components/VirtualSportsMenuBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getCmsConfigBetradarVirtual, getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import { getBetradarVirtualSportList } from "../../../../../../utils/betradar-virtual-utils";

const LeftColumn = ({ feedCode }) => {
  const history = useHistory();
  const { t } = useTranslation();

  const cmsConfigBetradarVirtual = useSelector(getCmsConfigBetradarVirtual);

  const {
    data: { feedCodes },
  } = cmsConfigBetradarVirtual || { data: {} };

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  useEffect(() => {
    if (!feedCode && feedCodes.length > 0) {
      const newActiveFeedCode = getBetradarVirtualSportList(t).filter((b) => feedCodes.includes(b.code))[0].code;
      history.push(`/brvirtual/${newActiveFeedCode}`);
    }
  }, [feedCode, feedCodes]);

  return (
    <div className={cx(classes["left-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={cx(classes["banners"])}>
        {getBetradarVirtualSportList(t)
          .filter((b) => feedCodes.includes(b.code))
          .map(({ code, label }, index) => (
            <SportBanner code={code} isNow={feedCode === code} key={index} label={label} prefix="brvirtual" />
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

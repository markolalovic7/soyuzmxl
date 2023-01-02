import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getCmsConfigBetradarVirtual, getCmsConfigKironVirtual } from "../../../../../redux/reselect/cms-selector";
import { getBetradarVirtualSportList } from "../../../../../utils/betradar-virtual-utils";
import { getKironSportList } from "../../../../../utils/kiron-virtual-utils";
import SportBanner from "../../VirtualSportsMenuBanner";

// This is a duplicate of the code under KironSportsPage--> Left Column...

const getFeedCodes = (cmsConfigVirtual) => {
  const {
    data: { feedCodes },
  } = cmsConfigVirtual || { data: {} };

  return feedCodes;
};

const BannersPanel = () => {
  const { t } = useTranslation();
  const cmsConfigKironVirtual = useSelector(getCmsConfigKironVirtual);
  const cmsConfigBetradarVirtual = useSelector(getCmsConfigBetradarVirtual);

  const kironFeedCodes = getFeedCodes(cmsConfigKironVirtual);
  const brFeedCodes = getFeedCodes(cmsConfigBetradarVirtual);

  return (
    <>
      <div className={cx(classes["banners"], classes["banner-racing"])}>
        {getBetradarVirtualSportList(t)
          .filter((b) => brFeedCodes?.includes(b.code))
          .map(({ code, label }, index) => (
            <SportBanner code={code} isNow={false} key={index} label={label} prefix="brvirtual" />
          ))}
      </div>
      <div className={cx(classes["banners"], classes["banner-racing"])}>
        {getKironSportList(t)
          .filter((b) => kironFeedCodes?.includes(b.code))
          .map(({ code, label }, index) => (
            <SportBanner code={code} isNow={false} key={index} label={label} prefix="krvirtual" />
          ))}
      </div>
    </>
  );
};

export default BannersPanel;

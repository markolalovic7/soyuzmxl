import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import React from "react";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../../redux/reselect/cms-selector";
import AsianMenu from "../../../../../components/AsianMenu";

const LeftColumnMenus = () => {
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  return (
    <div className={cx(classes["left-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["left-section__content"]}>
        <div className={classes["left-section__item"]}>
          <AsianMenu />
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeftColumnMenus);

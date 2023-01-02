import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import CentralColumnWidgets from "../../../../components/CentralColumnWidgets";

import CentralColumnCoupon from "./CentralColumnCoupon";

const CentralColumn = () => {
  const { searchPhrase } = useParams();

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["central-section__content"]}>
        <CentralColumnWidgets />
        <h3 className={classes["search-header__title"]}>{`Search Results: ${searchPhrase}`}</h3>
        <div className={classes["central-section__container"]}>
          <CentralColumnCoupon searchPhrase={searchPhrase} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(CentralColumn);

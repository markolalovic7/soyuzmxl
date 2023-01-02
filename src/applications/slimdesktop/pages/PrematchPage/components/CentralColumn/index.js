import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getAuthIsSplitModePreferred } from "../../../../../../redux/reselect/auth-selector";
import SportNavigationHeader from "../../../../components/SportNavigationHeader";

import CompactPrematchBody from "./components/CompactPrematchBody";
import RegularPrematchBody from "./components/RegularPrematchBody";

const CentralColumn = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const isSplitModePreferred = useSelector(getAuthIsSplitModePreferred);

  return (
    <div className={cx(classes["content__main"], { [classes["content__main_no-scroll"]]: isSplitModePreferred })}>
      <SportNavigationHeader />
      {isSplitModePreferred ? <CompactPrematchBody /> : <RegularPrematchBody />}
    </div>
  );
};
export default React.memo(CentralColumn);

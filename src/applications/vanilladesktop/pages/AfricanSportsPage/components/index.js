import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { hasDesktopLeftColumn, hasDesktopRightColumn } from "../../../../../redux/reselect/cms-layout-widgets";
import LeftColumnMenus from "../../../components/LeftColumnMenus";
import RightColumn from "../../../components/RightColumn";

import CentralColumn from "./CentralColumn";

const AfricanSportsPage = () => {
  const location = useLocation();
  const hasLeftColumn = useSelector((state) => hasDesktopLeftColumn(state, location));
  const hasRightColumn = useSelector((state) => hasDesktopRightColumn(state, location));

  return (
    <main className={cx(classes["main"], classes["continental-page"], classes["continental-sports-page"])}>
      <NewsBanner />
      <div className={classes["main__container"]}>
        <div className={classes["main__sports"]}>
          {hasLeftColumn && <LeftColumnMenus />}
          <CentralColumn />
          {hasRightColumn && <RightColumn />}
        </div>
      </div>
    </main>
  );
};

export default React.memo(AfricanSportsPage);

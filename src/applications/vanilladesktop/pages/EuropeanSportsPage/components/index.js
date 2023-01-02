import LeftColumnMenus from "applications/vanilladesktop/components/LeftColumnMenus/components";
import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { hasDesktopLeftColumn, hasDesktopRightColumn } from "../../../../../redux/reselect/cms-layout-widgets";
import RightColumn from "../../../components/RightColumn";

import CentralColumn from "./CentralColumn";

const EuropeanSportsPage = () => {
  const location = useLocation();
  const hasLeftColumn = useSelector((state) => hasDesktopLeftColumn(state, location));
  const hasRightColumn = useSelector((state) => hasDesktopRightColumn(state, location));

  return (
    <main className={classes["main"]}>
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

export default React.memo(EuropeanSportsPage);

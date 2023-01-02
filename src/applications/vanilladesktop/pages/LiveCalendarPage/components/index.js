import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import React from "react";
import { useLocation } from "react-router";

import CentralColumn from "./CentralColumn";

const LiveCalendarPage = () => {
  const location = useLocation();

  return (
    <main className={classes["main"]}>
      <NewsBanner />
      <div className={classes["main__container"]}>
        <div className={classes["main__sports"]}>
          <CentralColumn />
        </div>
      </div>
    </main>
  );
};

export default React.memo(LiveCalendarPage);

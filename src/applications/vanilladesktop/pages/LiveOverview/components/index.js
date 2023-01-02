import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useState } from "react";

import LiveNavigation from "../../../components/LiveNavigation";
import RightColumn from "../../../components/RightColumn";

import CentralColumn from "./CentralColumn";
import SportsFilterMenu from "./SportsFilterMenu";

const LiveOverview = () => {
  const [activeSport, setActiveSport] = useState("ALL");

  return (
    <main className={classes["main"]}>
      <NewsBanner />

      <div className={cx(classes["main__container"])}>
        {/* <div className={cx(classes["main__container"], classes["main__container_live"])}> */}
        <div className={classes["main__sports"]}>
          <div className={classes["main__views"]}>
            <LiveNavigation />
            <div className={classes["main__views-container"]}>
              <SportsFilterMenu activeSport={activeSport} setActiveSport={setActiveSport} />
              <CentralColumn activeSport={activeSport} />
            </div>
          </div>
          <RightColumn />
        </div>
      </div>
    </main>
  );
};

export default LiveOverview;

import BannersPanel from "applications/vanilladesktop/components/BannersPanel";
import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getCmsLayoutDesktopWidgetsRightColumn } from "../../../../../redux/reselect/cms-layout-widgets";
import { getCmsConfigIframeMode } from "../../../../../redux/reselect/cms-selector";
import JackpotBetslip from "../../../components/JackpotBetslip/components";

import CentralColumn from "./CentralColumn";
import LeftColumn from "./LeftColumn";

const JackpotPage = () => {
  const location = useLocation();

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const widgets = useSelector((state) => getCmsLayoutDesktopWidgetsRightColumn(state, location));

  const [activeJackpotId, setActiveJackpotId] = useState();

  return (
    <main className={classes["main"]}>
      <div className={classes["compact-page"]}>
        <NewsBanner />
        <div className={classes["main__container"]}>
          <div className={classes["main__sports"]}>
            <LeftColumn activeJackpotId={activeJackpotId} setActiveJackpotId={setActiveJackpotId} />
            <CentralColumn activeJackpotId={activeJackpotId} />
            <div className={cx(classes["right-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
              <div className={classes["right-section__container"]}>
                <JackpotBetslip jackpotId={activeJackpotId} />
                {widgets?.map((widget) => {
                  if (widget.cmsWidgetType === "BETSLIP") {
                    return null; // Ignore for Betslips, we use a "native" betslip for jackpots
                  }

                  return null;
                })}

                {/* TODO  For CMS implementation */}
                <BannersPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JackpotPage;

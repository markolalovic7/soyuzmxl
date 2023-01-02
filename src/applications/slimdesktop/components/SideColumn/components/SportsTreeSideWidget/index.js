import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useHistory, useLocation, useParams } from "react-router";

import {
  getPatternAsianSports,
  getPatternAsianSportsEventDetail,
  getPatternAsianSportsEventPathDetail,
  getPatternContentPage,
  getPatternHome,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternLiveEvent,
  getPatternLiveEventDetail,
  getPatternLiveEventPathAndEventDetail,
  getPatternLiveEventPathDetail,
  getPatternLiveMultiview,
  getPatternLiveSportDetail,
  getPatternPrematch,
  getPatternPrematchEvent,
  getPatternPrematchEventDetail,
  getPatternPrematchMain,
  getPatternResults,
  getPatternSearch,
  getPatternSearchResults,
  getPatternSports,
} from "../../../../../../utils/route-patterns";
import classes from "../../../../scss/slimdesktop.module.scss";

import Tree from "./components/Tree";

const livePatternGroup = [
  getPatternHome(),
  getPatternLiveSportDetail(),
  getPatternLive(),
  getPatternLiveEvent(),
  getPatternLiveEventDetail(),
  getPatternLiveEventPathDetail(),
  getPatternLiveEventPathAndEventDetail(),
  getPatternLiveMultiview(),
];

const prematchPatternGroup = [
  getPatternHome(),
  getPatternAsianSports(),
  getPatternAsianSportsEventPathDetail(),
  getPatternAsianSportsEventDetail(),
  getPatternSports(),
  getPatternPrematch(),
  getPatternPrematchMain(),
  getPatternPrematchEvent(),
  getPatternPrematchEventDetail(),
  getPatternSearchResults(),
  getPatternSearch(),
  getPatternResults(),
  getPatternLiveCalendar(),
  getPatternContentPage(),
];

const SportsTreeSideWidget = ({ widgetData }) => {
  const history = useHistory();
  const location = useLocation();

  const { t } = useTranslation();

  const { eventId: eventIdStr, eventPathId: eventPathIdsStr } = useParams();

  const eventPathIds = eventPathIdsStr ? eventPathIdsStr.split(",").map((x) => Number(x)) : undefined;
  const activeEventId = eventIdStr ? parseInt(eventIdStr, 10) : undefined;

  const [activeTab, setActiveTab] = useState("PREMATCH"); // PREMATCH vs LIVE

  const isLiveSelected = activeTab === "LIVE";

  const isPrematchPage = !!prematchPatternGroup.find((pattern) =>
    matchPath(location.pathname, { exact: true, path: pattern }),
  );
  const isLivePage = !!livePatternGroup.find((pattern) => matchPath(location.pathname, { exact: true, path: pattern }));

  //  useEffect to switch the current tab to the only available one (where applicable)
  useEffect(() => {
    if (isPrematchPage && !isLivePage) {
      setActiveTab("PREMATCH");
    }
    if (isLivePage && !isPrematchPage) {
      setActiveTab("LIVE");
    }
  }, [location]);

  return (
    <div className={classes["sidebar__box"]}>
      <div className={classes["sidebar-tabs"]}>
        {isPrematchPage && isLivePage && (
          <div className={classes["sidebar-tabs__controls"]}>
            {isLivePage && (
              <div
                className={cx(
                  classes["sidebar-tabs__control"],
                  { [classes["sidebar-tabs__control_active"]]: activeTab === "LIVE" },
                  classes["js-sidebar-tab"],
                )}
                onClick={() => setActiveTab("LIVE")}
              >
                {t("live")}
              </div>
            )}
            {isPrematchPage && (
              <div
                className={cx(
                  classes["sidebar-tabs__control"],
                  { [classes["sidebar-tabs__control_active"]]: activeTab === "PREMATCH" },
                  classes["js-sidebar-tab"],
                )}
                onClick={() => setActiveTab("PREMATCH")}
              >
                {t("sports")}
              </div>
            )}
          </div>
        )}
        {((isPrematchPage && !isLivePage) || (!isPrematchPage && isLivePage)) && (
          <div className={classes["box-title"]}>{isPrematchPage ? t("sports") : t("live")}</div>
        )}
        <div className={classes["sidebar-tabs__content"]}>
          <div
            className={cx(
              classes["sidebar-tabs__tab"],
              classes["sidebar-tabs__tab_active"],
              classes["js-sidebar-tab-content"],
            )}
            id="tab-1"
          >
            <Tree
              activeEventId={activeEventId}
              eventPathIds={eventPathIds}
              isLive={isLiveSelected}
              isLivePage={isLivePage}
              isPrematchPage={isPrematchPage}
              widgetData={widgetData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

SportsTreeSideWidget.propTypes = {
  widgetData: PropTypes.object.isRequired,
};

export default React.memo(SportsTreeSideWidget);

import BetSlipColumn from "applications/ollehdesktop/components/BetSlipColumn";
import SidebarModeSelector from "applications/ollehdesktop/components/SidebarModeSelector";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import isEmpty from "lodash.isempty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

import { useGetMatchStatuses } from "../../../../../hooks/matchstatus-hooks";
import { getLiveEuropeanDashboardData } from "../../../../../redux/reselect/live-selector";
import { getPatternBetradarVirtual, getPatternLiveCalendar } from "../../../../../utils/route-patterns";
import { getSortedLiveMatches } from "../../../../vanillamobile/components/LivePage/utils";
import { SIDEBAR_LIVE_MODE } from "../../../components/SidebarModeSelector/constants";

import LiveEventDetail from "./LiveEventDetail";
import LiveSportBar from "./LiveSportBar/components";

const LivePage = () => {
  const { eventId } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [listOfFavouriteMarkets, setListOfFavouriteMarkets] = useState([]);

  const liveDataEuropeanDashboard = useSelector(getLiveEuropeanDashboardData);
  useGetMatchStatuses(dispatch);

  const onSelectMatchHandler = (matchId) => {
    history.push(`/live/event/${matchId}`);
  };

  useEffect(() => {
    if (!eventId && liveDataEuropeanDashboard) {
      const sports = Object.keys(liveDataEuropeanDashboard).filter(
        (sport) => !isEmpty(liveDataEuropeanDashboard[sport]),
      );
      if (sports.length > 0) {
        const matches = getSortedLiveMatches(Object.values(liveDataEuropeanDashboard[sports[0]]));
        if (matches.length > 0) {
          onSelectMatchHandler(matches[0].eventId);
        }
      }
    }
  }, [eventId, liveDataEuropeanDashboard]);

  useEffect(() => {
    if (localStorage.getItem("favouriteMarketGroups")) {
      setListOfFavouriteMarkets(localStorage.getItem("favouriteMarketGroups").split(","));
    }
  }, []);

  return (
    <main className={`${classes["main"]} ${classes["live-page"]}`}>
      <div className={classes["left__column"]}>
        <div className={classes["left__column-live"]}>
          <SidebarModeSelector sideBarMode={SIDEBAR_LIVE_MODE} />
          <div className={classes["left__column-header-small"]}>
            <h6>{t("sports")}</h6>
          </div>
          <LiveSportBar eventId={eventId ? Number(eventId) : undefined} onSelectMatch={onSelectMatchHandler} />
        </div>
      </div>
      <div className={classes["main__column"]}>
        <div className={classes["main__column-top"]}>
          <div className={classes["top__nav"]}>
            <div className={classes["top__nav-icon"]}>
              <i className={classes["fas fa-angle-double-left"]} />
            </div>
          </div>
          <div className={classes["top__nav"]}>
            <ul className={classes["top__nav-right"]}>
              <li>
                <Link className={classes["active"]} to={getPatternBetradarVirtual()}>
                  {t("virtual_sports")}
                </Link>
              </li>
              <li>
                <Link to={getPatternLiveCalendar()}>{t("live_calendar")}</Link>
              </li>
            </ul>
          </div>
        </div>

        {eventId && (
          <LiveEventDetail
            eventId={Number(eventId)}
            listOfFavouriteMarkets={listOfFavouriteMarkets}
            setListOfFavouriteMarkets={setListOfFavouriteMarkets}
          />
        )}
      </div>
      <BetSlipColumn />
    </main>
  );
};

export default LivePage;

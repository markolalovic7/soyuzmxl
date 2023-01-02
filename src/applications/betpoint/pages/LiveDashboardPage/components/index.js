import classes from "applications/betpoint/scss/betpoint.module.scss";
import cx from "classnames";
import isEmpty from "lodash.isempty";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { getSportsSelector } from "../../../../../redux/reselect/sport-selector";
import { useLiveData } from "../../../../common/hooks/useLiveData";
import LiveMatchSummary from "../../../components/LiveMatchSummary";

function descComparator(a, b) {
  const descA = a.opADesc;
  const descB = b.opADesc;

  if (descA < descB) {
    return -1;
  }
  if (descA > descB) {
    return 1;
  }

  return 0;
}

function leagueComparator(a, b) {
  const descA = a.epDesc;
  const descB = b.epDesc;

  if (descA < descB) {
    return -1;
  }
  if (descA > descB) {
    return 1;
  }

  return descComparator(a, b); // sort under the same league
}

const LiveDashboardPage = () => {
  const { sportCode } = useParams();

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const sports = useSelector(getSportsSelector);
  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  return (
    <div className={classes["content"]}>
      <div className={classes["content__container"]}>
        <div className={classes["spoilers"]}>
          {!isEmpty(europeanDashboardLiveData) &&
            Object.entries(europeanDashboardLiveData).map((sportEntry) => {
              const sport = sportEntry[0];
              const sportMatches = sportEntry[1];

              if (sport !== sportCode) {
                return null; // skip if filtered out by the sports panel selections
              }
              const sortedMatches = Object.values(sportMatches).sort(leagueComparator);
              let previousEventPathDescription = null;

              return (
                <div className={cx(classes["spoiler"], classes[`spoiler_${sport.toLowerCase()}`])} key={sport}>
                  <div className={classes["spoiler__header"]}>
                    <div className={classes["spoiler__header-icon"]}>
                      <i className={cx(classes["qicon-default"], classes[`qicon-${sport.toLowerCase()}`])} />
                    </div>
                    <div className={classes["spoiler__title"]}>
                      {sports && sports[sportCode] ? sports[sportCode].description : ""}
                    </div>
                    {/* <div className={classes["spoiler__arrow"]}> */}
                    {/*  <FontAwesomeIcon icon={faChevronDown} /> */}
                    {/* </div> */}
                  </div>

                  {sortedMatches.map((match) => {
                    const eventPathDescription = match.epDesc;
                    const showEventPathHeader = previousEventPathDescription !== eventPathDescription;
                    previousEventPathDescription = eventPathDescription; // reset

                    return (
                      <LiveMatchSummary
                        eventPathDescription={eventPathDescription}
                        key={match.eventId}
                        match={match}
                        showEventPathHeader={showEventPathHeader}
                      />
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(LiveDashboardPage);

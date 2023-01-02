import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getLiveEuropeanDashboardData } from "../../../../../../../redux/reselect/live-selector";
import { getSportsSelector } from "../../../../../../../redux/reselect/sport-selector";
import { useLiveData } from "../../../../../../common/hooks/useLiveData";
import { getSortedLiveMatches } from "../../../../../../vanillamobile/components/LivePage/utils";
import CalendarIcon from "../../../../../img/icons/calendar.svg";
import SportIcon from "../../../../../img/icons/sports.svg";
import classes from "../../../../../scss/ollehdesktop.module.scss";

import SideBarExpandingSport from "./SidebarExpandingSport";

const LiveSportBar = ({ eventId, onSelectMatch }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const liveDataEuropeanDashboard = useSelector(getLiveEuropeanDashboardData);
  const sports = useSelector(getSportsSelector);
  const [tabletExpandedSideBarSport, setTabletExpandedSideBarSport] = useState("");

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  const handleSideBarSportExpanding = useCallback(
    (sportName) =>
      sportName === tabletExpandedSideBarSport
        ? setTabletExpandedSideBarSport("")
        : setTabletExpandedSideBarSport(sportName),
    [tabletExpandedSideBarSport],
  );

  const sportBarData = React.useMemo(() => {
    if (liveDataEuropeanDashboard) {
      return Object.keys(liveDataEuropeanDashboard)
        .filter((sport) => !isEmpty(liveDataEuropeanDashboard[sport]))
        .map((sport) => {
          const sportDescription = sports[sport]?.description;
          const matches = getSortedLiveMatches(Object.values(liveDataEuropeanDashboard[sport]));

          const countryHash = {};

          matches.forEach((m) => {
            const match = {
              active: m.eventId === eventId,
              cMin: m.cMin,
              cSec: m.cSec,
              cStatus: m.cStatus,
              cType: m.cType,
              id: m.eventId,
              part: m.cPeriod,
              result: m.hScore && m.aScore ? `${m.hScore}:${m.aScore}` : "0:0",
              teamLeft: m.opADesc,
              teamRight: m.opBDesc,
            };

            countryHash[m.countryId] = countryHash[m.countryId]
              ? { ...{ ...countryHash[m.countryId] }, matches: [...countryHash[m.countryId].matches, match] }
              : { countryCode: m.country, countryName: m.epDesc.split("/")[0].trim(), matches: [match] };
          });

          return {
            bgClassName: sport.toLowerCase(),
            count: matches.length,
            countries: Object.values(countryHash),
            label: sportDescription,
          };
        });
    }

    return [];
  }, [eventId, liveDataEuropeanDashboard]);

  return (
    <div className={classes["left__column-lives"]}>
      <div className={classes["live__item--small"]}>
        <img alt="" src={SportIcon} />
        <span className={classes["live__item-title"]}>{t("top_leagues_page")}</span>
      </div>
      <div className={classes["live__item--small"]}>
        <img alt="" src={CalendarIcon} />
        <span className={classes["live__item-title"]}>{t("todays_events")}</span>
      </div>
      {sportBarData.map((sport) => (
        <SideBarExpandingSport
          bgClassName={sport.bgClassName}
          count={sport.count}
          countries={sport.countries}
          isTabletVersionExpanded={tabletExpandedSideBarSport === sport.label}
          key={sport.label}
          label={sport.label}
          onExpand={handleSideBarSportExpanding}
          onSelectMatch={onSelectMatch}
        />
      ))}
    </div>
  );
};

LiveSportBar.propTypes = {
  eventId: PropTypes.number,
  onSelectMatch: PropTypes.func.isRequired,
};

LiveSportBar.defaultProps = {
  eventId: undefined,
};

export default React.memo(LiveSportBar);

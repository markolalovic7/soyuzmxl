import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../../../../redux/reselect/auth-selector";
import { getCmsConfigSportsBook } from "../../../../../../../../redux/reselect/cms-selector";
import classes from "../../../../../../scss/slimdesktop.module.scss";

import MatchInfo from "./components/MatchInfo";

const propTypes = {
  events: PropTypes.array.isRequired,
  expandedDetails: PropTypes.array,
  expandedMatchId: PropTypes.number,
  handleMatchExpand: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  isDetailedLoading: PropTypes.bool.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {
  expandedDetails: null,
  expandedMatchId: null,
};

const SportsGroup = ({
  events,
  expandedDetails,
  expandedMatchId,
  handleMatchExpand,
  heading,
  isDetailedLoading,
  sportCode,
}) => {
  const language = useSelector(getAuthLanguage);
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook);
  const {
    data: { betradarStatsOn, betradarStatsURL },
  } = cmsConfigSportsBook || { data: {} };
  const statisticsUrl = (betradarStatsOn && betradarStatsURL) || "";

  return (
    <>
      <div className={classes["title-1"]}>{heading}</div>
      <div claSportssName={classes["content-col__cards"]}>
        {events.map((event) => (
          <MatchInfo
            awayResult={event.awayScore}
            betradarStatsURL={statisticsUrl}
            expandedDetails={expandedMatchId === event.id ? expandedDetails : null}
            feedCode={event.feedCode}
            homeResult={event.homeScore}
            id={event.id}
            isDetailedLoading={isDetailedLoading}
            isExpanded={expandedMatchId === event.id}
            key={event.id}
            language={language}
            periods={event.periods}
            players={event.players}
            result={event.result}
            sportCode={sportCode}
            time={event.time}
            onExpand={handleMatchExpand}
          />
        ))}
      </div>
    </>
  );
};

SportsGroup.propTypes = propTypes;
SportsGroup.defaultProps = defaultProps;

export default React.memo(SportsGroup);

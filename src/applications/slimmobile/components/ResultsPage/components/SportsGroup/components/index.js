import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getCmsConfigSportsBook } from "redux/reselect/cms-selector";

import MatchInfo from "../../MatchInfo";

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
      <div className={classes["main__title"]}>
        <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`])} />
        <h1>{heading}</h1>
      </div>
      {events.map((event) => (
        <MatchInfo
          betradarStatsURL={statisticsUrl}
          expandedDetails={expandedMatchId === event.id ? expandedDetails : null}
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
    </>
  );
};

SportsGroup.propTypes = propTypes;
SportsGroup.defaultProps = defaultProps;

export default SportsGroup;

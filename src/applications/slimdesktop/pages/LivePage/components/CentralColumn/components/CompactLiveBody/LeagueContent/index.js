import * as PropTypes from "prop-types";
import React from "react";

import classes from "../../../../../../../scss/slimdesktop.module.scss";
import MatchSummary from "../MatchSummary";

const LeagueContent = ({ isAllowInlineDetailExpansion, leagueDescription, leagueMatches, sportCode }) => (
  <div className={classes["live-section"]} key={leagueDescription}>
    {leagueDescription && <div className={classes["live-section__title"]}>{leagueDescription}</div>}

    {leagueMatches.map((match) => (
      <MatchSummary
        isAllowInlineDetailExpansion={isAllowInlineDetailExpansion}
        key={match.eventId}
        match={match}
        sportCode={sportCode}
      />
    ))}
  </div>
);

LeagueContent.propTypes = {
  isAllowInlineDetailExpansion: PropTypes.bool,
  leagueDescription: PropTypes.string.isRequired,
  leagueMatches: PropTypes.array.isRequired,
  sportCode: PropTypes.string.isRequired,
};

LeagueContent.defaultProps = {
  isAllowInlineDetailExpansion: false,
};

export default React.memo(LeagueContent);

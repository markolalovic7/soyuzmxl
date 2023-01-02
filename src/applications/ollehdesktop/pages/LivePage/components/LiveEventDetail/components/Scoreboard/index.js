import PropTypes from "prop-types";
import React from "react";

import FootballScoreboard from "./components/FootballScoreboard";
import GenericSportScoreboard from "./components/GenericSportScoreboard";

const Scoreboard = ({
  aPeriodScores,
  aScore,
  cMin,
  cPeriod,
  cSec,
  cStatus,
  cType,
  countryDesc,
  eventId,
  hPeriodScores,
  hScore,
  icons,
  isOpAActive,
  isOpBActive,
  isPaused,
  leagueDesc,
  opADesc,
  opBDesc,
  sportCode,
}) => {
  const isFootball = sportCode === "FOOT";

  if (isFootball) {
    return (
      <FootballScoreboard
        aPeriodScores={aPeriodScores}
        aScore={aScore}
        cMin={cMin}
        cPeriod={cPeriod}
        cSec={cSec}
        cStatus={cStatus}
        cType={cType}
        countryDesc={countryDesc}
        eventId={eventId}
        hPeriodScores={hPeriodScores}
        hScore={hScore}
        icons={icons}
        isOpAActive={isOpAActive}
        isOpBActive={isOpBActive}
        isPaused={isPaused}
        leagueDesc={leagueDesc}
        opADesc={opADesc}
        opBDesc={opBDesc}
        sportCode={sportCode}
      />
    );
  }

  return (
    <GenericSportScoreboard
      aPeriodScores={aPeriodScores}
      aScore={aScore}
      cMin={cMin}
      cPeriod={cPeriod}
      cSec={cSec}
      cStatus={cStatus}
      cType={cType}
      countryDesc={countryDesc}
      eventId={eventId}
      hPeriodScores={hPeriodScores}
      hScore={hScore}
      icons={icons}
      isOpAActive={isOpAActive}
      isOpBActive={isOpBActive}
      isPaused={isPaused}
      leagueDesc={leagueDesc}
      opADesc={opADesc}
      opBDesc={opBDesc}
      sportCode={sportCode}
    />
  );
};

const propTypes = {
  aPeriodScores: PropTypes.array.isRequired,
  aScore: PropTypes.number.isRequired,
  cMin: PropTypes.number.isRequired,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.number.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  countryDesc: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  hPeriodScores: PropTypes.array.isRequired,
  hScore: PropTypes.number.isRequired,
  icons: PropTypes.object,
  isOpAActive: PropTypes.bool.isRequired,
  isOpBActive: PropTypes.bool.isRequired,
  isPaused: PropTypes.bool.isRequired,
  leagueDesc: PropTypes.string.isRequired,
  opADesc: PropTypes.string.isRequired,
  opBDesc: PropTypes.string.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {
  icons: undefined,
};

Scoreboard.propTypes = propTypes;
Scoreboard.defaultProps = defaultProps;

export default React.memo(Scoreboard);

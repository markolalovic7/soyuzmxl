import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useHistory } from "react-router";

import MatchHeader from "./MatchHeader";
import MatchMarket from "./MatchMarket";
import MatchTeamScores from "./MatchTeamScores";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getHrefLiveEventDetail } from "utils/route-href";

const propTypes = {
  aScore: PropTypes.string,
  cMin: PropTypes.number.isRequired,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.number.isRequired,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  epDesc: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  feedCode: PropTypes.string,
  hScore: PropTypes.string,
  mCount: PropTypes.number.isRequired,
  markets: PropTypes.object,
  opADesc: PropTypes.string.isRequired,
  opBDesc: PropTypes.string.isRequired,
  pScores: PropTypes.array.isRequired,
};
const defaultProps = {
  aScore: undefined,
  feedCode: undefined,
  hScore: undefined,
  markets: undefined,
};

const LiveEuropeanMatch = ({
  aScore,
  cMin,
  cPeriod,
  cSec,
  cStatus,
  cType,
  epDesc,
  eventId,
  feedCode,
  hScore,
  mCount,
  markets,
  opADesc,
  opBDesc,
  pScores,
}) => {
  const history = useHistory();
  const hPeriodScores = pScores.map((periodScore) => periodScore.hScore);
  const aPeriodScores = pScores.map((periodScore) => periodScore.aScore);

  const onExpandHandler = useCallback(() => {
    history.push(getHrefLiveEventDetail(eventId));
  }, [eventId, history]);

  return (
    <div className={classes["bet"]}>
      <div className={classes["bets__title"]}>{epDesc}</div>
      <div className={classes["bet__container"]}>
        <MatchHeader cMin={cMin} cPeriod={cPeriod} cSec={cSec} cStatus={cStatus} cType={cType} eventId={eventId} />
        <div className={classes["bet__body"]}>
          <MatchTeamScores
            aPeriodScores={aPeriodScores}
            aScore={Number(aScore) ?? 0}
            feedCode={feedCode && feedCode.split(":").splice(-1)[0]}
            hPeriodScores={hPeriodScores}
            hScore={Number(hScore) ?? 0}
            marketCount={mCount}
            opponentA={opADesc}
            opponentB={opBDesc}
            onExpand={onExpandHandler}
          />
          {markets && !isEmpty(Object.values(markets)) && (
            <MatchMarket {...Object.values(markets)[0]} eventId={eventId} />
          )}
        </div>
      </div>
    </div>
  );
};

LiveEuropeanMatch.propTypes = propTypes;
LiveEuropeanMatch.defaultProps = defaultProps;

export default LiveEuropeanMatch;

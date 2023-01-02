import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import MatchTeamScore from "../MatchTeamScore";

import BetButton from "applications/vanillamobile/common/components/BetButton";
import ExpandMarketsButton from "applications/vanillamobile/components/Sports/Buttons/ExpandMarketsButton/ExpandMarketsButton";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getCmsConfigSportsBook } from "redux/reselect/cms-selector";

const propTypes = {
  aPeriodScores: PropTypes.array.isRequired,
  aScore: PropTypes.number.isRequired,
  feedCode: PropTypes.string,
  hPeriodScores: PropTypes.array.isRequired,
  hScore: PropTypes.number.isRequired,
  marketCount: PropTypes.number.isRequired,
  onExpand: PropTypes.func.isRequired,
  opponentA: PropTypes.string.isRequired,
  opponentB: PropTypes.string.isRequired,
};
const defaultProps = {
  feedCode: undefined,
};

const MatchTeamScores = ({
  aPeriodScores,
  aScore,
  feedCode,
  hPeriodScores,
  hScore,
  marketCount,
  onExpand,
  opponentA,
  opponentB,
}) => {
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

  return (
    <div className={classes["bet__row"]}>
      <div className={classes["bet__score"]}>
        <MatchTeamScore description={opponentA} periodScores={hPeriodScores} score={hScore} />
        <MatchTeamScore description={opponentB} periodScores={aPeriodScores} score={aScore} />
      </div>
      <div className={classes["bet__icons"]}>
        {betradarStatsOn && betradarStatsURL && feedCode && <BetButton feedCode={feedCode} url={betradarStatsURL} />}
        <ExpandMarketsButton marketCount={marketCount} onClick={onExpand} />
      </div>
    </div>
  );
};

MatchTeamScores.propTypes = propTypes;
MatchTeamScores.defaultProps = defaultProps;

export default React.memo(MatchTeamScores);

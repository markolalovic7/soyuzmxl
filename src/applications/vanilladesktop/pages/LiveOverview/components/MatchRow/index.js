import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import { getCmsConfigSportsBook } from "../../../../../../redux/reselect/cms-selector";
import { favouriteSelector } from "../../../../../../redux/reselect/live-selector";
import { setActiveMatchTracker, toggleLiveFavourite } from "../../../../../../redux/slices/liveSlice";
import { openLinkInNewWindow } from "../../../../../../utils/misc";
import classes from "../../../../scss/vanilladesktop.module.scss";

import MarketSection from "./components/MarketSection";
import MatchScoresSection from "./components/MatchScoresSection";
import MatchStatusSection from "./components/MatchStatusSection";

const StatIcon = () => (
  <svg height="18" viewBox="0 0 21 18" width="21" xmlns="http://www.w3.org/2000/svg">
    <g>
      <g>
        <path d="M15.524 12.353l4.58-7.637V18H-.03V.534h2.013v12.168L7.52 3.445l6.544 3.668L18.333 0l1.741.97-5.265 8.782-6.554-3.639-5.96 9.946h2.276l4.42-7.336z" />
      </g>
    </g>
  </svg>
);

const MatchRow = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const language = useSelector(getAuthLanguage);
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

  const activeMatchTracker = useSelector((state) => state.live.activeMatchTracker);
  const liveFavourites = useSelector(favouriteSelector);

  const hPeriodScores = match.pScores.map((periodScore) => periodScore.hScore);
  const aPeriodScores = match.pScores.map((periodScore) => periodScore.aScore);

  const market = !isEmpty(Object.values(match.markets)) ? Object.values(match.markets)[0] : undefined;

  return (
    <div className={classes["live-overview-item__item"]}>
      <div className={classes["live-overview-item__card"]}>
        <MatchStatusSection
          cMin={match.cMin}
          cPeriod={match.cPeriod}
          cSec={match.cSec}
          cStatus={match.cStatus}
          cType={match.cType}
        />
        <MatchScoresSection
          aPeriodScores={aPeriodScores}
          aScore={match.aScore}
          hPeriodScores={hPeriodScores}
          hScore={match.hScore}
          opADesc={match.opADesc}
          opBDesc={match.opBDesc}
        />
      </div>
      <div className={classes["live-overview-item__data"]}>
        <div className={classes["live-overview-item__labels"]}>
          <span className={classes["live-overview-item__label"]}>
            {market ? `${market.mDesc} - ${market.pDesc}` : ""}
          </span>
          {isSmsInfoEnabled && (
            <span className={classes["live-overview-item__info"]}>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </span>
          )}
        </div>
        <div className={classes["live-overview-item__bets"]}>
          <MarketSection eventId={match.eventId} market={market} />
          <div className={classes["live-overview-item__icons"]}>
            <div
              className={cx(classes["main-icon"], {
                [classes["active"]]: activeMatchTracker?.feedCode === match.feedCode,
                [classes["disabled"]]: !match.hasMatchTracker,
              })}
              onClick={() => dispatch(setActiveMatchTracker({ feedCode: match.feedCode, sportCode: match.sport }))}
            >
              <StatIcon />
            </div>
            <div
              className={classes["main-icon"]}
              onClick={() => dispatch(toggleLiveFavourite({ eventId: match.eventId }))}
            >
              <i
                className={
                  liveFavourites.includes(match.eventId) ? classes["qicon-star-full"] : classes["qicon-star-empty"]
                }
              />
            </div>
            {betradarStatsOn && betradarStatsURL && match.feedCode && (
              <div
                className={classes["main-icon"]}
                onClick={() =>
                  openLinkInNewWindow(
                    `${betradarStatsURL}/${language}/match/${
                      match.feedCode.split(":")[match.feedCode.split(":").length - 1]
                    }`,
                  )
                }
              >
                <i className={classes["qicon-stats"]} />
              </div>
            )}
            <div className={classes["main-icon"]} onClick={() => history.push(`/live/event/${match.eventId}`)}>
              <span>{`+${match.mCount > 1 ? match.mCount - 1 : 0}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MatchRow.propTypes = {
  match: PropTypes.object.isRequired,
};

MatchRow.defaultProps = {};

export default React.memo(MatchRow);

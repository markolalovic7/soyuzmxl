import cx from "classnames";
import isEmpty from "lodash.isempty";
import * as PropTypes from "prop-types";
import React from "react";
import { useHistory, useParams } from "react-router";

import { getImg } from "../../../../../../../../../utils/bannerHelpers";
import classes from "../../../../../../../scss/slimdesktop.module.scss";
import MatchOutcome from "../../../../../../PrematchPage/components/CentralColumn/components/CompactPrematchBody/LeftCompactColumn/components/MatchSummary/components/MatchOutcome";
import MatchDetail from "../MatchDetail";

import MatchStatusSection from "./MatchStatusSection";

const EMPTY_OUTCOME_1 = {
  desc: "-.-",
  hidden: true,
  outcomeId: 1,
  price: "1.00",
};

const EMPTY_OUTCOME_2 = {
  desc: "-.-",
  hidden: true,
  outcomeId: 2,
  price: "1.00",
};

const MatchSummary = ({ isAllowInlineDetailExpansion, match, sportCode }) => {
  const history = useHistory();

  const { eventId: eventIdStr, eventPathId: eventPathIdStr } = useParams();

  const activePathEventId = eventIdStr ? Number(eventIdStr) : undefined;

  const market = !isEmpty(match.markets) ? Object.values(match.markets)[0] : undefined;

  const coefficients = market
    ? market?.sels?.map((outcome) => ({
        desc: outcome.oDesc,
        dir: outcome.dir,
        hidden: outcome.hidden,
        outcomeId: outcome.oId,
        price: outcome.formattedPrice,
      }))
    : [EMPTY_OUTCOME_1, EMPTY_OUTCOME_2];

  return (
    <div className={cx(classes["card"], classes["card-live"])} key={match.eventId}>
      <div className={classes["card-live__head"]} style={{ backgroundImage: `url(${getImg(sportCode)})` }}>
        <div className={classes["card-live__head-inner"]}>
          <div className={classes["card-live__head-grid"]}>
            <div className={classes["card-live__head-item"]}>
              <span className={classes["card-live__team"]}>
                <b>{match.opADesc}</b>
              </span>
              <span className={cx(classes["card-live__box"], classes["card-live-score"])}>
                <b>{match.hScore || 0}</b>
              </span>
            </div>
            <MatchStatusSection
              cMin={match.cMin}
              cPeriod={match.cPeriod}
              cSec={match.cSec}
              cStatus={match.cStatus}
              cType={match.cType}
            />
            <div className={classes["card-live__head-item"]}>
              <span className={cx(classes["card-live__box"], classes["card-live-score"])}>
                <b>{match.aScore || 0}</b>
              </span>
              <span className={classes["card-live__team"]}>
                <b>{match.opBDesc}</b>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={classes["card__results"]}>
        <div className={cx(classes["card__box"], classes["card__box_special"])}>
          {coefficients?.map((coefficient, index) => (
            <MatchOutcome
              coefficient={coefficient}
              coefficientCount={coefficients.length}
              eventId={match.eventId}
              index={index}
              key={coefficient.outcomeId}
            />
          ))}
        </div>
        <div
          className={cx(classes["card-result"], classes["card-result--icon"])}
          onClick={() => history.push(`/live/eventpath/${eventPathIdStr || match.leagueId}/event/${match.eventId}`)}
        >
          <b>{`+${match.mCount > 1 ? match.mCount - 1 : 0}`}</b>
        </div>
      </div>

      {isAllowInlineDetailExpansion && activePathEventId === match.eventId && <MatchDetail />}
    </div>
  );
};

MatchSummary.propTypes = {
  isAllowInlineDetailExpansion: PropTypes.bool,
  match: PropTypes.object.isRequired,
  sportCode: PropTypes.string.isRequired,
};

MatchSummary.defaultProps = {
  isAllowInlineDetailExpansion: false,
};

export default React.memo(MatchSummary);

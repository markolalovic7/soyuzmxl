import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import { makeGetJackpotBetslipOutcomesByJackpotId } from "../../../../../../redux/reselect/betslip-selector";
import { getCmsConfigSportsBook } from "../../../../../../redux/reselect/cms-selector";
import { openLinkInNewWindow } from "../../../../../../utils/misc";
import JackpotSelectableCoefficient from "../../../../components/JackpotSelectableCoeficient/components";

const propTypes = {
  coefficients: PropTypes.arrayOf(
    PropTypes.shape({
      coefficient: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  eventId: PropTypes.number.isRequired,
  feedCode: PropTypes.string,
  jackpotId: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  marketPeriod: PropTypes.string.isRequired,
  reserveNumber: PropTypes.number,
  time: PropTypes.string.isRequired,
};

const defaultProps = {
  feedCode: undefined,
  reserveNumber: undefined,
};

const JackpotCard = ({ coefficients, eventId, feedCode, jackpotId, label, marketPeriod, reserveNumber, time }) => {
  const getJackpotBetslipOutcomesByJackpotId = useMemo(makeGetJackpotBetslipOutcomesByJackpotId, []);
  const jackpotBetslipOutcomes = useSelector((state) => getJackpotBetslipOutcomesByJackpotId(state, jackpotId));
  const jackpotOutcomeIds = jackpotBetslipOutcomes.map((jackpotOutcome) => jackpotOutcome.outcomeId);
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;
  const language = useSelector(getAuthLanguage);

  const eventOutcomeCountMap = jackpotBetslipOutcomes.reduce(
    (acc, value) => ({
      ...acc,
      [value.eventId]: (acc[value.eventId] || 0) + 1,
    }),
    {},
  );

  const selectedOutcomesPerEvent = eventOutcomeCountMap[eventId] ? eventOutcomeCountMap[eventId] : 0;
  const marketOutcomeNumber = coefficients.length;
  const enabled = marketOutcomeNumber > selectedOutcomesPerEvent + 1;

  return (
    <div className={cx(classes["jackpot-card"], { [classes["jackpot-card_reserve"]]: reserveNumber !== undefined })}>
      {reserveNumber !== undefined && (
        <span className={classes["jackpot-card__reserve"]}>{`Reserve - ${reserveNumber}`}</span>
      )}
      <div className={classes["jackpot-card__body"]}>
        <div className={classes["jackpot-card__info"]}>
          <h3 className={classes["jackpot-card__title"]}>
            <span>{label}</span>
          </h3>
          <div className={classes["jackpot-card__details"]}>
            <span className={classes["jackpot-card__date"]}>{time}</span>
            <span className={classes["jackpot-card__match"]}>{marketPeriod}</span>
          </div>
        </div>
        <div className={classes["jackpot-card__coeficients"]}>
          {coefficients.map(({ desc, eventId, outcomeId, price }, index) => (
            <JackpotSelectableCoefficient
              desc={desc}
              eventId={eventId}
              hidden={!jackpotOutcomeIds.includes(outcomeId) && !enabled}
              jackpotId={jackpotId}
              key={index}
              outcomeId={outcomeId}
              price={price}
            />
          ))}
        </div>
        {betradarStatsOn && betradarStatsURL && feedCode && (
          <div
            className={classes["main-icon"]}
            onClick={() => openLinkInNewWindow(`${betradarStatsURL}/${language}/match/${feedCode}`)}
          >
            <i className={classes["qicon-stats"]} />
          </div>
        )}
      </div>
    </div>
  );
};

JackpotCard.propTypes = propTypes;
JackpotCard.defaultProps = defaultProps;

export default JackpotCard;

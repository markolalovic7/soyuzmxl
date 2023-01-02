import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import JackpotOutcomePriceButton from "../../../Sports/JackpotOutcomePriceButton/JackpotOutcomePriceButton";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { makeGetJackpotBetslipOutcomesByJackpotId } from "redux/reselect/betslip-selector";
import { refreshBetslip, toggleJackpotSelection } from "redux/slices/betslipSlice";
import { parseDate } from "utils/date";
import { getDatejsObject } from "utils/dayjs";
import { formatDateDayMonthLong, formatDateHoursMinutes } from "utils/dayjs-format";

const propTypes = {
  jackpotId: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
};

const JackpotMatch = ({ jackpotId, match }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getJackpotBetslipOutcomesByJackpotId = useMemo(makeGetJackpotBetslipOutcomesByJackpotId, []);
  const jackpotBetslipOutcomes = useSelector((state) => getJackpotBetslipOutcomesByJackpotId(state, jackpotId));
  const jackpotOutcomeIds = jackpotBetslipOutcomes.map((jackpotOutcome) => jackpotOutcome.outcomeId);

  const markets = match?.children ? Object.values(match.children) : [];

  const eventOutcomeCountMap = jackpotBetslipOutcomes.reduce(
    (acc, value) => ({
      ...acc,
      [value.eventId]: (acc[value.eventId] || 0) + 1,
    }),
    {},
  );

  const onJackpotOutcomeClick = useCallback(
    (eventId, outcomeId) => {
      dispatch(toggleJackpotSelection({ eventId, jackpotId, outcomeId }));
      dispatch(refreshBetslip({ jackpotId }));
    },
    [dispatch, jackpotId],
  );

  return (
    <div className={classes["bet"]}>
      <div className={classes["bet__container"]}>
        <div className={classes["bet__header"]}>
          <div className={classes["bet__numbers"]}>
            {markets.length > 0 && markets[0].reserve && (
              <div className={classes["bet__id"]}>
                {t("vanillamobile.pages.jackpot_details.jackpot_details_jackpot_match_reserve")}
              </div>
            )}
            <div className={classes["bet__id"]}>
              {t("vanillamobile.pages.jackpot_details.jackpot_details_jackpot_match_id", { matchId: match.id })}
            </div>
            <div className={classes["bet__time"]}>
              {formatDateDayMonthLong(getDatejsObject(parseDate(match.epoch)))}
            </div>
            <div className={classes["bet__time"]}>
              {formatDateHoursMinutes(getDatejsObject(parseDate(match.epoch)))}
            </div>
          </div>
          <div className={classes["bet__header-container"]}>
            <div className={classes["bet__team"]}>
              <span>{match.a}</span>
              <span>{match.b}</span>
            </div>
          </div>
        </div>
        <div className={classes["bet__body"]}>
          <div className={classes["bet__coeficients"]}>
            <div className={classes["bet__row"]}>
              {markets.map((market) => {
                const selectedOutcomesPerEvent = eventOutcomeCountMap[match.id] ? eventOutcomeCountMap[match.id] : 0;
                const marketOutcomeNumber = market.children && Object.values(market.children).length;
                const enabled = marketOutcomeNumber > selectedOutcomesPerEvent + 1;

                return (
                  market.children &&
                  Object.values(market.children)
                    .filter((outcome) => !outcome.hidden)
                    .map((outcome) => (
                      <JackpotOutcomePriceButton
                        description={outcome.desc}
                        dir={outcome.dir}
                        eventId={match.id}
                        isActive={jackpotOutcomeIds.includes(outcome.id)}
                        isDisabled={!jackpotOutcomeIds.includes(outcome.id) && !enabled}
                        jackpotId={jackpotId}
                        key={outcome.id}
                        max={Object.values(market.children).length - 1}
                        outcomeId={outcome.id}
                        period={null}
                        price={outcome.price}
                        onClick={onJackpotOutcomeClick}
                      />
                    ))
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

JackpotMatch.propTypes = propTypes;

export default JackpotMatch;

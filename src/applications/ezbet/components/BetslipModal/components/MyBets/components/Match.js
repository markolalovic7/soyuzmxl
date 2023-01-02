import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import SportIcon from "../../../../SportIcon/SportIcon";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const defaultProps = {
  bet: undefined,
  betDescription: undefined,
};

const SELECTION_ERRORS = [
  "MARKET_SUSPENDED",
  "MARKET_CLOSED",
  "EVENT_NOT_AVAILABLE", // ended, or cut off time passed and no live offered...
  "OUTCOME_SUSPENDED", // hidden
  "OUTCOME_SETTLED_LOSE", // resulted / settled
  "OUTCOME_SETTLED_UNDETERMINED",
];

const SELECTION_CONDITIONAL_ERRORS = [
  "OUTCOME_SETTLED_WIN", // resulted / settled
  "OUTCOME_SETTLED_VOID", // resulted / settled
];

const anySelectionOpen = (selections) => {
  let anyOpen = false;
  selections.forEach((x) => {
    if (x.valid) anyOpen = true;
  });

  return anyOpen;
};

const Match = ({ bet, betDescription }) => {
  Match.propTypes = {
    bet: PropTypes.object,
    betDescription: PropTypes.object,
  };
  const { t } = useTranslation();

  const [notValidInfoVisible, setNotValidInfoVisible] = React.useState(false);

  const invalid =
    betDescription.validationErrors.some((r) => SELECTION_ERRORS.includes(r)) || // any selection errors
    (betDescription.validationErrors.some((r) => SELECTION_CONDITIONAL_ERRORS.includes(r)) &&
      bet.cashoutBetDescriptions.length > 1 &&
      !anySelectionOpen(bet.cashoutBetDescriptions)); // or any conditional errors, provided they add up to all selections ;

  const marketPeriodDescription = betDescription &&
    <div className={classes["flex-center"]}><span>{betDescription.marketDescription} [ {betDescription && betDescription.periodDescription} ]</span> : </div>

  return (
    <div className={classes["match"]}>
      <div className={cx(classes["match-header"], classes["match-header-my-bets"])}>
        <p className={classes["flex-al-center"]}>
          {betDescription && <SportIcon code={betDescription.sportCode} />}
          [{" "}<span>{betDescription && betDescription.eventPathDescription}</span>{" "}]
        </p>

        <div className={classes["my-bets-info-wrap"]}>
          {betDescription.live && (
            <div className={classes["my-bets-live-icon"]}>
              <i className={classes["icon-live-icon"]}>
                <span className={classes["path1"]} />
                <span className={classes["path2"]} />
                <span className={classes["path3"]} />
                <span className={classes["path4"]} />
                <span className={classes["path5"]} />
                <span className={classes["path6"]} />
                <span className={classes["path7"]} />
              </i>
            </div>
          )}

          {invalid && (
            <i
              className={cx(classes["icon-not-valid"], classes["relative"])}
              onClick={() => setNotValidInfoVisible(!notValidInfoVisible)}
              onMouseEnter={() => setNotValidInfoVisible(true)}
              onMouseLeave={() => setNotValidInfoVisible(false)}
            >
              {notValidInfoVisible && (
                <div className={cx(classes["absolute"], classes["no-valid-info"])}>
                  <span>
                    {betDescription.validationErrors.includes("EVENT_NOT_AVAILABLE")
                      ? t("ez.event_unavailable")
                      : t("ez.market_unavailable")}
                  </span>
                </div>
              )}
            </i>
          )}
        </div>
      </div>
      <div className={classes["match-body"]}>
        <div className={cx(classes["flex-al-center"], classes["txt"])}>
          <p className={["flex-al-center"]}>
            <span>
              {betDescription && betDescription.eventDescription
                ? betDescription.eventDescription.split(" vs ")[0]
                : ""}
            </span>
            <b>VS</b>
            <span>
              {betDescription && betDescription.eventDescription
                ? betDescription.eventDescription.split(" vs ")[1]
                : ""}
            </span>
          </p>
        </div>

        {bet.cashoutBetDescriptions?.length > 1 && (
          <div className={cx(classes["date-and-time"], classes["flex-al-center"])}>
            <p>{dayjs.unix(betDescription.epoch / 1000).format("MM-DD")}</p>
            &nbsp;
            <p>{dayjs.unix(betDescription.epoch / 1000).format("HH:mm")}</p>
          </div>
        )}
        <div className={cx(classes["flex-al-center"], classes["relative"])}>
          <p>
            {marketPeriodDescription}
            <span style={{ marginLeft: '5px' }}>
              {betDescription &&
                betDescription.outcomeDescription}
            </span>
          </p>
          <span className={classes["price"]}>{betDescription && betDescription.price}</span>
        </div>
      </div>
    </div>
  );
};

Match.defaultProps = defaultProps;

export default React.memo(Match);

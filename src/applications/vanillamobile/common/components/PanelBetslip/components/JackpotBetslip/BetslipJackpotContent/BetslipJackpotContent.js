import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { onRemoveJackpotSelectionHandler } from "utils/betslip-utils";

const propTypes = {
  jackpotId: PropTypes.string.isRequired,
};

const defaultProps = {};

const BetslipJackpotContent = ({ jackpotId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const betslipData = useSelector((state) => state.betslip.jackpotBetslipData[jackpotId]);

  return (
    <div className={classes["betslip__cards"]}>
      {betslipData?.model?.outcomes?.map((outcome) => {
        if (outcome.outcomeDescription) {
          return (
            <div
              className={`${classes["betslip__card"]} ${!outcome.valid ? classes["betslip__card_disabled"] : ""}`}
              key={outcome.outcomeDescription}
            >
              <div className={classes["betslip__card-container"]}>
                <div className={classes["betslip__card-head"]}>
                  <span
                    className={classes["betslip__card-cross"]}
                    onClick={() => onRemoveJackpotSelectionHandler(dispatch, outcome.outcomeId, jackpotId)}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </span>
                  <span className={classes["betslip__card-title"]}>{outcome.outcomeDescription}</span>
                </div>
                <div className={classes["betslip__card-body"]}>
                  <div className={classes["betslip__card-commands"]}>
                    <span className={classes["betslip__card-command"]}>{outcome.eventDescription}</span>
                  </div>
                  <div className={classes["betslip__card-win"]}>
                    {`${outcome.marketDescription} - ${outcome.periodDescription}`}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return null; // skip if the data is pending API initialization!
      })}

      {betslipData?.betData?.multiples?.map((multiple) => {
        if (multiple.numSubBets > 1) return null;

        const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;
        const stake = multiple.unitStake;

        return (
          <div
            className={`${classes["betslip__card"]} ${!allOutcomesValid ? classes["betslip__card_disabled"] : ""}`}
            key={multiple.typeId}
          >
            <div className={classes["betslip__card-container"]}>
              <div className={classes["betslip__card-head"]}>
                <span className={classes["betslip__card-title"]}>Jackpot Bet</span>
              </div>
              <div className={classes["betslip__card-body"]}>
                <div className={classes["betslip__card-stake"]}>
                  <span>{t("betslip_panel.stake")}</span>
                  <span className={classes["betslip__card-input"]}>{stake > 0 ? stake : ""}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

BetslipJackpotContent.propTypes = propTypes;
BetslipJackpotContent.defaultProps = defaultProps;

export default React.memo(BetslipJackpotContent);

import { faClipboardList, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { makeGetBetslipData } from "../../../../../redux/reselect/betslip-selector";
import { getRetailSelectedPlayerAccountId } from "../../../../../redux/reselect/retail-selector";
import {
  onClearBetslipHandler,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
} from "../../../../../utils/betslip-utils";
import classes from "../../../scss/slipstream.module.scss";

const BetslipPanel = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const selectedPlayerId = useSelector(getRetailSelectedPlayerAccountId);

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const hasOutcomes = betslipData.model.outcomes.length > 0;
  const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;

  // Refresh betslips
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedPlayerId && betslipData.model.outcomes.length > 0) {
        // do not refresh while the user is tinkering with the stakes
        onRefreshBetslipHandler(dispatch, location.pathname);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData.model.outcomes.length, location.pathname]);

  useEffect(() => {
    if (!selectedPlayerId) {
      // do not refresh while the user is tinkering with the stakes
      onClearBetslipHandler(dispatch, location.pathname);
    }
  }, [selectedPlayerId]);

  return (
    <div className={classes["betslip"]}>
      <div className={classes["betslip__title"]}>
        <div className={classes["betslip__icon"]}>
          <FontAwesomeIcon icon={faClipboardList} />
        </div>
        <div className={classes["betslip__text"]}>Betslip</div>
      </div>
      <div className={classes["betslip__body"]}>
        <div className={classes["betslip__cards"]}>
          {betslipData.model.outcomes
            .filter((outcome) => outcome.outcomeDescription)
            .map((outcome) => (
              <div className={classes["betslip__card"]} key={outcome.outcomeId}>
                <div className={classes["betslip-card__header"]}>
                  <div
                    className={classes["betslip-card__close"]}
                    onClick={() => onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                  <div className={classes["betslip-card__title"]}>{outcome.outcomeDescription}</div>
                  <div className={classes["betslip-card__coeficient"]}>{outcome.formattedPrice}</div>
                </div>
                <div className={classes["betslip-card__body"]}>
                  <div className={classes["betslip-card__match"]}>{outcome.eventDescription}</div>
                  <div className={classes["betslip-card__outcome"]}>
                    {`${outcome.marketDescription} - ${outcome.periodDescription}`}
                  </div>
                  {/* <div className={classes["betslip-card__label"]}>Win only</div> */}
                </div>
              </div>
            ))}
        </div>
        <div className={classes["betslip__buttons"]}>
          {betslipData.betData.singles.length > 0 && (
            <div className={classes["betslip__button"]} onClick={() => history.push(`/betslip/1`)}>
              <span>{`Single${betslipData.betData.singles.length > 1 ? "s" : ""}`}</span>
              <span>
                {`${betslipData.betData.singles.length} bet${betslipData.betData.singles.length > 1 ? "s" : ""}`}
              </span>
            </div>
          )}
          {betslipData.betData.multiples.map((multiple) => (
            <div
              className={classes["betslip__button"]}
              key={multiple.typeId}
              onClick={() => history.push(`/betslip/${multiple.typeId}`)}
            >
              <span>{multiple.typeDescription}</span>
              <span>{`${multiple.numSubBets} bet${Number(multiple.numSubBets) > 1 ? "s" : ""}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(BetslipPanel);

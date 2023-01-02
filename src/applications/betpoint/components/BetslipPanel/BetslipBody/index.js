import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { makeGetBetslipData } from "../../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onRemoveSelectionHandler } from "../../../../../utils/betslip-utils";
import classes from "../../../scss/betpoint.module.scss";

const BetslipBody = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("BETSLIP"); // BETSLIP, CASHOUT
  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const hasOutcomes = betslipData.model.outcomes.length > 0;
  const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;

  // Refresh betslips
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (betslipData.model.outcomes.length > 0) {
        // do not refresh while the user is tinkering with the stakes
        onRefreshBetslipHandler(dispatch, location.pathname);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData.model.outcomes.length, location.pathname]);

  return (
    <div className={cx(classes["betslip"], { [classes["active"]]: true })}>
      <div className={classes["betslip__body"]}>
        <div className={classes["betslip__cards"]}>
          {betslipData.model.outcomes
            .filter((outcome) => outcome.outcomeDescription)
            .map((outcome) => (
              <div className={cx(classes["betslip-card"], { [classes["disabled"]]: !outcome.valid })} key={outcome.id}>
                <div className={classes["betslip-card__header"]}>
                  <div
                    className={classes["betslip-card__cross"]}
                    onClick={() => onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                  <div className={classes["betslip-card__title"]}>{outcome.outcomeDescription}</div>
                  <div className={classes["betslip-card__coeficient"]}>{outcome.formattedPrice}</div>
                </div>
                <div className={classes["betslip-card__body"]}>
                  <div className={classes["betslip-card__match"]}>{outcome.eventDescription}</div>
                  <div className={classes["betslip-card__type"]}>
                    {`${outcome.marketDescription} - ${outcome.periodDescription}`}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={classes["betslip__buttons"]}>
        {betslipData.betData.singles.length > 0 && (
          <div className={classes["betslip__button"]} onClick={() => history.push(`/betslip/1`)}>
            {`${`Single${betslipData.betData.singles.length > 1 ? "s" : ""}`} - ${`${
              betslipData.betData.singles.length
            } bet${betslipData.betData.singles.length > 1 ? "s" : ""}`}`}
          </div>
        )}
        {betslipData.betData.multiples.map((multiple) => (
          <div
            className={classes["betslip__button"]}
            key={multiple.typeId}
            onClick={() => history.push(`/betslip/${multiple.typeId}`)}
          >
            {`${multiple.typeDescription} - ${`${multiple.numSubBets} bet${
              Number(multiple.numSubBets) > 1 ? "s" : ""
            }`}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(BetslipBody);

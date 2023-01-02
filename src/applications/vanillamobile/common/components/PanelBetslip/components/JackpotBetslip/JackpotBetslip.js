import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import SectionLoader from "../../../SectionLoader";

import BetslipJackpotContent from "./BetslipJackpotContent/BetslipJackpotContent";
import BetslipConfirmationPopUp from "./BetslipPopUp/BetslipConfirmationPopUp/BetslipConfirmationPopUp";
import BetslipErrorPopUp from "./BetslipPopUp/BetslipErrorPopUp/BetslipErrorPopUp";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { makeGetJackpotBetslipDataByJackpotId } from "redux/reselect/betslip-selector";
import { submitBetslip } from "redux/slices/betslipSlice";
import {
  acknowledgeErrors,
  acknowledgeJackpotSubmission,
  getGlobalPotentialWin,
  getGlobalTotalStake,
  onClearJackpotBetslipHandler,
  onRefreshJackpotBetslipHandler,
} from "utils/betslip-utils";

const propTypes = {
  jackpotId: PropTypes.string.isRequired,
  setShowMyAccount: PropTypes.func.isRequired,
  showBetslipTab: PropTypes.bool.isRequired,
};

const defaultProps = {};

const JackpotBetslip = ({ jackpotId, setShowMyAccount, showBetslipTab }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { location } = useLocation();
  const getGetJackpotBetslipDataByJackpotId = useMemo(makeGetJackpotBetslipDataByJackpotId, []);
  const betslipData = useSelector((state) => getGetJackpotBetslipDataByJackpotId(state, jackpotId));
  const jackpotSubmitInProgress = useSelector((state) => state.betslip.jackpotSubmitInProgress[jackpotId]);
  const jackpotSubmitError = useSelector((state) => state.betslip.jackpotSubmitError[jackpotId]);
  const jackpotSubmitConfirmation = useSelector((state) => state.betslip.jackpotSubmitConfirmation[jackpotId]);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const currencyCode = useSelector((state) => state.auth.currencyCode);

  const hasOutcomes = betslipData && betslipData.model.outcomes.length > 0;
  const allOutcomesValid = !betslipData || betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;

  // Refresh betslips
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (betslipData?.model?.outcomes?.length > 0) {
        // do not refresh while the user is tinkering with the stakes
        onRefreshJackpotBetslipHandler(dispatch, jackpotId);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData?.model?.outcomes?.length, jackpotId]);

  return (
    <div className={`${classes["betslip"]} ${showBetslipTab ? classes["active"] : ""}`}>
      <div className={classes["betslip__body"]}>
        <div data-scroll-lock-scrollable className={classes["betslip__top"]}>
          {!allOutcomesValid ? (
            <div className={classes["betslip__notification"]}>
              <div className={classes["betslip__notification-top"]}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                {t("betslip_panel.selection_unavailable")}
              </div>
              <div className={classes["betslip__notification-bottom"]}>
                {t("betslip_panel.please_remove_and_select")}
              </div>
            </div>
          ) : (
            ""
          )}
          {jackpotSubmitInProgress && <SectionLoader overlay />}
          <BetslipJackpotContent jackpotId={jackpotId} />
        </div>

        <div className={classes["betslip__bottom"]}>
          <span
            className={classes["betslip__remove"]}
            onClick={() => onClearJackpotBetslipHandler(dispatch, jackpotId)}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
            <span>{t("betslip_panel.remove_all")}</span>
          </span>
          <div className={classes["betslip__summary"]}>
            <div className={classes["betslip__total"]}>
              <span>{t("betslip_panel.total_stake")}</span>
              <span>
                {getSymbolFromCurrency(currencyCode)}
                {betslipData
                  ? getGlobalTotalStake(betslipData).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })
                  : ""}
              </span>
            </div>
            <div className={classes["betslip__returns"]}>
              <span>{t("betslip_panel.potential_returns")}</span>
              <span>
                {`${getSymbolFromCurrency(currencyCode)} ${getGlobalPotentialWin(betslipData)
                  // - getGlobalTotalStake(betslipData)
                  .toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}`}
              </span>
            </div>
            <div className={classes["betslip__confirm"]}>
              {loggedIn ? (
                <button
                  disabled={
                    !allOutcomesValid ||
                    !hasOutcomes ||
                    getGlobalTotalStake(betslipData) <= 0 ||
                    jackpotSubmitInProgress
                  }
                  type="button"
                  onClick={() => dispatch(submitBetslip({ jackpotId }))}
                >
                  {t("betslip_panel.place_bet")}
                </button>
              ) : (
                <button type="button" onClick={() => setShowMyAccount(true)}>
                  {t("login")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <BetslipConfirmationPopUp
        submitConfirmation={jackpotSubmitConfirmation}
        onClearSelections={() => acknowledgeJackpotSubmission(dispatch, jackpotId)}
      />

      <BetslipErrorPopUp
        submitError={jackpotSubmitError}
        onClick={() => acknowledgeErrors(dispatch, location.pathname)}
      />
    </div>
  );
};

JackpotBetslip.propTypes = propTypes;
JackpotBetslip.defaultProps = defaultProps;

export default React.memo(JackpotBetslip);

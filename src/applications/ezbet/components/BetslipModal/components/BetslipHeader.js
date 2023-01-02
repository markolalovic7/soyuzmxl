import cx from "classnames";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { makeGetBetslipData } from "../../../../../redux/reselect/betslip-selector";
import Logo from "../../../img/logo.svg";
import classes from "../../../scss/ezbet.module.scss";

const BetslipHeader = ({
  activeTab,
  cashOutScreenVisible,
  onClose,
  onMultipleTabClickHandler,
  setActiveTab,
  setCashOutScreenVisible,
  setDeleteConfirmation,
}) => {
  const location = useLocation();
  const { t } = useTranslation();

  const isLoggedIn = useSelector((state) => state.auth.loggedIn);

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const activeBetCount = useSelector((state) => state.cashout.activeBetCount);

  // Ignore standard API rules and create custom rules regarding when to show the multiple tab

  const isMultipleTabAllowed = useMemo(() => {
    const outcomes = betslipData.model.outcomes;
    // While the standard behaviour is that we only show the multiple tab if there are multiple bets available,
    // this site will show the multiple tab when there is a "possibility" of having some multiple bets if the user manipulates the options.

    // Rule #1 - if there are not enough selections for a multiple, the multiple tab is disabled
    if (outcomes.length < 2) return false;

    // Rule #2 - if there are many selections, and more than 1 belong to the same event --> the multiple tab is disabled.
    const eventIds = outcomes.map((x) => x.eventId);

    const hasDuplicatedSelectionsPerEvent = new Set([...eventIds]).size !== eventIds.length;
    if (hasDuplicatedSelectionsPerEvent) return false;

    // Any other case, independently of whether a multiple bet can be possibly constructed --> the multiple tab is allowed.
    return true;
  }, [betslipData.model.outcomes]);

  return (
    <div className={classes["full-page-modal-header"]}>
      <div className={classes["header-wrapper"]}>
        <header className={cx(classes["header"], classes["checkout-header"])}>
          <i className={classes["icon-logo"]}>
            <img alt="EZBET" src={Logo} />
          </i>
          <div className={classes["header-actions"]}>
            {(cashOutScreenVisible || (!cashOutScreenVisible && isLoggedIn)) && (
              <button
                className={cx(
                  classes["outline"],
                  classes["notifications"],
                  classes["relative"],
                  classes["betslip-in-progress"],
                )}
                // disabled={cashOutScreenVisible && betslipData.model.outcomes.length === 0}
                id="notifications"
                type="button"
                onClick={() => setCashOutScreenVisible(!cashOutScreenVisible)}
              >
                {cashOutScreenVisible ? t("betslip") : t("ez.bet_in_progress")}
                {((cashOutScreenVisible && betslipData.model.outcomes.length > 0) ||
                  (!cashOutScreenVisible && activeBetCount > 0)) && (
                    <span className={classes["absolute"]}>
                      {cashOutScreenVisible ? betslipData.model.outcomes.length : activeBetCount}
                    </span>
                  )}
              </button>
            )}

            <span>
              <button className={cx(classes["full-page-modal-close"], classes["link"])} type="button" onClick={onClose}>
                <i className={classes["icon-close"]} />
              </button>
            </span>
          </div>
        </header>

        {cashOutScreenVisible && (
          <div className={cx(classes["checkout-tabs"], classes["checkout-tabs-betslip"])}>
            <ul className={cx(classes["header-tabs-items"], classes["notification-screen"])} id="header-tabs-items">
              <li className={cx(classes["link"], classes["bet-in-progress-txt"], { [classes["link-active"]]: true })}>
                <p>
                  <i className={cx(classes["icon"], classes["icon-history-regular"])} />
                  <span>{t("ez.bet_in_progress_ext")}</span>
                </p>
              </li>
            </ul>
          </div>
        )}

        {!cashOutScreenVisible && (
          <div className={classes["checkout-tabs"]}>
            <ul
              className={cx(classes["header-tabs-items"], classes["regular-screen"], classes["single-multiple-tabs"])}
            >
              <li
                className={cx(classes["single-multiple-link"], {
                  [classes["single-multiple-link-active"]]: activeTab === "SINGLE",
                })}
                onClick={() => setActiveTab("SINGLE")}
              >
                <p>{betslipData.model.outcomes.length <= 1 ? t("ez.single") : t("ez.multisingle")}</p>
              </li>
              <li
                className={cx(classes["single-multiple-link"], {
                  [classes["single-multiple-link-active"]]: activeTab === "MULTIPLE",
                })}
                disabled={betslipData.model.outcomes.length === 0}
                style={{
                  opacity:
                    isMultipleTabAllowed || true // retain original logic in case we revert
                      ? 1
                      : 0.5,
                  pointerEvents:
                    isMultipleTabAllowed || true // retain original logic in case we revert
                      ? "auto"
                      : "none",
                }}
                onClick={onMultipleTabClickHandler}
              >
                <p>{t("ez.multiple")}</p>
              </li>
              {/* <li className={classes["single-multiple-link"]} style={{ opacity: 0.5 }}> */}
              {/*  <p>Multi-Single</p> */}
              {/* </li> */}
              <button
                className={cx(classes["outline"], classes["delete-all-btn"], {
                  [classes["btn-blue-border"]]:
                    betslipData.model.outcomes.length > 0 &&
                    betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1,
                })}
                disabled={
                  !betslipData.model.outcomes.length > 0 ||
                  betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) > -1
                }
                type="button"
                onClick={() => setDeleteConfirmation(true)}
              >
                <span>{t("ez.delete_all")}</span>
                <i className={classes["icon-delete"]} />
              </button>
            </ul>
          </div>
        )}

        <hr className={classes["separator"]} style={{ marginTop: "-1px" }} />
      </div>
    </div>
  );
};

BetslipHeader.propTypes = {
  activeTab: PropTypes.string.isRequired,
  cashOutScreenVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMultipleTabClickHandler: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setCashOutScreenVisible: PropTypes.func.isRequired,
  setDeleteConfirmation: PropTypes.func.isRequired,
};
export default React.memo(BetslipHeader);

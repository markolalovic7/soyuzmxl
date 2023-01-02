import cx from "classnames";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { makeGetBetslipData } from "../../../../../redux/reselect/betslip-selector";
import classes from "../../../scss/ezbet.module.scss";

const BetslipSVG = () => (
  <svg height="18" viewBox="0 0 14 18" width="14" xmlns="http://www.w3.org/2000/svg">
    <g>
      <g>
        <path
          d="M14 4.286a.826.826 0 0 0-.255-.595L10.175.246A.891.891 0 0 0 9.556 0h-.222v4.5H14zm-3.5 4.292a.431.431 0 0 1-.438.422H3.939a.431.431 0 0 1-.438-.422v-.281c0-.232.197-.422.438-.422h6.124c.241 0 .438.19.438.422zm0 2.25a.431.431 0 0 1-.438.422H3.939a.431.431 0 0 1-.438-.422v-.281c0-.232.197-.422.438-.422h6.124c.241 0 .438.19.438.422zm0 2.25a.431.431 0 0 1-.438.422H3.939a.431.431 0 0 1-.438-.422v-.281c0-.232.197-.422.438-.422h6.124c.241 0 .438.19.438.422zM8.167 4.781V0H.875C.39 0 0 .376 0 .844v16.312c0 .468.39.844.875.844h12.25c.485 0 .875-.376.875-.844V5.625H9.042c-.482 0-.875-.38-.875-.844z"
          fill="#f8f8f8"
        />
      </g>
    </g>
  </svg>
);
const DesktopBetslipHeader = ({
  activeTab,
  cashOutScreenVisible,
  onMultipleTabClickHandler,
  setActiveTab,
  setCashOutScreenVisible,
  setDeleteConfirmation,
  setStakePanelStatus,
  stakePanelStatus,
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
        <header className={cx(classes["header"], classes["checkout-header"])} style={{ height: "40px" }}>
          <div style={{ display: "flex" }}>
            <BetslipSVG />
            <p style={{ color: "#ffffff", fontSize: "15px", marginLeft: "16px" }}>베팅슬립</p>
          </div>

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
                onClick={() => {
                  setActiveTab("SINGLE");
                  setStakePanelStatus({
                    ...stakePanelStatus,
                    outcomeId: undefined, // request the panel to open for "ALL" type 1s (singles) - in case the panel was already open
                    typeId: 1,
                  });
                }}
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

DesktopBetslipHeader.propTypes = {
  activeTab: PropTypes.string.isRequired,
  cashOutScreenVisible: PropTypes.bool.isRequired,
  onMultipleTabClickHandler: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setCashOutScreenVisible: PropTypes.func.isRequired,
  setDeleteConfirmation: PropTypes.func.isRequired,
  setStakePanelStatus: PropTypes.func.isRequired,
  stakePanelStatus: PropTypes.object.isRequired,
};
export default React.memo(DesktopBetslipHeader);

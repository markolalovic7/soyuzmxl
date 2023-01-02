import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  makeGetBetslipData,
  makeGetBetslipModelUpdateInProgress,
  makeGetBetslipSubmitInProgress,
} from "../../../../../../../redux/reselect/betslip-selector";
import { getCmsConfigBrandDetails } from "../../../../../../../redux/reselect/cms-selector";
import { persistLatestOutcomePrices } from "../../../../../../../redux/slices/ezBetslipCacheSlice";
import {
  onRemoveSelectionHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
} from "../../../../../../../utils/betslip-utils";
import { isNotEmpty } from "../../../../../../../utils/lodash";
import classes from "../../../../../scss/ezbet.module.scss";

import StakePanel from "./MobileStakePanel";

const onLoginRequest = () => {
  console.log("Request login");
  window.parent.postMessage(
    {
      action: "app.login",
    },
    "*",
  );
};

const MyBetslipFooter = ({ activeTab, setPlaceBetTime, setStakePanelStatus, stakePanelStatus }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const autoApprovalMode = useSelector((state) => state.ez.autoApprovalMode); // AUTO_ALL, AUTO_HIGHER, MANUAL

  const isLoggedIn = useSelector((state) => state.auth.loggedIn);

  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const betslipOutcomeInitialPrices = useSelector((state) => state.ezBetslipCache.betslipOutcomeInitialPrices);

  const getBetslipModelUpdateInProgress = useMemo(makeGetBetslipModelUpdateInProgress, []);
  const modelUpdateInProgress = useSelector((state) => getBetslipModelUpdateInProgress(state, location.pathname));

  const getSubmitInProgress = useMemo(makeGetBetslipSubmitInProgress, []);
  const submitInProgress = useSelector((state) => getSubmitInProgress(state, location.pathname));

  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);

  const multiplePriceChanged = useMemo(
    () =>
      betslipData.model.outcomes.filter(
        (outcome) =>
          (betslipOutcomeInitialPrices[outcome.outcomeId] !== outcome.price && autoApprovalMode === "MANUAL") ||
          (betslipOutcomeInitialPrices[outcome.outcomeId] > outcome.price && autoApprovalMode === "AUTO_HIGHER"),
      ).length > 1,
    [betslipOutcomeInitialPrices, betslipData.model.outcomes],
  );

  const anyPriceChanged = useMemo(
    () =>
      betslipData.model.outcomes.filter(
        (outcome) =>
          (betslipOutcomeInitialPrices[outcome.outcomeId] !== outcome.price && autoApprovalMode === "MANUAL") ||
          (betslipOutcomeInitialPrices[outcome.outcomeId] > outcome.price && autoApprovalMode === "AUTO_HIGHER"),
      ).length > 0,
    [betslipOutcomeInitialPrices, betslipData.model.outcomes],
  );

  const confirmationAllowed = useMemo(() => {
    const hasOutcomes = betslipData.model.outcomes.length > 0;
    const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;

    let stake = 0;
    try {
      stake =
        activeTab === "SINGLE"
          ? betslipData.betData.singles.reduce((a, { stake }) => a + stake, 0)
          : betslipData.betData.multiples.find((m) => m.numSubBets === 1).stake;
    } catch (err) {} // harden it just in case

    const disabled =
      !isLoggedIn ||
      !allOutcomesValid ||
      !hasOutcomes ||
      stake <= 0 ||
      // minMaxLimitBreached ||
      betslipData?.model?.outcomes?.length > 25 ||
      anyPriceChanged ||
      submitInProgress;

    return !disabled;
  }, [activeTab, betslipData, isLoggedIn, submitInProgress]);

  const onAcceptOffenders = () => {
    // betslipData.model.outcomes
    //   .filter((outcome) => !outcome.valid)
    //   .forEach((outcome) => {
    //     onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false);
    //   });

    const affectedOutcomes = betslipData.model.outcomes.filter(
      (outcome) =>
        (betslipOutcomeInitialPrices[outcome.outcomeId] !== outcome.price && autoApprovalMode === "MANUAL") ||
        (betslipOutcomeInitialPrices[outcome.outcomeId] > outcome.price && autoApprovalMode === "AUTO_HIGHER"),
    );

    const updatedOutcomePrices = { ...betslipOutcomeInitialPrices };
    affectedOutcomes.forEach((x) => {
      updatedOutcomePrices[x.outcomeId] = x.price;
    });

    dispatch(persistLatestOutcomePrices({ betslipOutcomeInitialPrices: updatedOutcomePrices }));
  };

  const onDeleteOffenders = () => {
    betslipData.model.outcomes
      .filter(
        (outcome) =>
          // !outcome.valid ||
          (betslipOutcomeInitialPrices[outcome.outcomeId] !== outcome.price && autoApprovalMode === "MANUAL") ||
          (betslipOutcomeInitialPrices[outcome.outcomeId] > outcome.price && autoApprovalMode === "AUTO_HIGHER"),
      )
      .forEach((outcome) => {
        onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false);
      });
  };

  const onSubmitSingleBets = () => {
    if (cmsConfigBrandDetails.data?.singleWalletMode) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname, false, true, false, false);
    } else {
      onSubmitBetslip(dispatch, location.pathname, false, true, false, false);
    }
    setPlaceBetTime(dayjs(new Date()).format("MM-DD HH:mm"));
  };

  const onSubmitMultipleBet = () => {
    if (cmsConfigBrandDetails.data?.singleWalletMode) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname, false, false, true, false);
    } else {
      onSubmitBetslip(dispatch, location.pathname, false, false, true, false);
    }
    setPlaceBetTime(dayjs(new Date()).format("MM-DD HH:mm"));
  };

  return (
    <div className={classes["full-page-modal-footer"]}>
      <div className={classes["flex-input-wrapper"]}>
        {(anyPriceChanged || betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) !== -1) && (
          <>
            <div className={cx(classes["input-modal-alert"], classes["flex-al-center"])}>
              <span className={classes["icon-red-alert-circle"]} />
              <p>{t("ez.dividend_has_been_changed")}</p>
            </div>
            {multiplePriceChanged && (
              <div className={cx(classes["flex-al-center"], classes["flex-input-wrapper-buttons"])}>
                <button className={classes["primary"]} type="button" onClick={onAcceptOffenders}>
                  {t("ez.accept_changes")}
                </button>
                <button className={classes["outline"]} type="button" onClick={onDeleteOffenders}>
                  {t("ez.delete_changes")}
                </button>
              </div>
            )}
          </>
        )}
        <div className={classes["flex-input"]}>
          <label htmlFor="">
            {`${t("ez.total_bet_stake")}`}
            <small>
              {activeTab === "SINGLE"
                ? `${betslipData.model.outcomes.filter((x) => x.enabled).length}`
                : betslipData.betData.multiples.find((m) => m.numSubBets === 1)
                ? `${betslipData.betData.multiples.find((m) => m.numSubBets === 1).typeId}`
                : "\u00A0"}
            </small>
          </label>

          {activeTab === "SINGLE" && (
            <div
              className={classes["bottom-label"]}
              onClick={() =>
                activeTab === "SINGLE" &&
                isNotEmpty(betslipData.model.outcomes.filter((x) => x.enabled && x.valid)) &&
                setStakePanelStatus({
                  open: true,
                  outcomeId: undefined, // request the panel to open for "ALL" type 1s (singles)
                  typeId: 1,
                })
              }
            >
              <span>
                {betslipData.betData.singles
                  .filter((x) => betslipData.model.outcomes.find((y) => y.outcomeId === x.outcomeId)?.enabled)
                  .reduce((a, { stake }) => a + stake, 0)
                  .toLocaleString()}
              </span>
            </div>
          )}

          {activeTab === "MULTIPLE" && (
            <div
              className={cx(classes["bottom-label"], classes["multiple-bottom-label"])}
              onClick={() =>
                activeTab === "MULTIPLE" &&
                betslipData.betData.multiples.find((m) => m.numSubBets === 1) &&
                setStakePanelStatus({
                  open: true,
                  outcomeId: undefined, // request the panel to open for the current multiple, as identified a couple of lines above (MULTIPLEs)
                  typeId: betslipData.betData.multiples.find((m) => m.numSubBets === 1).typeId,
                })
              }
            >
              <span>
                {betslipData.model.outcomes.length > 0
                  ? betslipData.betData.multiples.find((m) => m.numSubBets === 1)?.stake.toLocaleString()
                  : "0"}
              </span>
            </div>
          )}
        </div>
        <div className={classes["flex-input"]}>
          <label htmlFor="">
            {t("ez.estimated_potential_win")}
            {activeTab === "MULTIPLE" && <small>{t("odds")}</small>}
          </label>
          <div
            className={cx(classes["flex-al-center"], classes["w-100"], {
              [classes["multi-bottom-label"]]: activeTab === "MULTIPLE",
            })}
          >
            {activeTab === "MULTIPLE" && (
              <div className={classes["bottom-label"]} style={{ marginRight: "8px" }}>
                <span>
                  {betslipData.model.outcomes.length > 0
                    ? modelUpdateInProgress
                      ? ""
                      : parseFloat(betslipData.betData.multiples.find((m) => m.numSubBets === 1)?.price || 0)
                          .toFixed(2)
                          .toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })
                    : "0"}
                </span>
              </div>
            )}

            <div className={classes["bottom-label"]}>
              <span>
                {betslipData.model.outcomes.length > 0
                  ? dirtyPotentialWin
                    ? ""
                    : activeTab === "SINGLE"
                    ? betslipData.betData.singles
                        .filter((x) => betslipData.model.outcomes.find((y) => y.outcomeId === x.outcomeId)?.enabled)
                        .reduce((a, { potentialWin }) => a + potentialWin, 0)
                        .toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })
                    : betslipData.betData.multiples
                        .find((m) => m.numSubBets === 1)
                        ?.potentialWin.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        })
                  : "0"}
              </span>
            </div>
          </div>
        </div>
        <div className={classes["submit-wrapper"]}>
          {!isLoggedIn && (
            <button className={classes["primary"]} type="button" onClick={onLoginRequest}>
              {t("login_into_account")}
            </button>
          )}
          {isLoggedIn && (
            <button
              className={classes["primary"]}
              disabled={!confirmationAllowed}
              type="button"
              onClick={() => (activeTab === "SINGLE" ? onSubmitSingleBets() : onSubmitMultipleBet())}
            >
              {t("ez.place_bet")}
            </button>
          )}
        </div>
      </div>

      {stakePanelStatus.open && (
        <StakePanel
          outcomeId={stakePanelStatus.outcomeId}
          typeId={stakePanelStatus.typeId}
          onClose={() => setStakePanelStatus({ open: false })}
        />
      )}

      {/* And... prevent the user touching anything... */}
      {submitInProgress && (
        <div style={{ height: "100vh", left: "0", position: "fixed", top: "0", width: "100vw", zIndex: "50000" }} />
      )}
    </div>
  );
};

MyBetslipFooter.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setPlaceBetTime: PropTypes.any.isRequired,
  setStakePanelStatus: PropTypes.func.isRequired,
  stakePanelStatus: PropTypes.object.isRequired,
};
export default React.memo(MyBetslipFooter);

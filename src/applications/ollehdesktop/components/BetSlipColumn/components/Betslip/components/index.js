import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import {
  makeGetBetslipData,
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
} from "../../../../../../../redux/reselect/betslip-selector";
import {
  getCmsConfigBettingMultipleStakeLimits,
  getCmsConfigBettingSingleStakeLimits,
  getCmsConfigBettingSpecialStakeLimits,
} from "../../../../../../../redux/reselect/cms-selector";
import {
  acknowledgeErrors,
  acknowledgeSubmission,
  onClearAllStakesHandler,
  onRefreshBetslipHandler,
} from "../../../../../../../utils/betslip-utils";

import BetslipMultiTab from "./BetslipMultiTab";
import BetslipSingleTab from "./BetslipSingleTab";
import BetslipSpecialTab from "./BetslipSpecialTab";

const Betslip = ({ betslipWidget }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getBetslipSubmitError = useMemo(makeGetBetslipSubmitError, []);
  const submitError = useSelector((state) => getBetslipSubmitError(state, location.pathname));

  const getBetslipSubmitConfirmation = useMemo(makeGetBetslipSubmitConfirmation, []);
  const submitConfirmation = useSelector((state) => getBetslipSubmitConfirmation(state, location.pathname));

  const currencyCode = useSelector((state) => state.auth.currencyCode);

  useEffect(() => {
    if (submitConfirmation) {
      window.alert("Your bet has been placed!");
      acknowledgeSubmission(dispatch, location.pathname, true);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  }, [submitConfirmation]);

  useEffect(() => {
    if (submitError) {
      window.alert(submitError);
      acknowledgeErrors(dispatch, location.pathname);
    }
  }, [submitError]);

  const [tabState, setTabState] = useState({
    multipleTabActive: false,
    showMultipleTab: false,
    showSingleTab: false,
    showSpecialsTab: false,
    singleTabActive: false,
    specialsTabActive: false,
  });

  const singleStakeLimits = useSelector(getCmsConfigBettingSingleStakeLimits);
  const multipleStakeLimits = useSelector(getCmsConfigBettingMultipleStakeLimits);
  const specialStakeLimits = useSelector(getCmsConfigBettingSpecialStakeLimits);

  const [minMaxLimitBreached, setMinMaxLimitBreached] = useState(false);

  // Check for betslip breaches
  useEffect(() => {
    let limitBreach = false;

    betslipData.betData.singles.forEach((s) => {
      if (
        s.stake > 0 &&
        (s.stake < singleStakeLimits[currencyCode].min || s.stake > singleStakeLimits[currencyCode].max)
      ) {
        limitBreach = true;
      }
    });
    betslipData.betData.multiples.forEach((m) => {
      if (m.typeId === betslipData.model.outcomes.length) {
        if (
          m.unitStake > 0 &&
          (m.unitStake < multipleStakeLimits[currencyCode].min || m.unitStake > multipleStakeLimits[currencyCode].max)
        ) {
          limitBreach = true;
        }
      }
    });
    betslipData.betData.multiples.forEach((m) => {
      if (m.typeId !== betslipData.model.outcomes.length) {
        if (
          m.stake > 0 &&
          (m.stake < specialStakeLimits[currencyCode].min || m.stake > specialStakeLimits[currencyCode].max)
        ) {
          limitBreach = true;
        }
      }
    });

    setMinMaxLimitBreached(limitBreach);

    return undefined;
  }, [betslipData, setMinMaxLimitBreached]);

  const onClearStakes = () => {
    onClearAllStakesHandler(dispatch, location.pathname);
  };

  useEffect(() => {
    const modifiedTabState = { ...tabState };

    const betslipModeStandard = true;

    modifiedTabState.showSingleTab =
      (betslipModeStandard && betslipData.betData.singles.length > 0) ||
      (!betslipModeStandard && betslipData.model.outcomes.length === 1);

    modifiedTabState.showMultipleTab =
      betslipData.betData.multiples.findIndex((m) => m.numSubBets === 1) > -1 &&
      betslipData?.model?.outcomes?.length <= parseInt(betslipWidget?.data?.maxSelections, 10);

    modifiedTabState.showSpecialsTab =
      betslipModeStandard &&
      betslipData.betData.multiples.findIndex((m) => m.numSubBets > 1) > -1 &&
      betslipData?.model?.outcomes?.length <= parseInt(betslipWidget?.data?.maxSelections, 10);

    // user had selected a tab - but this is no longer available... push him back to the next best candidate...
    if (
      (!modifiedTabState.showSpecialsTab && modifiedTabState.specialsTabActive) ||
      (!modifiedTabState.showMultipleTab && modifiedTabState.multipleTabActive) ||
      (!modifiedTabState.showSingleTab && modifiedTabState.singleTabActive)
    ) {
      modifiedTabState.singleTabActive = false;
      modifiedTabState.multipleTabActive = false;
      modifiedTabState.specialsTabActive = false;

      if (modifiedTabState.showMultipleTab) {
        modifiedTabState.multipleTabActive = true;
      } else if (modifiedTabState.showSingleTab) {
        modifiedTabState.singleTabActive = true;
      }
    }

    // If nothing selected - offer the best candidate...
    if (
      !modifiedTabState.singleTabActive &&
      !modifiedTabState.multipleTabActive &&
      !modifiedTabState.specialsTabActive
    ) {
      if (modifiedTabState.showMultipleTab) {
        modifiedTabState.multipleTabActive = true;
      } else if (modifiedTabState.showSingleTab) {
        modifiedTabState.singleTabActive = true;
      }
    }

    setTabState(modifiedTabState);
  }, [betslipData.betData.singles.length, betslipData.betData.multiples.length]);

  const onSingleTabClickHandler = () => {
    if (tabState.showSingleTab && !tabState.singleTabActive) {
      // if enabled, and not already active...
      setTabState({ ...tabState, multipleTabActive: false, singleTabActive: true, specialsTabActive: false });
    }
  };
  const onMultipleTabClickHandler = () => {
    if (tabState.showMultipleTab && !tabState.multipleTabActive) {
      // if enabled, and not already active...
      setTabState({ ...tabState, multipleTabActive: true, singleTabActive: false, specialsTabActive: false });
    }
  };
  const onSpecialTabClickHandler = () => {
    if (tabState.showSpecialsTab && !tabState.specialsTabActive) {
      // if enabled, and not already active...
      setTabState({ ...tabState, multipleTabActive: false, singleTabActive: false, specialsTabActive: true });
    }
  };

  const [betslipOddsChangeRule, setBetslipOddsChangeRule] = useState("ALL"); // NONE, HIGHER, ALL
  // Track the odds when the page is opened or first time the selection is added to a betslip
  const [initialOdds, setInitialOdds] = useState({});
  useEffect(() => {
    const updatedInitialOdds = { ...initialOdds };
    betslipData.model.outcomes.forEach((o) => {
      if (!updatedInitialOdds[o.outcomeId]) {
        updatedInitialOdds[o.outcomeId] = o.price;
      }
    });

    setInitialOdds(updatedInitialOdds);
  }, [betslipData.betData]);

  const [alerts, setAlerts] = useState({});
  useEffect(() => {
    const updatedAlerts = { ...alerts };

    // Validate blocked rules
    betslipData.model.outcomes.forEach((o) => {
      if (o.valid && updatedAlerts[o.outcomeId]?.blocked) {
        delete updatedAlerts[o.outcomeId].blocked;
      }
      if (!o.valid && !updatedAlerts[o.outcomeId]?.blocked) {
        updatedAlerts[o.outcomeId] = updatedAlerts[o.outcomeId]
          ? { ...updatedAlerts[o.outcomeId], blocked: true }
          : { blocked: true };
      }
    });

    // Validate price change rules
    if (betslipOddsChangeRule !== "ALL") {
      const singlesWithAlerts = betslipData.betData.singles.filter((s) => s.alerts.length > 0);
      singlesWithAlerts.forEach((s) => {
        if (!updatedAlerts[s.outcomeId]) {
          if (
            betslipOddsChangeRule === "NONE" ||
            (betslipOddsChangeRule === "HIGHER" &&
              betslipData.model.outcomes.find((o) => o.outcomeId === s.outcomeId)?.price < initialOdds[s.outcomeId])
          ) {
            updatedAlerts[s.outcomeId] = { priceChange: true };
          }
        }
      });
    }

    setAlerts(updatedAlerts);
  }, [betslipData.betData]);

  const clearAlerts = () => {
    setAlerts({});

    const updatedInitialOdds = {};
    betslipData.model.outcomes.forEach((o) => {
      updatedInitialOdds[o.outcomeId] = o.price;
    });

    setInitialOdds(updatedInitialOdds);
  };

  return (
    <>
      <div className={classes["right__column-header"]}>
        <span>{t("betslip")}</span>
      </div>
      <div className={classes["right__column-tabs"]}>
        <ul className={classes["right__column-tabs-list"]}>
          <li
            className={cx(
              { [classes["active"]]: tabState.singleTabActive },
              {
                [classes["disabled"]]: !tabState.showSingleTab,
              },
            )}
            onClick={onSingleTabClickHandler}
          >
            {t("betslip_panel.single")}
          </li>
          <li
            className={cx(
              { [classes["active"]]: tabState.multipleTabActive },
              {
                [classes["disabled"]]: !tabState.showMultipleTab,
              },
            )}
            onClick={onMultipleTabClickHandler}
          >
            {t("betslip_panel.multi")}
          </li>
          <li
            className={cx(
              { [classes["active"]]: tabState.specialsTabActive },
              {
                [classes["disabled"]]: !tabState.showSpecialsTab,
              },
            )}
            onClick={onSpecialTabClickHandler}
          >
            {t("betslip_panel.special")}
          </li>
        </ul>
        <div className={classes["right__column-tabs-content"]}>
          <BetslipSingleTab
            active={tabState.singleTabActive}
            alerts={alerts}
            betslipData={betslipData}
            betslipWidget={betslipWidget}
            clearAlerts={clearAlerts}
            initialOdds={initialOdds}
            minMaxLimitBreached={minMaxLimitBreached}
          />

          <BetslipMultiTab
            active={tabState.multipleTabActive}
            alerts={alerts}
            betslipData={betslipData}
            betslipWidget={betslipWidget}
            clearAlerts={clearAlerts}
            initialOdds={initialOdds}
            minMaxLimitBreached={minMaxLimitBreached}
          />

          <BetslipSpecialTab
            active={tabState.specialsTabActive}
            alerts={alerts}
            betslipData={betslipData}
            betslipWidget={betslipWidget}
            clearAlerts={clearAlerts}
            initialOdds={initialOdds}
            minMaxLimitBreached={minMaxLimitBreached}
          />
        </div>
      </div>
      <div className={classes["right__column-odds"]}>
        <p>Accept bet placement for the following odds changes</p>
        <div className={classes["right__column-odds-checks"]}>
          <label className={classes["odds__toggle"]} htmlFor="odds-none">
            <input
              checked={betslipOddsChangeRule === "NONE"}
              className={classes["odds__toggle-input"]}
              id="odds-none"
              type="checkbox"
              onClick={() => setBetslipOddsChangeRule("NONE")}
            />
            <span className={classes["odds__toggle-label"]}>
              <span className={classes["odds__toggle-text"]}>None</span>
            </span>
          </label>
          <label className={classes["odds__toggle"]} htmlFor="odds-higher">
            <input
              checked={betslipOddsChangeRule === "HIGHER"}
              className={classes["odds__toggle-input"]}
              id="odds-higher"
              type="checkbox"
              onClick={() => setBetslipOddsChangeRule("HIGHER")}
            />
            <span className={classes["odds__toggle-label"]}>
              <span className={classes["odds__toggle-text"]}>Higher odds</span>
            </span>
          </label>
          <label className={classes["odds__toggle"]} htmlFor="odds-any">
            <input
              checked={betslipOddsChangeRule === "ALL"}
              className={classes["odds__toggle-input"]}
              id="odds-any"
              type="checkbox"
              onClick={() => setBetslipOddsChangeRule("ALL")}
            />
            <span className={classes["odds__toggle-label"]}>
              <span className={classes["odds__toggle-text"]}>Any odds</span>
            </span>
          </label>
        </div>
      </div>
    </>
  );
};

Betslip.propTypes = {
  betslipWidget: PropTypes.object.isRequired,
};

export default React.memo(Betslip);

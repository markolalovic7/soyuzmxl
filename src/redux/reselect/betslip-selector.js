import { createSelector } from "@reduxjs/toolkit";
import { isNotEmpty } from "utils/lodash";

import { isBrVirtualSportsLocation } from "../../utils/betradar-virtual-utils";
import { isKrVirtualSportsLocation } from "../../utils/kiron-virtual-utils";

const getBetslipData = createSelector(
  (state) => state.betslip?.betslipData,
  (betslipData) => betslipData || {},
);

const getBrBetslipData = createSelector(
  (state) => state.betslip?.brVirtualBetslipData,
  (betslipData) => betslipData || {},
);

const getKrBetslipData = createSelector(
  (state) => state.betslip?.krVirtualBetslipData,
  (betslipData) => betslipData || {},
);

const getBetslipOutcomes = createSelector(
  (state) => state.betslip?.betslipData?.model?.outcomes,
  (outcomes) => outcomes || [],
);

const getBetslipOutcomeIds = createSelector(getBetslipOutcomes, (outcomes) =>
  outcomes.map((outcome) => outcome.outcomeId),
);

const getBrVirtualBetslipOutcomes = createSelector(
  (state) => state.betslip?.brVirtualBetslipData?.model?.outcomes,
  (outcomes) => outcomes || [],
);

const getBrVirtualBetslipOutcomeIds = createSelector(getBrVirtualBetslipOutcomes, (outcomes) =>
  outcomes.map((outcome) => outcome.outcomeId),
);

const getKrVirtualBetslipOutcomes = createSelector(
  (state) => state.betslip?.krVirtualBetslipData?.model?.outcomes,
  (outcomes) => outcomes || [],
);

const getKrVirtualBetslipOutcomeIds = createSelector(getKrVirtualBetslipOutcomes, (outcomes) =>
  outcomes.map((outcome) => outcome.outcomeId),
);

export const getJackpotBetslipData = createSelector(
  (state) => state.betslip?.jackpotBetslipData,
  (jackpotBetslipData) => jackpotBetslipData || {},
);

export const makeGetJackpotBetslipOutcomesByJackpotId = () =>
  createSelector(
    getJackpotBetslipData,
    (_, jackpotId) => jackpotId,
    (jackpotBetslipData, jackpotId) =>
      isNotEmpty(jackpotBetslipData[jackpotId]) ? jackpotBetslipData[jackpotId].model.outcomes : [],
  );

export const makeGetJackpotBetslipDataByJackpotId = () =>
  createSelector(
    getJackpotBetslipData,
    (_, jackpotId) => jackpotId,
    (jackpotBetslipData, jackpotId) => jackpotBetslipData[jackpotId],
  );

export const makeGetBetslipData = () =>
  createSelector(
    getBetslipData,
    getBrBetslipData,
    getKrBetslipData,
    (_, pathname) => pathname,
    (betslipData, brBetslipData, krBetslipData, pathname) => {
      if (isBrVirtualSportsLocation(pathname)) return brBetslipData;
      if (isKrVirtualSportsLocation(pathname)) return krBetslipData;

      return betslipData;
    },
  );

export const makeGetBetslipModelUpdateInProgress = () =>
  createSelector(
    (state) => state.betslip?.modelUpdateInProgress,
    (state) => state.betslip?.brVirtualModelUpdateInProgress,
    (state) => state.betslip?.krVirtualModelUpdateInProgress,
    (_, pathname) => pathname,
    (modelUpdateInProgress, brVirtualModelUpdateInProgress, krVirtualModelUpdateInProgress, pathname) => {
      if (isBrVirtualSportsLocation(pathname)) return brVirtualModelUpdateInProgress;
      if (isKrVirtualSportsLocation(pathname)) return krVirtualModelUpdateInProgress;

      return modelUpdateInProgress;
    },
  );

export const makeGetBetslipRefreshErrors = () =>
  createSelector(
    (state) => state.betslip?.refreshErrors,
    (state) => state.betslip?.brVirtualRefreshErrors,
    (state) => state.betslip?.krVirtualRefreshErrors,
    (_, pathname) => pathname,
    (refreshErrors, brVirtualRefreshErrors, krVirtualRefreshErrors, pathname) => {
      if (isBrVirtualSportsLocation(pathname)) return brVirtualRefreshErrors;
      if (isKrVirtualSportsLocation(pathname)) return krVirtualRefreshErrors;

      return refreshErrors;
    },
  );

export const makeGetBetslipSubmitConfirmation = () =>
  createSelector(
    (state) => state.betslip?.submitConfirmation,
    (state) => state.betslip?.brVirtualSubmitConfirmation,
    (state) => state.betslip?.krVirtualSubmitConfirmation,
    (_, pathname) => pathname,
    (submitConfirmation, brVirtualSubmitConfirmation, krVirtualSubmitConfirmation, pathname) => {
      if (isBrVirtualSportsLocation(pathname)) return brVirtualSubmitConfirmation;
      if (isKrVirtualSportsLocation(pathname)) return krVirtualSubmitConfirmation;

      return submitConfirmation;
    },
  );

export const makeGetBetslipSubmitError = () =>
  createSelector(
    (state) => state.betslip?.submitError,
    (state) => state.betslip?.brVirtualSubmitError,
    (state) => state.betslip?.krVirtualSubmitError,
    (_, pathname) => pathname,
    (submitError, brVirtualSubmitError, krVirtualSubmitError, pathname) => {
      if (isBrVirtualSportsLocation(pathname)) return brVirtualSubmitError;
      if (isKrVirtualSportsLocation(pathname)) return krVirtualSubmitError;

      return submitError;
    },
  );

export const makeGetBetslipSubmitInProgress = () =>
  createSelector(
    (state) => state.betslip?.submitInProgress,
    (state) => state.betslip?.brVirtualSubmitInProgress,
    (state) => state.betslip?.krVirtualSubmitInProgress,
    (_, pathname) => pathname,
    (submitInProgress, brVirtualSubmitInProgress, krVirtualSubmitInProgress, pathname) => {
      if (isBrVirtualSportsLocation(pathname)) return brVirtualSubmitInProgress;
      if (isKrVirtualSportsLocation(pathname)) return krVirtualSubmitInProgress;

      return submitInProgress;
    },
  );

export const makeGetBetslipWarnings = () =>
  createSelector(
    (state) => state.betslip?.warnings,
    (state) => state.betslip?.brVirtualWarnings,
    (state) => state.betslip?.krVirtualWarnings,
    (_, pathname) => pathname,
    (warnings, brVirtualWarnings, krVirtualWarnings, pathname) => {
      if (isBrVirtualSportsLocation(pathname)) return brVirtualWarnings;
      if (isKrVirtualSportsLocation(pathname)) return krVirtualWarnings;

      return warnings;
    },
  );

export const makeGetBetslipOutcomes = () =>
  createSelector(
    getBetslipOutcomes,
    getBrVirtualBetslipOutcomes,
    getKrVirtualBetslipOutcomes,
    (_, pathname) => pathname,
    (outcomes, brOutcomes, krOutcomes, pathname) => {
      if (isBrVirtualSportsLocation(pathname)) return brOutcomes;
      if (isKrVirtualSportsLocation(pathname)) return krOutcomes;

      return outcomes;
    },
  );

export const makeGetBetslipOutcomeIds = () =>
  createSelector(
    getBetslipOutcomeIds,
    getBrVirtualBetslipOutcomeIds,
    getKrVirtualBetslipOutcomeIds,
    (_, pathname) => pathname,
    (outcomes, brOutcomes, krOutcomes, pathname) => {
      if (isBrVirtualSportsLocation(pathname)) return brOutcomes;
      if (isKrVirtualSportsLocation(pathname)) return krOutcomes;

      return outcomes;
    },
  );

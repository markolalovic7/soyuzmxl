import { isEmpty } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import useScrollLock from "use-scroll-lock";

import { useBetslipData } from "../../../../hooks/betslip-hooks";
import {
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
} from "../../../../redux/reselect/betslip-selector";
import { clearCashoutState, getActiveBetDetail } from "../../../../redux/slices/cashoutSlice";
import { acknowledgeErrors, acknowledgeSubmission, onClearBetslipHandler } from "../../../../utils/betslip-utils";
import classes from "../../scss/ezbet.module.scss";
import BetslipErrorModal from "../BetslipModal/components/BetslipErrorModal";
import BetslipSubmissionErrorModal from "../BetslipModal/components/BetslipSubmissionErrorModal";
import BetslipSuccessModal from "../BetslipModal/components/BetslipSuccessModal";
import CashOutQuotationModal from "../BetslipModal/components/CashOutQuotationModal";
import DeleteConfirmationModal from "../BetslipModal/components/DeleteConfirmationModal";
import MyBets from "../BetslipModal/components/MyBets/MyBets";
import MyBetslip from "../BetslipModal/components/MyBetslip/MyBetslip";

import DesktopBetslipHeader from "./components/DesktopBetslipHeader";
import MyBetslipFooter from "./components/MyBetslipFooter";

const DesktopBetslipCard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  // const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("SINGLE");
  // const [openConfirmBetPanel, setOpenConfirmBetPanel] = useState(false);

  const [stakePanelStatus, setStakePanelStatus] = useState({ open: false });

  // refresh betslips
  const betslipData = useBetslipData(dispatch, false);

  const isLoggedIn = useSelector((state) => state.auth.loggedIn);

  const activeBetCount = useSelector((state) => state.cashout.activeBetCount);

  const [deleteConfirmation, setDeleteConfirmation] = React.useState(false);
  const [deleteSelectionConfirmationPanel, setOpenDeleteSelectionConfirmationPanel] = React.useState(false);

  // const [outcomes, setOutcomes] = useState([]);
  const [openCashoutQuotationModal, setOpenCashoutQuotationModal] = useState(false);

  const [activeBet, setActiveBet] = useState(null);

  const cashoutWasSuccessful = useSelector((state) => state.cashout.cashoutConfirmed);

  const getBetslipSubmitError = useMemo(makeGetBetslipSubmitError, []);
  const submitError = useSelector((state) => getBetslipSubmitError(state, location.pathname));

  const getBetslipSubmitConfirmation = useMemo(makeGetBetslipSubmitConfirmation, []);
  const submitConfirmation = useSelector((state) => getBetslipSubmitConfirmation(state, location.pathname));

  const [sameMarketVisible, setSameMarketVisible] = React.useState(false);
  const [differentMarketVisible, setDifferentMarketVisible] = React.useState(false);
  const [minBetsVisible, setMinBetsVisible] = React.useState(false);
  const [networkStatusUnstable, setNetworkStatusUnstable] = React.useState(false);
  const [placeBetTime, setPlaceBetTime] = React.useState();

  const [cashOutScreenVisible, setCashOutScreenVisible] = useState(false);

  useEffect(() => {
    // When the tab is selected, load the bet history (first time the user opens the betslip, and every successive time the My Bets tab is loaded)
    if (isLoggedIn && cashOutScreenVisible && !cashoutWasSuccessful) {
      dispatch(getActiveBetDetail());
      const intervalId = setInterval(() => {
        dispatch(getActiveBetDetail());
      }, 5000);

      return () => clearInterval(intervalId);
    }

    return undefined;
  }, [cashOutScreenVisible, cashoutWasSuccessful, isLoggedIn]);

  // protection against logout during cashout phase.
  useEffect(() => {
    if (!isLoggedIn) {
      // Make sure we close the cashout pages.
      setOpenCashoutQuotationModal(false);
      setCashOutScreenVisible(false);
    }
  }, [isLoggedIn]);

  // Effect to push the user to the single tab if there are insufficient outcomes for a multiple
  useEffect(() => {
    // if we are in the multiple tab, and not in the cashout screen
    if (activeTab === "MULTIPLE" && !cashOutScreenVisible) {
      // check if there is any outcome pending definition (after recently added)
      if (betslipData.model.outcomes.findIndex((x) => !x.marketId) === -1) {
        if (isEmpty(betslipData.betData.multiples.filter((x) => x.numSubBets === 1))) {
          setActiveTab("SINGLE");
          // in case the stake panel was open, close it
          setStakePanelStatus((prevStatus) => ({
            ...prevStatus,
            outcomeId: undefined, // request the panel to open for "ALL" type 1s (singles)
            typeId: 1,
          }));
        }
      }
    }
  }, [activeTab, betslipData, cashOutScreenVisible]);

  const onMultipleTabClickHandler = () => {
    const selectionEventIds = betslipData.model.outcomes.map((x) => x.eventId);
    const selectionMarketIds = betslipData.model.outcomes.map((x) => x.marketId);

    if (betslipData.model.outcomes.length === 1) {
      setMinBetsVisible(true);
    } else if (selectionMarketIds.length !== [...new Set(selectionMarketIds)].length) {
      setSameMarketVisible(true);
      // show modal for "same game / same market"
    } else if (selectionEventIds.length !== [...new Set(selectionEventIds)].length) {
      setDifferentMarketVisible(true);
      // show modal for "same game / different market"
    } else {
      setActiveTab("MULTIPLE");
      // reset this in case the panel was already open
      setStakePanelStatus({
        ...stakePanelStatus,
        outcomeId: undefined, // request the panel to open for the current multiple, as identified a couple of lines above (MULTIPLEs)
        typeId: betslipData.betData.multiples.find((m) => m.numSubBets === 1).typeId,
      });
    }
  };

  useScrollLock(
    openCashoutQuotationModal ||
      deleteSelectionConfirmationPanel ||
      deleteConfirmation ||
      minBetsVisible ||
      differentMarketVisible ||
      networkStatusUnstable ||
      sameMarketVisible,
  );

  return (
    <>
      {deleteConfirmation && (
        <DeleteConfirmationModal
          onClose={() => setDeleteConfirmation(false)}
          onOk={() => {
            onClearBetslipHandler(dispatch, location.pathname);
            setDeleteConfirmation(false);
          }}
        />
      )}

      {(minBetsVisible || differentMarketVisible || networkStatusUnstable || sameMarketVisible) && (
        <BetslipErrorModal
          differentMarketVisible={differentMarketVisible}
          minBetsVisible={minBetsVisible}
          networkStatusUnstable={networkStatusUnstable}
          sameMarketVisible={sameMarketVisible}
          onClose={() => {
            setSameMarketVisible(false);
            setDifferentMarketVisible(false);
            setMinBetsVisible(false);
            if (networkStatusUnstable) {
              setOpenCashoutQuotationModal(false);
              setActiveBet(undefined);
              dispatch(clearCashoutState());
              dispatch(getActiveBetDetail());
              setNetworkStatusUnstable(false);
            }
          }}
        />
      )}

      <div className={classes["desktop-betslip-card"]}>
        <DesktopBetslipHeader
          activeTab={activeTab}
          cashOutScreenVisible={cashOutScreenVisible}
          setActiveTab={setActiveTab}
          setCashOutScreenVisible={setCashOutScreenVisible}
          setDeleteConfirmation={setDeleteConfirmation}
          setStakePanelStatus={setStakePanelStatus}
          stakePanelStatus={stakePanelStatus}
          onMultipleTabClickHandler={onMultipleTabClickHandler}
        />
        {cashOutScreenVisible && activeBetCount > 0 && (
          <MyBets
            activeBet={activeBet}
            setActiveBet={setActiveBet}
            setNetworkStatusUnstable={setNetworkStatusUnstable}
            setOpenCashoutQuotationModal={setOpenCashoutQuotationModal}
            setStakePanelStatus={setStakePanelStatus}
            stakePanelStatus={stakePanelStatus}
          />
        )}

        {!cashOutScreenVisible && (
          <MyBetslip
            activeTab={activeTab}
            deleteSelectionConfirmationPanel={deleteSelectionConfirmationPanel}
            setActiveTab={setActiveTab}
            setOpenDeleteSelectionConfirmationPanel={setOpenDeleteSelectionConfirmationPanel}
            setStakePanelStatus={setStakePanelStatus}
          />
        )}

        {!cashOutScreenVisible && (
          <MyBetslipFooter
            activeTab={activeTab}
            setPlaceBetTime={setPlaceBetTime}
            setStakePanelStatus={setStakePanelStatus}
            stakePanelStatus={stakePanelStatus}
          />
        )}
      </div>

      {/* {openConfirmBetPanel && ( */}
      {/*  // <BetslipSummaryModal activeTab={activeTab} onClose={() => setOpenConfirmBetPanel(false)} /> */}
      {/*    */}
      {/* )} */}

      {submitConfirmation && (
        <BetslipSuccessModal
          activeTab={activeTab}
          placeBetTime={placeBetTime}
          onClose={() => {
            acknowledgeSubmission(dispatch, location.pathname, true);
          }}
        />
      )}
      {submitError && (
        <BetslipSubmissionErrorModal
          message={submitError}
          onClose={() => {
            acknowledgeErrors(dispatch, location.pathname);
            // onClose();
          }}
        />
      )}

      {openCashoutQuotationModal && !networkStatusUnstable && (
        <CashOutQuotationModal
          forwardedBet={activeBet}
          setCashOutModalOpen={setOpenCashoutQuotationModal}
          setCashOutScreenVisible={setCashOutScreenVisible}
          setNetworkStatusUnstable={setNetworkStatusUnstable}
        />
      )}
    </>
  );
};

export default React.memo(DesktopBetslipCard);

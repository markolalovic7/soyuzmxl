import cx from "classnames";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { useBetslipData } from "../../../../hooks/betslip-hooks";
import {
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
} from "../../../../redux/reselect/betslip-selector";
import { acknowledgeErrors, acknowledgeSubmission, onClearBetslipHandler } from "../../../../utils/betslip-utils";

import BetslipErrorModal from "./components/BetslipErrorModal";
import BetslipHeader from "./components/BetslipHeader";
import BetslipSubmissionErrorModal from "./components/BetslipSubmissionErrorModal";
import BetslipSuccessModal from "./components/BetslipSuccessModal";
import CashOutQuotationModal from "./components/CashOutQuotationModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import MyBets from "./components/MyBets/MyBets";
import MyBetslipFooter from "./components/MyBetslip/components/MyBetslipFooter";
import MyBetslip from "./components/MyBetslip/MyBetslip";

import classes from "applications/ezbet/scss/ezbet.module.scss";
import { clearCashoutState, getActiveBetDetail } from "redux/slices/cashoutSlice";

const BetslipModal = ({ cashOutScreenVisible, onClose, setCashOutScreenVisible }) => {
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
    }
  };

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

      <div
        className={cx(classes["full-page-modal"], classes["betslip-modal-wrapper"])}
        id="fullPageModal"
        style={{ display: "block" }}
      >
        <div className={cx(classes["full-page-modal-content"], classes["full-page-betslip-modal"])}>
          <BetslipHeader
            activeTab={activeTab}
            cashOutScreenVisible={cashOutScreenVisible}
            setActiveTab={setActiveTab}
            setCashOutScreenVisible={setCashOutScreenVisible}
            setDeleteConfirmation={setDeleteConfirmation}
            onClose={onClose}
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
            onClose();
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

BetslipModal.propTypes = {
  cashOutScreenVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setCashOutScreenVisible: PropTypes.func.isRequired,
};

export default React.memo(BetslipModal);

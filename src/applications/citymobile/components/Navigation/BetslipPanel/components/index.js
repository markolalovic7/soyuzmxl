import Spinner from "applications/common/components/Spinner";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useScrollLock from "use-scroll-lock";

import { getAuthIsIframe, getAuthLoggedIn } from "../../../../../../redux/reselect/auth-selector";
import {
  makeGetBetslipOutcomeIds,
  makeGetBetslipSubmitInProgress,
} from "../../../../../../redux/reselect/betslip-selector";
import { getActiveBetCount, getActiveBetDetail } from "../../../../../../redux/slices/cashoutSlice";
import classes from "../../../../scss/citymobile.module.scss";

import Betslip from "./Betslip";
import MyBets from "./MyBets/components";

// 67 being the nobbaggu header, no allocation made for our own header
const NOBBAGGU_HEADER_HEIGHT = 67;
const OUR_OWN_HEADER_HEIGHT = 0;
const TOP_MARGIN = 40;
const BOTTOM_MARGIN = 40;

const BetslipPanel = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const loggedIn = useSelector(getAuthLoggedIn);

  const isIframe = useSelector(getAuthIsIframe);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const getSubmitInProgress = useMemo(makeGetBetslipSubmitInProgress, []);
  const submitInProgress = useSelector((state) => getSubmitInProgress(state, location.pathname));

  const [opened, setOpened] = useState(false);
  const [activeTab, setActiveTab] = useState("BET");
  const activeBetCount = useSelector((state) => state.cashout.activeBetCount);

  // Refresh betslips
  const dispatch = useDispatch();

  useEffect(() => {
    // When the tab is selected, load the bet history
    if (loggedIn) {
      dispatch(getActiveBetDetail({ compactSpread: true }));
    }
  }, [loggedIn]);

  // my bets related

  // When loading the page for the first time, or logging in, find out the pending bets...

  useEffect(() => {
    if (loggedIn) {
      dispatch(getActiveBetCount());
    }
  }, [dispatch, loggedIn]);

  useEffect(() => {
    // When the tab is selected, load the bet history
    if (activeTab === "MYBETS") {
      dispatch(getActiveBetDetail({ compactSpread: true }));
    }
  }, [activeTab, dispatch]);

  // end my bets related

  const onBackDropClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpened(false);
    }
  };

  // Never do this when in iframe mode. It is not required when in iframe mode (as we supress scrolls and delegate scrolling on the parent frame),
  // plus it causes unpredictable side effects (scrolls stop working or freeze)
  useScrollLock(!isIframe && opened); // lock / unlock the scroll. Use the data-scroll-lock-scrollable attribute on whatever element you want to enable scrolling

  const pathname = location.pathname;
  const show = !(
    pathname.includes("az") ||
    pathname.includes("search") ||
    pathname.includes("results") ||
    pathname.includes("settings")
  );
  const selectionCounter = betslipOutcomeIds.length;

  // Just for test in iframe mode - do not commit for production
  // useEffect(() => {
  //   setTimeout(() => setOpened(true), 5000);
  // }, []);

  useEffect(() => {
    window.parent.postMessage(
      {
        action: "app.betslip_button_status",
        selectionCounter,
        show: show && !opened, // show only when the panel is not open (and provided we are not in the "forbidden" paths.
      },
      "*",
    );
  }, [opened, show, selectionCounter]);

  React.useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        const data = event.data || {};

        if (data.action === "app.betslip_panel_toggle") {
          console.log("Received toggle");
          setOpened((prevState) => !prevState);
        }
      },
      false,
    );
  }, []); // never re-add

  React.useEffect(() => {
    window.parent.postMessage(
      {
        action: "app.scroll_lock",
        code: opened ? "LOCK" : "UNLOCK",
      },
      "*",
    );
  }, [opened]);

  const [betslipMaxHeight, setBetslipMaxHeight] = useState(window.innerHeight);
  const [betslipScrollTop, setBetslipScrollTop] = useState(0);

  React.useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        const data = event.data || {};

        if (data.action === "app.parent_frame_height") {
          // console.log("Parent frame height updated");
          setBetslipMaxHeight(Number(data.value));
        }
      },
      false,
    );
  }, []); // never re-add

  React.useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        const data = event.data || {};

        if (data.action === "app.parent_frame_scroll_top") {
          // console.log("Parent frame scroll updated");
          setBetslipScrollTop(Math.max(Number(data.value), 0));
        }
      },
      false,
    );
  }, []); // never re-add

  return (
    <>
      {/* {requestBetSubmission ? */}
      {/*    : null */}
      {/* } */}

      {submitInProgress ? <Spinner className={classes.loader} /> : null}
      {/* {submitConfirmation ? */}
      {/*    : null */}
      {/* } */}
      {/* {submitError ? */}
      {/*    : null */}
      {/* } */}

      <div
        className={`${classes["object"]} ${!isIframe && betslipOutcomeIds.length > 0 ? classes["active"] : ""}`}
        onClick={() => setOpened(true)}
      >
        <span className={classes["object__square"]} />
        <span className={classes["object__count"]}>{betslipOutcomeIds.length}</span>
      </div>
      <div
        data-scroll-lock-scrollable
        className={`${classes["bet"]} ${opened ? classes["active"] : ""}`}
        onClick={onBackDropClick}
      >
        <div
          className={`${classes["bet__content"]} ${opened ? classes["active"] : ""}`}
          style={{ backgroundColor: "transparent", overflowY: "hidden" }}
          onClick={onBackDropClick}
        >
          <div
            style={{
              backgroundColor: "#fff",
              position: "absolute",
              top: loggedIn
                ? betslipScrollTop + TOP_MARGIN
                : Math.max(betslipScrollTop - (NOBBAGGU_HEADER_HEIGHT + OUR_OWN_HEADER_HEIGHT), 0) + TOP_MARGIN,
              width: "100%",
            }}
          >
            <div className={classes["bet__tabs"]}>
              <div
                className={`${classes["bet__tab"]} ${activeTab === "BET" ? classes["active"] : ""}`}
                onClick={() => setActiveTab("BET")}
              >
                {t("city.mob_navigation.bet_slip")}
              </div>
              {loggedIn ? (
                <div
                  className={`${classes["bet__tab"]} ${activeTab === "MYBETS" ? classes["active"] : ""}`}
                  onClick={() => setActiveTab("MYBETS")}
                >
                  {`${t("city.mob_navigation.my_bets")} ${activeBetCount > 0 ? `(${activeBetCount})` : ""}`}
                </div>
              ) : null}
            </div>
            <div className={`${classes["betslip"]} ${activeTab === "BET" ? classes["active"] : ""}`}>
              <Betslip
                betslipMaxHeight={
                  betslipMaxHeight -
                  (loggedIn
                    ? NOBBAGGU_HEADER_HEIGHT + Math.max(OUR_OWN_HEADER_HEIGHT - betslipScrollTop, 0)
                    : Math.max(NOBBAGGU_HEADER_HEIGHT + OUR_OWN_HEADER_HEIGHT - betslipScrollTop, 0)) -
                  TOP_MARGIN -
                  BOTTOM_MARGIN - // floating margin as requested by HitBet on 16 June 2022
                  0 // buffer for cosmetic reasons
                }
              />
            </div>
            <div
              className={`${classes["mybets"]} ${activeTab === "MYBETS" ? classes["active"] : ""}`}
              style={{
                maxHeight:
                  betslipMaxHeight -
                  Math.max(NOBBAGGU_HEADER_HEIGHT + OUR_OWN_HEADER_HEIGHT - betslipScrollTop, 0) -
                  TOP_MARGIN -
                  BOTTOM_MARGIN - // floating margin as requested by HitBet on 16 June 2022
                  10, // buffer for cosmetic reasons
                overflowY: "auto",
              }}
            >
              <MyBets
                betslipMaxHeight={
                  betslipMaxHeight -
                  Math.max(NOBBAGGU_HEADER_HEIGHT + OUR_OWN_HEADER_HEIGHT - betslipScrollTop, 0) -
                  TOP_MARGIN -
                  BOTTOM_MARGIN - // floating margin as requested by HitBet on 16 June 2022
                  10 // buffer for cosmetic reasons
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BetslipPanel;

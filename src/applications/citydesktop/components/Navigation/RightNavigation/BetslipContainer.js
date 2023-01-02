import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getActiveBetCount } from "../../../../../redux/slices/cashoutSlice";

import Betslip from "./Betslip";
import MyBets from "./MyBets";

// 72 being the nobbaggu header, 65 Being our own header
const NOBBAGGU_HEADER_HEIGHT = 72;
const OUR_OWN_HEADER_HEIGHT = 64;

const BetslipContainer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const loggedIn = useSelector((state) => state.auth.loggedIn);

  const [activeTab, setActiveTab] = useState("BETSLIP"); // BETSLIP, MYBETS

  const activeBetCount = useSelector((state) => state.cashout.activeBetCount);

  useEffect(() => {
    if (loggedIn) {
      dispatch(getActiveBetCount());
      const interval = setInterval(() => {
        // Refresh periodically
        dispatch(getActiveBetCount());
      }, 3000);

      return () => clearInterval(interval);
    }

    return undefined;
  }, [loggedIn]);

  const [betslipMaxHeight, setBetslipMaxHeight] = useState(10000000000000);
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
          setBetslipScrollTop(Number(data.value));
        }
      },
      false,
    );
  }, []); // never re-add

  return (
    <div
      className={classes["bet"]}
      style={{ top: Math.max(betslipScrollTop - (NOBBAGGU_HEADER_HEIGHT + OUR_OWN_HEADER_HEIGHT), 0) }}
    >
      <div className={classes["bet__tabs"]}>
        <div
          className={`${classes["bet__tab"]} ${activeTab === "BETSLIP" ? classes["active"] : ""}`}
          onClick={() => setActiveTab("BETSLIP")}
        >
          {t("betslip")}
        </div>
        {loggedIn ? (
          <div
            className={`${classes["bet__tab"]} ${activeTab === "MYBETS" ? classes["active"] : ""}`}
            onClick={() => setActiveTab("MYBETS")}
          >
            {`${t("my_bets")} (${activeBetCount})`}
          </div>
        ) : null}
      </div>

      {activeTab === "BETSLIP" ? (
        <Betslip
          betslipMaxHeight={
            betslipMaxHeight - Math.max(NOBBAGGU_HEADER_HEIGHT + OUR_OWN_HEADER_HEIGHT - betslipScrollTop, 0) - 10
          }
        />
      ) : null}

      {activeTab === "MYBETS" && (
        <MyBets
          betslipMaxHeight={
            betslipMaxHeight - Math.max(NOBBAGGU_HEADER_HEIGHT + OUR_OWN_HEADER_HEIGHT - betslipScrollTop, 0) - 40
          }
        />
      )}
    </div>
  );
};

export default React.memo(BetslipContainer);

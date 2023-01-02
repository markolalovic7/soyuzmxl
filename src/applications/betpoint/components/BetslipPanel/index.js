import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";

import classes from "../../scss/betpoint.module.scss";

import BetslipBody from "./BetslipBody";
import CashoutBody from "./CashoutBody";

const BetslipPanel = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("BETSLIP"); // BETSLIP, CASHOUT

  return (
    <div className={classes["betting-tickets"]}>
      <div className={classes["betting-tickets__header"]}>
        <div className={classes["betting-tickets__tabs"]}>
          <div
            className={cx(classes["betting-tickets__tab"], classes["betting-tickets__betslip"], {
              [classes["active"]]: activeTab === "BETSLIP",
            })}
            onClick={() => setActiveTab("BETSLIP")}
          >
            <h3 className={classes["betting-tickets__title"]}>Betslip</h3>
          </div>
          <div
            className={cx(classes["betting-tickets__tab"], classes["betting-tickets__cashout"], {
              [classes["active"]]: activeTab === "CASHOUT",
            })}
            onClick={() => setActiveTab("CASHOUT")}
          >
            <h3 className={classes["betting-tickets__title"]}>Cash Out</h3>
          </div>
        </div>
        <div className={classes["betting-tickets__cross"]}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
      <div className={cx(classes["betting-tickets__content"], classes["open"])}>
        {activeTab === "BETSLIP" && <BetslipBody />}
        {activeTab === "CASHOUT" && <CashoutBody />}
      </div>
    </div>
  );
};

export default React.memo(BetslipPanel);

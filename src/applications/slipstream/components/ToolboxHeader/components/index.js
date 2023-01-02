import { faBuffer } from "@fortawesome/free-brands-svg-icons";
import {
  faClipboardList,
  faPrint,
  faSignOutAlt,
  faTicketAlt,
  faTools,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { logout } from "../../../../../redux/actions/auth-actions";
import {
  getRetailPlayerAccountBalance,
  getRetailSelectedPlayerAccountData,
  getRetailSelectedPlayerAccountId,
  getRetailTillDetails,
} from "../../../../../redux/reselect/retail-selector";
import { setRetailPlayerAccountId } from "../../../../../redux/slices/retailAccountSlice";
import LogoPNG from "../../../img/logo.png";
import classes from "../../../scss/slipstream.module.scss";
import { testPrint } from "../../../utils/printer";

const ToolboxHeader = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isToolsHeaderOpen, setIsToolsHeaderOpen] = useState(false);

  const selectedPlayerId = useSelector(getRetailSelectedPlayerAccountId);
  const selectedPlayerAccountData = useSelector(getRetailSelectedPlayerAccountData);
  const selectedPlayerAccountBalance = useSelector(getRetailPlayerAccountBalance);
  const tillDetails = useSelector(getRetailTillDetails);

  return (
    <header className={classes["header"]}>
      <div className={classes["header__container"]}>
        <div className={classes["header__logo"]} onClick={() => history.push("/")}>
          <img alt="" src={LogoPNG} />
        </div>

        <div className={classes["header__links"]}>
          <div
            className={cx(classes["header__link"], classes["link"])}
            onClick={() =>
              history.push(selectedPlayerId ? `/accountview/${selectedPlayerId}?origin=DIRECT` : "/accountsearch")
            }
          >
            <span className={classes["link__icon"]}>
              <i className={classes["fas fa-user-friends"]} />
              <FontAwesomeIcon icon={faUserFriends} />
            </span>
            <span className={classes["link__text"]}>Customers</span>
          </div>
          <div className={cx(classes["header__link"], classes["link"])} onClick={() => history.push("/loadticket")}>
            <span className={classes["link__icon"]}>
              <FontAwesomeIcon icon={faTicketAlt} />
            </span>
            <span className={classes["link__text"]}>Ticket</span>
          </div>
          <div className={cx(classes["header__link"], classes["link"])}>
            <span className={classes["link__icon"]}>
              <FontAwesomeIcon icon={faClipboardList} />
            </span>
            <span className={classes["link__text"]}>Reports</span>
          </div>
          <div
            className={cx(classes["link"], classes["link_tools"])}
            onClick={() => setIsToolsHeaderOpen((prevState) => !prevState)}
          >
            <span className={classes["link__icon"]}>
              <FontAwesomeIcon icon={faTools} />
            </span>
            <span className={classes["link__text"]}>Tools</span>
            <div className={cx(classes["header__tools"], { [classes["active"]]: isToolsHeaderOpen })}>
              {/* <a className={cx(classes["header__link"], classes["link"])} href="#"> */}
              {/*  <span className={classes["link__icon"]}> */}
              {/*    <span className={classes["qicon-refresh"]} /> */}
              {/*  </span> */}
              {/*  <span className={classes["link__text"]}>Reset</span> */}
              {/* </a> */}
              <div className={cx(classes["header__link"], classes["link"])} onClick={() => testPrint()}>
                <span className={classes["link__icon"]}>
                  <FontAwesomeIcon icon={faPrint} />
                </span>
                <span className={classes["link__text"]}>Reprint Last</span>
              </div>
              <div
                className={cx(classes["header__link"], classes["link"])}
                onClick={() => history.push("/tilltransactions")}
              >
                <span className={classes["link__icon"]}>
                  <FontAwesomeIcon icon={faBuffer} />
                </span>
                <span className={classes["link__text"]}>Other Transactions</span>
              </div>
              <Link className={cx(classes["header__link"], classes["link"])} to="/cashreconciliation">
                <span className={classes["link__icon"]}>
                  <span className={classes["qicon-sign-out"]} />
                </span>
                <span className={classes["link__text"]}>End Shift</span>
              </Link>
              <div className={cx(classes["header__link"], classes["link"])} onClick={() => dispatch(logout())}>
                <span className={classes["link__icon"]}>
                  <i className={classes["fas fa-sign-out-alt"]} />
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                <span className={classes["link__text"]}>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classes["headbar"]}>
        <div className={classes["headbar__item"]}>
          <label className={classes["headbar__label"]} htmlFor="username">
            Username:
          </label>
          <input
            disabled
            className={classes["headbar__input"]}
            id="username"
            type="text"
            value={selectedPlayerAccountData ? selectedPlayerAccountData.username : ""}
          />
        </div>
        <div className={classes["headbar__item"]}>
          <label className={classes["headbar__label"]} htmlFor="name">
            Name:
          </label>
          <input
            disabled
            className={classes["headbar__input"]}
            id="name"
            type="text"
            value={
              selectedPlayerAccountData
                ? `${selectedPlayerAccountData.firstName} ${selectedPlayerAccountData.lastName}`
                : ""
            }
          />
        </div>
        <div className={classes["headbar__item"]}>
          <label className={classes["headbar__label"]} htmlFor="balance">
            Balance:
          </label>
          <input
            disabled
            className={classes["headbar__input"]}
            id="balance"
            type="text"
            value={
              tillDetails && selectedPlayerAccountBalance
                ? `${tillDetails.currencyCode} ${selectedPlayerAccountBalance.availableBalance.toLocaleString()}`
                : ""
            }
          />
          <button
            className={classes["headbar__cross"]}
            disabled={!selectedPlayerId}
            onClick={() => dispatch(setRetailPlayerAccountId({ accountId: undefined }))}
          >
            X
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(ToolboxHeader);

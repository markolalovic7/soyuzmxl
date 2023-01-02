import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getAuthLoading, getAuthLoggedIn } from "redux/reselect/auth-selector";

import MyAccountLoggedIn from "./MyAccountLoggedIn";
import MyAccountLoggedOut from "./MyAccountLoggedOut";
import MyAccountSettings from "./MyAccountSettings";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const propTypes = {
  accountDrawerClose: PropTypes.func.isRequired,
  backdropClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const MyAccountPanel = ({ accountDrawerClose, backdropClick, open }) => {
  const isLoggedIn = useSelector(getAuthLoggedIn);
  const isLoading = useSelector(getAuthLoading);

  return (
    <div className={`${classes["login"]} ${open ? classes["active"] : ""}`} id="login-1" onMouseUp={backdropClick}>
      <div className={`${classes["login__container"]} ${open ? classes["active"] : ""}`} id="login__container-1">
        {isLoading && (
          <div className={classes["login__container-loader"]}>
            <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
          </div>
        )}
        {isLoggedIn && <MyAccountLoggedIn handleClose={accountDrawerClose} />}
        {!isLoggedIn && <MyAccountLoggedOut handleClose={accountDrawerClose} />}
        <MyAccountSettings />
      </div>
    </div>
  );
};

MyAccountPanel.propTypes = propTypes;

export default MyAccountPanel;

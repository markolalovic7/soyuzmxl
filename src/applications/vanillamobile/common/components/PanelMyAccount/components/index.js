import PropTypes from "prop-types";
import { forwardRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import MyAccountLoggedIn from "./MyAccountLoggedIn";
import MyAccountLoggedOut from "./MyAccountLoggedOut";

import { getAuthLoggedIn } from "redux/reselect/auth-selector";

const propTypes = {
  onPanelClose: PropTypes.func.isRequired,
};

const defaultProps = {};

const PanelMyAccount = forwardRef(({ onPanelClose, ...props }, ref) => {
  const loggedIn = useSelector(getAuthLoggedIn);
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    onPanelClose();
  }, [onPanelClose, pathname]);

  return loggedIn ? (
    <MyAccountLoggedIn ref={ref} onCloseMyAccount={onPanelClose} {...props} />
  ) : (
    <MyAccountLoggedOut ref={ref} onCloseMyAccount={onPanelClose} {...props} />
  );
});

PanelMyAccount.propTypes = propTypes;
PanelMyAccount.defaultProps = defaultProps;

export default PanelMyAccount;

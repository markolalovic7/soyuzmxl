import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";

import Header from "./components/Header";
import NavigationMenu from "./components/NavigationMenu";

const propTypes = {
  children: PropTypes.node.isRequired,
};

// TODO login...
// - spec out changes for denys
// - 30 mins initial dev (just login with no proper display

const Layout = ({ children }) => {
  const { t } = useTranslation();

  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className={classes["slimdesktop-body"]}>
      <div className={classes["wrapper"]}>
        <Header />

        <NavigationMenu />

        {children}

        {/* // TODO footer */}
      </div>
    </div>
  );
};

Layout.propTypes = propTypes;

export default React.memo(Layout);

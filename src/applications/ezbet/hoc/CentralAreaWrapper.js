import cx from "classnames";
import React from "react";

import DesktopBetslipCard from "../components/DesktopBetslipCard/DesktopBetslipCard";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const CentralAreaWrapper = ({ children }) => (
  <div className={classes["central-area-wrapper"]}>
    <div className={cx(classes["central-area-card"], classes["card-left"])} id="card-left">
      {children}
    </div>
    <div className={cx(classes["central-area-card"], classes["card-right"])} id="card-right">
      <DesktopBetslipCard />
    </div>
  </div>
);

export default React.memo(CentralAreaWrapper);

import React from "react";

import classes from "../../../scss/ezbet.module.scss";

const RedAlertIcon = () => (
  <span className={classes["icon-solid-red-alert"]}>
    <span className={classes["path1"]} />
    <span className={classes["path2"]} />
    <span className={classes["path3"]} />
  </span>
);

export default React.memo(RedAlertIcon);

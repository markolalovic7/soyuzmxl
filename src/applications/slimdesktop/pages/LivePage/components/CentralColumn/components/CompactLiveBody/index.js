import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

import LiveLeftColumn from "./LiveLeftColumn";
import MatchDetail from "./MatchDetail";

const CompactLiveBody = ({ sportData, sports }) => (
  <div className={classes["content__cols"]}>
    <LiveLeftColumn sportData={sportData} sports={sports} />
    <div className={cx(classes["content-col--half"], classes["content-col--half_special"])}>
      <MatchDetail />
    </div>
  </div>
);

const propTypes = {
  sportData: PropTypes.object.isRequired,
  sports: PropTypes.array.isRequired,
};

CompactLiveBody.propTypes = propTypes;

export default React.memo(CompactLiveBody);

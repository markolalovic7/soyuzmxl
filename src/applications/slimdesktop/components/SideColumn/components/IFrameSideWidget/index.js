import * as PropTypes from "prop-types";
import React from "react";

import classes from "../../../../scss/slimdesktop.module.scss";

const IFrameSideWidget = ({ widgetData }) => (
  <div className={classes["sidebar__box"]}>
    <div className={classes["box-title"]}>{widgetData.description}</div>
    <iframe height={widgetData?.height || 150} src={widgetData.link} title={widgetData.description} width="100%" />
  </div>
);

IFrameSideWidget.propTypes = {
  widgetData: PropTypes.object.isRequired,
};

export default React.memo(IFrameSideWidget);

import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import React from "react";

import "applications/vanilladesktop/scss/sportradar-match-tracker-theme.css";

const propTypes = {
  containerClassName: PropTypes.string.isRequired,
  iFrameWidget: PropTypes.object.isRequired,
  titleClassName: PropTypes.string.isRequired,
};
const defaultProps = {};

const IFrameMenu = ({ containerClassName, iFrameWidget, titleClassName }) => (
  <div className={classes[containerClassName]}>
    <h3 className={classes[titleClassName]}>{iFrameWidget.description}</h3>
    <iframe
      height={iFrameWidget?.height || 150}
      src={iFrameWidget.link}
      title={iFrameWidget.description}
      width="100%"
    />
  </div>
);

IFrameMenu.propTypes = propTypes;
IFrameMenu.defaultProps = defaultProps;

export default React.memo(IFrameMenu);

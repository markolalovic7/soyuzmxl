import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../../../redux/reselect/cms-selector";
import SportsTable from "../ContinentalSportsLiveTable/components";

const CentralColumn = ({ sportCode }) => {
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <SportsTable filteredSportCode={sportCode} />
    </div>
  );
};

const propTypes = {
  sportCode: PropTypes.string,
};

const defaultProps = {
  sportCode: undefined,
};

CentralColumn.propTypes = propTypes;
CentralColumn.defaultProps = defaultProps;

export default React.memo(CentralColumn);

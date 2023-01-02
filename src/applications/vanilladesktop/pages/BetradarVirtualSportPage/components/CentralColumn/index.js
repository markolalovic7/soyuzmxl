import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import BetradarVirtualSportsVideoSection from "../../../../components/BetradarVirtualSportsVideoSection";
import UpcomingMatches from "../UpcomingMatches";

const CentralColumn = ({ feedCode }) => {
  const [currentCodes, setCurrentCodes] = useState([]);

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      {feedCode && (
        <div className={classes["central-section__content"]}>
          <BetradarVirtualSportsVideoSection feedCode={feedCode} setCurrentCodes={setCurrentCodes} />
          <UpcomingMatches currentCodes={currentCodes} feedCode={feedCode} />
        </div>
      )}
    </div>
  );
};

const propTypes = {
  feedCode: PropTypes.string,
};
const defaultProps = {
  feedCode: undefined,
};

CentralColumn.propTypes = propTypes;
CentralColumn.defaultProps = defaultProps;

export default CentralColumn;

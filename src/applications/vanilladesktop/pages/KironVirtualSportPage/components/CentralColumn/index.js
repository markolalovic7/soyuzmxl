import KironVirtualSportsVideoSection from "applications/vanilladesktop/components/KironVirtualSportsVideoSection";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import UpcomingMatches from "../UpcomingMatches";

const CentralColumn = ({ feedCode }) => {
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      {feedCode && (
        <div className={classes["central-section__content"]}>
          <KironVirtualSportsVideoSection feedCode={feedCode} />
          <UpcomingMatches feedCode={feedCode} />
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

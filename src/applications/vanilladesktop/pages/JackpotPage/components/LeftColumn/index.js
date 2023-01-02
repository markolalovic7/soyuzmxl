import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import JackpotSportsMenu from "../JackpotSportsMenu";

const LeftColumn = ({ activeJackpotId, setActiveJackpotId }) => {
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  return (
    <div className={cx(classes["left-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["left-section__content"]}>
        <div className={classes["left-section__item"]}>
          <JackpotSportsMenu activeJackpotId={activeJackpotId} setActiveJackpotId={setActiveJackpotId} />
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  activeJackpotId: PropTypes.number,
  setActiveJackpotId: PropTypes.func.isRequired,
};

const defaultProps = {
  activeJackpotId: undefined,
};

LeftColumn.propTypes = propTypes;
LeftColumn.defaultProps = defaultProps;

export default LeftColumn;

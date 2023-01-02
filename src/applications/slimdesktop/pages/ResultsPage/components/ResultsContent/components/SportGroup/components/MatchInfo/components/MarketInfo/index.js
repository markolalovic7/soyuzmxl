import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";

import classes from "../../../../../../../../../../scss/slimdesktop.module.scss";

const MarketInfo = ({ period }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={classes["content-dropdown"]}>
      <div
        className={cx(classes["content-dropdown__head"], { [classes["active"]]: isExpanded })}
        onClick={() => setIsExpanded((prevState) => !prevState)}
      >
        <div className={classes["content-dropdown__title"]}>
          <b>{`${period.description} [${period.score}]`}</b>
        </div>
        <div className={cx(classes["content-dropdown__arrow"], classes["js-dropdown"])}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      <div
        className={cx(classes["content-dropdown__body"], classes["js-dropdown-box"])}
        style={{ display: isExpanded ? "block" : "none" }}
      >
        <div className={classes["content-dropdown__row"]}>
          {period.players.map((player) => (
            <div
              className={cx(classes["card-result"], classes["card-result--dd"], classes["card-result--grow"], {
                [classes["active"]]: player.result === "WIN",
              })}
              key={player.name}
            >
              <span>{player.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  period: PropTypes.object.isRequired,
};
const defaultProps = {};

MarketInfo.propTypes = propTypes;
MarketInfo.defaultProps = defaultProps;

export default React.memo(MarketInfo);

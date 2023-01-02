import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import LiveMarketDetail from "../../../LivePage/components/LiveEventDetail/components/LiveMarketDetail";

const propTypes = {
  eventId: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  markets: PropTypes.array.isRequired,
};

const SportExpandingResults = ({ eventId, label, markets }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={classes["live__sport"]}>
      <div className={cx(classes["live__sport-header"], { [classes["active"]]: isExpanded })}>
        <span className={classes["live__sport-arrow"]} onClick={() => setIsExpanded((isExpanded) => !isExpanded)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
        <h5 className={classes["live__sport-title"]} onClick={() => setIsExpanded((isExpanded) => !isExpanded)}>
          {label}
        </h5>
      </div>
      <div className={cx(classes["live__sport-content"], { [classes["open"]]: isExpanded })}>
        {markets.map((market) => (
          <LiveMarketDetail eventId={eventId} key={market.id} market={market} />
        ))}
      </div>
    </div>
  );
};

SportExpandingResults.propTypes = propTypes;

export default React.memo(SportExpandingResults);

import { faStar as faStarOutlined } from "@fortawesome/free-regular-svg-icons";
import { faChevronRight, faStar as faStarFilled } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import LiveMarketDetail from "../LiveMarketDetail";

const propTypes = {
  eventId: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  listOfFavouriteMarkets: PropTypes.array.isRequired,
  markets: PropTypes.array.isRequired,
  setListOfFavouriteMarkets: PropTypes.func.isRequired,
};

const SportExpandingResults = ({ eventId, label, listOfFavouriteMarkets, markets, setListOfFavouriteMarkets }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleFavouriteMarket = (marketKey) => {
    if (listOfFavouriteMarkets.includes(marketKey)) {
      // Remove
      const index = listOfFavouriteMarkets.indexOf(marketKey);
      if (index > -1) {
        const tempListOfFavouriteMarkets = [...listOfFavouriteMarkets];
        tempListOfFavouriteMarkets.splice(index, 1);
        setListOfFavouriteMarkets(tempListOfFavouriteMarkets);
        localStorage.setItem("favouriteMarketGroups", tempListOfFavouriteMarkets.join(","));
      }
    } else {
      // Add
      const tempListOfFavouriteMarkets = [...listOfFavouriteMarkets];
      tempListOfFavouriteMarkets.push(marketKey);
      setListOfFavouriteMarkets(tempListOfFavouriteMarkets);
      localStorage.setItem("favouriteMarketGroups", tempListOfFavouriteMarkets.join(","));
    }
  };

  return (
    <div className={classes["live__sport"]}>
      <div className={cx(classes["live__sport-header"], { [classes["active"]]: isExpanded })}>
        <span className={classes["live__sport-arrow"]} onClick={() => setIsExpanded((isExpanded) => !isExpanded)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
        <h5 className={classes["live__sport-title"]} onClick={() => setIsExpanded((isExpanded) => !isExpanded)}>
          {label}
        </h5>
        <span className={classes["live__sport-star"]} onClick={() => toggleFavouriteMarket(label)}>
          <FontAwesomeIcon icon={listOfFavouriteMarkets.includes(label) ? faStarFilled : faStarOutlined} />
        </span>
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

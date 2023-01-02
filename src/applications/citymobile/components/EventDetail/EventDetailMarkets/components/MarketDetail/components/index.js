import PropTypes from "prop-types";
import React from "react";

import { openLinkInNewWindow } from "../../../../../../../../utils/misc";
import classes from "../../../../../../scss/citymobile.module.scss";

import MarketRow from "./MarketRow";

const StarSVG = () => (
  <svg fill="none" height="14" viewBox="0 0 16 14" width="16" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m8.01123 0 1.68386 5.18237h5.44911l-4.4084 3.20288 1.6838 5.18235-4.40837-3.2029-4.40839 3.2029 1.68386-5.18235-4.408394-3.20288h5.449074z"
      fill="#79e5e3"
    />
  </svg>
);

const getRows = (children) => {
  const arrays = [];
  if (children) {
    const size = children.length > 3 ? (children.length % 3 === 0 ? 3 : 2) : children.length; // If the size is > 3, split in groups of 2 (except if modules of 3!) This is HitBet specific

    for (let i = 0; i < children.length; i += size) {
      arrays.push(children.slice(i, i + size));
    }
  }

  return arrays;
};

const MarketDetail = ({ brMatchId, listOfFavouriteMarkets, markets, matchId, setListOfFavouriteMarkets }) => {
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
    <div className={classes["event-content__card"]} key={`${markets[0].desc} – ${markets[0].period}`}>
      <div className={classes["event-content__item"]}>
        <span className={classes["event-content__title"]}>{`${markets[0].desc} – ${markets[0].period}`}</span>
        <div className={classes["event-content__icons"]}>
          {brMatchId && (
            <span
              className={`${classes["event-content__icon"]} ${classes["event-content__icon_statistic"]}`}
              onClick={() => openLinkInNewWindow(`https://s5.sir.sportradar.com/nobbaggu/ko/match/${brMatchId}`)}
            >
              <svg fill="4e454a" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.3125 8.125H12.8123V14.3748H10.3125V8.125Z" fill="white" />
                <path d="M2.8125 10.625H5.31235V14.375H2.8125V10.625Z" fill="white" />
                <path d="M14.0625 5.625H16.5623V14.3751H14.0625V5.625Z" fill="white" />
                <path d="M6.5625 6.875H9.06239V14.375H6.5625V6.875Z" fill="white" />
              </svg>
            </span>
          )}

          <span
            className={`${classes["event-content__icon"]} ${classes["event-content__icon_star"]} ${
              listOfFavouriteMarkets.includes(`${markets[0].desc} - ${markets[0].period}`) ? classes["selected"] : ""
            }`}
            onClick={() => toggleFavouriteMarket(`${markets[0].desc} - ${markets[0].period}`)}
          >
            <StarSVG />
          </span>
        </div>
      </div>
      {markets.map((market, index) => {
        const outcomeRows = market.children ? getRows(Object.values(market.children)) : [];

        return outcomeRows.map((outcomes, index) => (
          <MarketRow index={index} key={index} marketOpen={market.open} matchId={matchId} outcomes={outcomes} />
        ));
      })}
    </div>
  );
};

const propTypes = {
  listOfFavouriteMarkets: PropTypes.array.isRequired,
  markets: PropTypes.array.isRequired,
  matchId: PropTypes.number.isRequired,
  setListOfFavouriteMarkets: PropTypes.func.isRequired,
};

const defaultProps = {};

MarketDetail.propTypes = propTypes;
MarketDetail.defaultProps = defaultProps;

export default React.memo(MarketDetail);

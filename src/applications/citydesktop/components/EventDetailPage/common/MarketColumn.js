import { faStar as regularFaStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidFaStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { AnimateKeyframes } from "react-simple-animate";

import { makeGetBetslipOutcomeIds } from "../../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../utils/betslip-utils";
import classes from "../../../scss/citywebstyle.module.scss";

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

const MarketColumn = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState({});

  const priceFormat = useSelector((state) => state.auth.priceFormat);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const toggleBetslipHandler = (outcomeId, eventId) => {
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
    onRefreshBetslipHandler(dispatch, location.pathname, true);
  };

  const toggleFavouriteMarket = (marketKey) => {
    if (props.listOfFavouriteMarkets.includes(marketKey)) {
      // Remove
      const index = props.listOfFavouriteMarkets.indexOf(marketKey);
      if (index > -1) {
        const tempListOfFavouriteMarkets = [...props.listOfFavouriteMarkets];
        tempListOfFavouriteMarkets.splice(index, 1);
        props.setListOfFavouriteMarkets(tempListOfFavouriteMarkets);
        localStorage.setItem("favouriteMarketGroups", tempListOfFavouriteMarkets.join(","));
      }
    } else {
      // Add
      const tempListOfFavouriteMarkets = [...props.listOfFavouriteMarkets];
      tempListOfFavouriteMarkets.push(marketKey);
      props.setListOfFavouriteMarkets(tempListOfFavouriteMarkets);
      localStorage.setItem("favouriteMarketGroups", tempListOfFavouriteMarkets.join(","));
    }
  };

  const onCollapseExpandHandler = (id) => {
    setCollapsed((prevState) => ({ ...prevState, [id]: !(prevState[id] || false) }));
  };

  return (
    <div className={classes["event-content__container"]}>
      {props.marketGroups.map((markets, index) => {
        if (index % 2 !== props.index) return null;

        return (
          <div className={classes["event-content__card"]} key={`${markets[0].desc} – ${markets[0].period}`}>
            <div className={classes["event-content__item"]}>
              <span className={classes["event-content__title"]} onClick={() => onCollapseExpandHandler(markets[0].id)}>
                {`${markets[0].desc} - ${markets[0].period}`}
              </span>
              <div className={classes["event-content__icons"]}>
                <span
                  className={classes["event-content__icon"]}
                  onClick={() => toggleFavouriteMarket(`${markets[0].desc} - ${markets[0].period}`)}
                >
                  <FontAwesomeIcon
                    icon={
                      !props.listOfFavouriteMarkets.includes(`${markets[0].desc} - ${markets[0].period}`)
                        ? regularFaStar
                        : solidFaStar
                    }
                  />
                </span>
              </div>
            </div>
            {!collapsed[markets[0].id] &&
              markets.map((market, index) => {
                const outcomeRows = market.children ? getRows(Object.values(market.children)) : [];

                return outcomeRows.map((outcomes, index) => (
                  <div className={classes["event-content__row"]} key={index}>
                    {outcomes.map((sel) => {
                      const outcomeId = sel.id;
                      const outcomeDescription = sel.desc;
                      const outcomeHidden = sel.hidden || !market.open;
                      const priceId = sel.priceId;
                      const price = sel.price;
                      const spread = sel.spread;
                      const spread2 = sel.spread2;
                      const priceDir = sel.dir;

                      const outcome = {
                        outcomeDescription,
                        outcomeHidden,
                        outcomeId,
                        price,
                        priceDir,
                        priceId,
                        spread,
                        spread2,
                      };

                      return (
                        <div
                          className={`${classes["event-content__coeficient"]} ${
                            betslipOutcomeIds.includes(parseInt(outcome.outcomeId, 10))
                              ? classes["event-content__coeficient_selected"]
                              : ""
                          }`}
                          key={outcomeId}
                          style={{
                            cursor: outcome.outcomeHidden ? "none" : "pointer",
                            opacity: outcome.outcomeHidden ? 0.6 : 1,
                          }}
                          onClick={() => toggleBetslipHandler(outcome.outcomeId, props.eventId)}
                        >
                          <span className={classes["event-content__text"]}>{outcome.outcomeDescription}</span>
                          <span className={classes["event-content__numbers"]}>
                            {outcome.outcomeHidden
                              ? "-.-"
                              : priceFormat === "EURO"
                              ? parseFloat(outcome.price).toFixed(2)
                              : outcome.price}
                          </span>
                          {outcome.priceDir === "d" ? (
                            <AnimateKeyframes
                              play
                              duration="0.5"
                              iterationCount="2"
                              keyframes={["opacity: 0", "opacity: 1"]}
                            >
                              <span
                                className={`${classes["event-content__triangle"]} ${classes["event-content__triangle_red"]}`}
                              />
                            </AnimateKeyframes>
                          ) : null}
                          {outcome.priceDir === "u" ? (
                            <AnimateKeyframes
                              play
                              duration="0.5"
                              iterationCount="2"
                              keyframes={["opacity: 0", "opacity: 1"]}
                            >
                              <span
                                className={`${classes["event-content__triangle"]} ${classes["event-content__triangle_green"]}`}
                              />
                            </AnimateKeyframes>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ));
              })}
          </div>
        );
      })}
    </div>
  );
};

export default MarketColumn;

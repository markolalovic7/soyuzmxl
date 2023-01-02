import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import MarketSelection from "./MarketSelection/MarketSelection";

const MarketDetail = (props) => {
  const { t } = useTranslation();
  const MARKET_FILTER_ALL = 0;
  const MARKET_FILTER_MATCH = 1;
  const MARKET_FILTER_OU = 2;
  const MARKET_FILTER_HANDICAP = 3;
  const MARKET_FILTER_OTHERS = 4;

  const [marketFilter, setMarketFilter] = useState(MARKET_FILTER_ALL);

  const marketFilterAllEnabled = useRef(false);
  const marketFilterMatchEnabled = useRef(false);
  const marketFilterOverUnderEnabled = useRef(false);
  const marketFilterHandicapEnabled = useRef(false);
  const marketFilterOthersEnabled = useRef(false);

  const applyTabEnableRule = (market) => {
    marketFilterAllEnabled.current = true;

    const match = market.marketTypeGroup === "MONEY_LINE";
    marketFilterMatchEnabled.current = marketFilterMatchEnabled.current || match;

    const overUnder = market.marketTypeGroup === "FIXED_TOTAL" || market.marketTypeGroup === "THREE_WAY_FIXED_TOTAL";
    marketFilterOverUnderEnabled.current = marketFilterOverUnderEnabled.current || overUnder;

    const handicap = market.marketTypeGroup === "FIXED_SPREAD" || market.marketTypeGroup === "THREE_WAY_FIXED_SPREAD";
    marketFilterHandicapEnabled.current = marketFilterHandicapEnabled.current || handicap;

    marketFilterOthersEnabled.current = marketFilterOthersEnabled.current || (!match && !overUnder && !handicap);
  };

  const filterMarket = (market) => {
    switch (marketFilter) {
      case MARKET_FILTER_ALL:
        return false;
      case MARKET_FILTER_MATCH:
        return market.marketTypeGroup !== "MONEY_LINE";
      case MARKET_FILTER_OU:
        return market.marketTypeGroup !== "FIXED_TOTAL" && market.marketTypeGroup !== "THREE_WAY_FIXED_TOTAL";
      case MARKET_FILTER_HANDICAP:
        return market.marketTypeGroup !== "FIXED_SPREAD" && market.marketTypeGroup !== "THREE_WAY_FIXED_SPREAD";
      case MARKET_FILTER_OTHERS:
        return !(
          market.marketTypeGroup !== "MONEY_LINE" &&
          market.marketTypeGroup !== "FIXED_TOTAL" &&
          market.marketTypeGroup !== "THREE_WAY_FIXED_TOTAL" &&
          market.marketTypeGroup !== "FIXED_SPREAD" &&
          market.marketTypeGroup !== "THREE_WAY_FIXED_SPREAD"
        );
      default:
        return true;
    }
  };

  const marketDetailContent = () => {
    let lastMarketDescription = null;
    let currentGroup = [];
    const groupedMarkets = [];
    Object.values(props.match.children).forEach((market) => {
      // Prepare the flags for the tabs to be enabled/disabled
      applyTabEnableRule(market);

      // For the current tab, select markets to show...
      if (!filterMarket(market)) {
        if (market.id !== props.mainMarketId) {
          const thisMarketDescription = `${market.desc} - ${market.period}`;
          if (thisMarketDescription !== lastMarketDescription) {
            lastMarketDescription = thisMarketDescription;
            currentGroup = [market];
            groupedMarkets.push(currentGroup);
          } else {
            currentGroup.push(market);
          }
        }
      }
    });

    if (props.match && props.match.children) {
      return groupedMarkets.map((marketGroup) => (
        <ul className={classes["matches__list"]} key={marketGroup[0].id}>
          <li className={classes["parent"]} onClick={(e) => props.toggleMarketHandler(e, marketGroup[0].id)}>
            <span onClick={(e) => props.toggleMarketHandler(e, marketGroup[0].id)}>
              {marketGroup[0].desc} -{marketGroup[0].period}
            </span>
            <div
              className={`${classes["matches__arrow"]} ${
                props.expandedMarkets.includes(marketGroup[0].id) ? classes["active"] : ""
              } `}
              key={1}
              onClick={(e) => props.toggleMarketHandler(e, marketGroup[0].id)}
            />
            <div
              className={`${classes["matches__selections"]} ${
                props.expandedMarkets.includes(marketGroup[0].id) ? classes["open"] : ""
              }`}
              key={2}
            >
              {marketGroup.map((market) => (
                <MarketSelection eventId={props.match.id} key={market.id} market={market} />
              ))}
            </div>
          </li>
        </ul>
      ));
    }

    return null;
  };

  const content = marketDetailContent();

  return (
    <>
      <nav className={classes["matches__nav"]}>
        <ul className={classes["matches__nav-list"]}>
          <li
            className={`${classes["matches__li"]} ${
              marketFilter === MARKET_FILTER_ALL ? classes["matches__li_active"] : null
            } ${!marketFilterAllEnabled.current ? classes["disabled"] : ""}`}
            onClick={() => setMarketFilter(MARKET_FILTER_ALL)}
          >
            {t("all")}
          </li>
          <li
            className={`${classes["matches__li"]} ${
              marketFilter === MARKET_FILTER_MATCH ? classes["matches__li_active"] : null
            } ${!marketFilterMatchEnabled.current ? classes["disabled"] : ""}`}
            onClick={() => setMarketFilter(MARKET_FILTER_MATCH)}
          >
            {t("match")}
          </li>
          <li
            className={`${classes["matches__li"]} ${
              marketFilter === MARKET_FILTER_OU ? classes["matches__li_active"] : null
            } ${!marketFilterOverUnderEnabled.current ? classes["disabled"] : ""}`}
            onClick={() => setMarketFilter(MARKET_FILTER_OU)}
          >
            {t("over_under")}
          </li>
          <li
            className={`${classes["matches__li"]} ${
              marketFilter === MARKET_FILTER_HANDICAP ? classes["matches__li_active"] : null
            } ${!marketFilterHandicapEnabled.current ? classes["disabled"] : ""}`}
            onClick={() => setMarketFilter(MARKET_FILTER_HANDICAP)}
          >
            {t("handicap")}
          </li>
          <li
            className={`${classes["matches__li"]} ${
              marketFilter === MARKET_FILTER_OTHERS ? classes["matches__li_active"] : null
            } ${!marketFilterOthersEnabled.current ? classes["disabled"] : ""}`}
            onClick={() => setMarketFilter(MARKET_FILTER_OTHERS)}
          >
            {t("others")}
          </li>
        </ul>
      </nav>
      <div className={classes["matches__elements"]}>{content}</div>
    </>
  );
};

export default React.memo(MarketDetail);

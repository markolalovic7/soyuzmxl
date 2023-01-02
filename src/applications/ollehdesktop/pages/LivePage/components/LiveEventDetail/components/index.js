import cx from "classnames";
import PropTypes from "prop-types";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import ResizeObserver from "resize-observer-polyfill";

import {useLiveData} from "../../../../../../common/hooks/useLiveData";
import classes from "../../../../../scss/ollehdesktop.module.scss";
import {NAVIGATION_TABS} from "../../../constants";

import Scoreboard from "./Scoreboard";
import SportExpandingResults from "./SportExpandingResults";

// TODO - compute these heights off the components? - https://stackoverflow.com/a/54841876
const HEADER_HEIGHT = 25.5;
const MARKET_HEIGHT = 34;

const BANNER_HEIGHT = 160;
const BANNER_FOOTER_HEIGHT = 44;
const MARKET_SELECTOR_HEIGHT = 35;

function isEnabled(code, hasMoneyLine, hasOverUnder, hasHandicap, hasOddEven, hasPeriod, hasOther) {
  switch (code) {
    case "ALL":
      return true;
    case "MATCH":
      return hasMoneyLine;
    case "HANDICAP":
      return hasHandicap;
    case "OVER_UNDER":
      return hasOverUnder;
    case "ODD_EVEN":
      return hasOddEven;
    case "PERIODS":
      return hasPeriod;
    case "OTHERS":
      return hasOther;
    default:
      return false;
  }
}

const getSelectedMarketGroups = (
  code,
  marketGroups,
  moneyLineMarketGroups,
  overUnderMarketGroups,
  handicapMarketGroups,
  oddEvenMarketGroups,
  periodMarketGroups,
  otherMarketGroups,
) => {
  switch (code) {
    case "ALL":
      return marketGroups;
    case "MATCH":
      return moneyLineMarketGroups;
    case "HANDICAP":
      return handicapMarketGroups;
    case "OVER_UNDER":
      return overUnderMarketGroups;
    case "ODD_EVEN":
      return oddEvenMarketGroups;
    case "PERIODS":
      return periodMarketGroups;
    case "OTHERS":
      return otherMarketGroups;
    default:
      return marketGroups;
  }
};

const LiveEventDetail = ({ eventId, listOfFavouriteMarkets, setListOfFavouriteMarkets }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [selectedSorting, setSelectedSorting] = useState(NAVIGATION_TABS[0].code);

  const [leftSideHeight, setLeftSideHeight] = useState(0);

  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, eventId ? `event-${eventId}` : null);

  useEffect(() => {
    // create an Observer instance
    const resizeObserver = new ResizeObserver((entries) => {
      // console.log("Body client height changed:", entries[0].target.clientHeight);
      // console.log("Body scroll height changed:", entries[0].target.scrollHeight);
      // console.log("Body client width changed:", entries[0].target.clientWidth);
      // console.log("Body scroll width changed:", entries[0].target.scrollWidth);

      const target = entries[0].target;
      const height = Math.min(target.clientHeight, target.scrollHeight);

      const adjustedHeight = height - BANNER_HEIGHT - BANNER_FOOTER_HEIGHT - MARKET_SELECTOR_HEIGHT;
      setLeftSideHeight(adjustedHeight > 0 ? adjustedHeight : 0);
    });

    // start observing a DOM node
    resizeObserver.observe(document.getElementById("live-left-side"));
  }, []); // Empty array ensures that effect is only run on mount

  const getMarketGroups = useCallback((markets, listOfFavouriteMarkets) => {
    const marketGroupHash = {};

    markets.forEach((market) => {
      const key = `${market.mDesc} - ${market.pDesc}`;
      const desc = market.mDesc;
      const marketTypeGroup = market.mGroup;
      const period = market.pDesc;
      const periodAbrv = market.pAbrv;
      const ordinal = market.ordinal;
      const marketTO = {
        desc,
        id: market.mId,
        marketTypeGroup,
        open: market.mOpen,
        outcomes: market.sels.map((sel) => ({
          desc: sel.oDesc,
          dir: sel.dir,
          hidden: sel.hidden || !market.mOpen,
          id: sel.oId,
          price: sel.formattedPrice,
          priceId: sel.pId,
        })),
        period,
        periodAbrv,
      };

      marketGroupHash[key] = marketGroupHash[key]
        ? { ...marketGroupHash[key], markets: [...marketGroupHash[key].markets, marketTO] }
        : { desc, key, marketTypeGroup, markets: [marketTO], ordinal, period, periodAbrv };
    });

    return Object.values(marketGroupHash).sort((a, b) => {
      const aEnabled = listOfFavouriteMarkets.includes(a.key);
      const bEnabled = listOfFavouriteMarkets.includes(b.key);

      return (aEnabled ? 0 : 1000) + a.ordinal - ((bEnabled ? 0 : 1000) + b.ordinal);
    });
  }, []);

  const marketGroups = useMemo(
    () =>
      eventLiveData?.markets ? getMarketGroups(Object.values(eventLiveData?.markets), listOfFavouriteMarkets) : [],
    [eventLiveData?.markets, listOfFavouriteMarkets],
  );

  const moneyLineMarketGroups = useMemo(
    () =>
      marketGroups.filter(
        (market) =>
          market.marketTypeGroup === "MONEY_LINE" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      ),
    [marketGroups],
  );

  const moneyLineCount = moneyLineMarketGroups.length;

  const hasMoneyLine = moneyLineCount > 0;

  const overUnderMarketGroups = useMemo(
    () =>
      marketGroups.filter(
        (market) =>
          (market.marketTypeGroup === "FIXED_TOTAL" || market.marketTypeGroup === "THREE_WAY_FIXED_TOTAL") &&
          (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      ),
    [marketGroups],
  );

  const overUnderCount = overUnderMarketGroups.length;

  const hasOverUnder = overUnderCount > 0;

  const handicapMarketGroups = useMemo(
    () =>
      marketGroups.filter(
        (market) =>
          (market.marketTypeGroup === "FIXED_SPREAD" || market.marketTypeGroup === "THREE_WAY_FIXED_SPREAD") &&
          (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      ),
    [marketGroups],
  );

  const handicapCount = handicapMarketGroups.length;

  const hasHandicap = handicapCount > 0;

  const oddEvenMarketGroups = useMemo(
    () =>
      marketGroups.filter(
        (market) => market.marketTypeGroup === "ODD_EVEN" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      ),
    [marketGroups],
  );

  const oddEvenCount = oddEvenMarketGroups.length;

  const hasOddEven = oddEvenCount > 0;

  const periodMarketGroups = useMemo(
    () => marketGroups.filter((market) => market.periodAbrv !== "M" && market.periodAbrv !== "RT"),
    [marketGroups],
  );

  const periodCount = periodMarketGroups.length;

  const hasPeriod = periodCount > 0;

  const otherMarketGroups = marketGroups.filter(
    (m) =>
      !moneyLineMarketGroups.includes(m) &&
      !overUnderMarketGroups.includes(m) &&
      !handicapMarketGroups.includes(m) &&
      !oddEvenMarketGroups.includes(m) &&
      !periodMarketGroups.includes(m),
  );

  const otherCount = otherMarketGroups.length;

  const hasOther = otherCount > 0;

  const selectedMarketGroups = getSelectedMarketGroups(
    selectedSorting,
    marketGroups,
    moneyLineMarketGroups,
    overUnderMarketGroups,
    handicapMarketGroups,
    oddEvenMarketGroups,
    periodMarketGroups,
    otherMarketGroups,
  );

  const getMaxLeftMarketIndex = useCallback(
    (marketGroups) => {
      let totalHeight = 0;
      for (let i = 0; i < marketGroups.length; i += 1) {
        let marketDepth = 0;
        marketGroups[i].markets.forEach((m) => {
          // Increase by 1 for every row of outcomes to show...
          marketDepth += m.outcomes.length <= 3 ? 1 : Math.ceil(m.outcomes.length / 2);
        });
        totalHeight = totalHeight + HEADER_HEIGHT + MARKET_HEIGHT * marketDepth;

        if (totalHeight > leftSideHeight) {
          // console.log(`Market index: ${i}. Total Height: ${totalHeight} exceeds panel height: ${leftSideHeight} `);
          return i;
        }
      }

      return Math.max(0, marketGroups.length);
    },
    [leftSideHeight],
  );

  const maxLeftMarketIndex = useMemo(() => getMaxLeftMarketIndex(selectedMarketGroups), [selectedMarketGroups]);

  return (
    <div className={classes["live__sports"]}>
      <div className={classes["live__sports-left"]} id="live-left-side">
        {eventLiveData && (
          <Scoreboard
            aPeriodScores={
              eventLiveData.aScore ? [...eventLiveData.pScores.map((periodScore) => periodScore.aScore)] : []
            }
            aScore={eventLiveData.aScore ? eventLiveData.aScore : 0}
            cMin={eventLiveData.cMin}
            cPeriod={eventLiveData.cPeriod}
            cSec={eventLiveData.cSec}
            cStatus={eventLiveData.cStatus}
            cType={eventLiveData.cType}
            countryDesc={eventLiveData.epDesc?.split("/")[0]}
            eventId={eventLiveData.eventId}
            hPeriodScores={
              eventLiveData.hScore ? [...eventLiveData.pScores.map((periodScore) => periodScore.hScore)] : []
            }
            hScore={eventLiveData.hScore ? eventLiveData.hScore : 0}
            icons={eventLiveData.icons}
            isOpAActive={eventLiveData.activeOp === "a"}
            isOpBActive={eventLiveData.activeOp === "b"}
            isPaused={eventLiveData.cStatus !== "STARTED"}
            leagueDesc={eventLiveData.epDesc?.split("/")[1]}
            opADesc={eventLiveData.opADesc}
            opBDesc={eventLiveData.opBDesc}
            sportCode={eventLiveData.sport}
          />
        )}
        <div className={classes["live__scoreboard-header"]}>
          <div className={classes["live__scoreboard-header-title"]}>
            {eventLiveData && (
              <p>
                <span>{eventLiveData.epDesc?.split("/")[0]}</span>
                {` - ${eventLiveData.epDesc?.split("/")[1]}`}
              </p>
            )}
            {eventLiveData && <p>{`${eventLiveData.opADesc} vs ${eventLiveData.opADesc}`}</p>}
          </div>
          <div className={classes["live__scoreboard-header-btns"]}>
            {/* <button type="button">Head to Head</button> */}
            {/* <button type="button"> */}
            {/*  <img alt="" src={LiveHeadButtonIcon} /> */}
            {/* </button> */}
          </div>
        </div>
        <div className={classes["live__sports-navigation"]}>
          <span>Filter By:</span>
          {NAVIGATION_TABS.map((tab) => {
            let marketCount = 0;
            if (eventLiveData) {
              switch (tab.code) {
                case "ALL":
                  marketCount = marketGroups.length;
                  break;
                case "MATCH":
                  marketCount = moneyLineCount;
                  break;
                case "HANDICAP":
                  marketCount = handicapCount;
                  break;
                case "OVER_UNDER":
                  marketCount = overUnderCount;
                  break;
                case "ODD_EVEN":
                  marketCount = oddEvenCount;
                  break;
                case "PERIODS":
                  marketCount = periodCount;
                  break;
                case "OTHERS":
                  marketCount = otherCount;
                  break;
                default:
                  marketCount = marketGroups.length;
                  break;
              }
            }

            return (
              <button
                className={cx(
                  { [classes["active"]]: selectedSorting === tab.code },
                  {
                    [classes["disabled"]]: !isEnabled(
                      tab.code,
                      hasMoneyLine,
                      hasOverUnder,
                      hasHandicap,
                      hasOddEven,
                      hasPeriod,
                      hasOther,
                    ),
                  },
                )}
                key={tab.code}
                style={{ fontSize: "11px" }}
                type="button"
                onClick={() => setSelectedSorting(tab.code)}
              >
                {`${t(tab.translationKey)} [${marketCount}]`}
              </button>
            );
          })}
        </div>
        <div className={classes["live__sports-wrapper"]}>
          {selectedMarketGroups?.slice(0, maxLeftMarketIndex).map((marketGroup) => (
            <SportExpandingResults
              eventId={eventId}
              key={marketGroup.key}
              label={marketGroup.key}
              listOfFavouriteMarkets={listOfFavouriteMarkets}
              markets={marketGroup.markets}
              setListOfFavouriteMarkets={setListOfFavouriteMarkets}
            />
          ))}
        </div>
      </div>
      <div className={`${classes["live__sport-wrapper"]} ${classes["live__sports-right"]}`}>
        {selectedMarketGroups?.slice(maxLeftMarketIndex, selectedMarketGroups?.length).map((marketGroup) => (
          <SportExpandingResults
            eventId={eventId}
            key={marketGroup.key}
            label={marketGroup.key}
            listOfFavouriteMarkets={listOfFavouriteMarkets}
            markets={marketGroup.markets}
            setListOfFavouriteMarkets={setListOfFavouriteMarkets}
          />
        ))}
      </div>
    </div>
  );
};

LiveEventDetail.propTypes = {
  eventId: PropTypes.number,
  listOfFavouriteMarkets: PropTypes.array.isRequired,
  setListOfFavouriteMarkets: PropTypes.func.isRequired,
};

LiveEventDetail.defaultProps = {
  eventId: undefined,
};

export default React.memo(LiveEventDetail);

import cx from "classnames";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ResizeObserver from "resize-observer-polyfill";

import { getCmsLayoutCompactDesktopLiveWidgetScoreboardMatchTracker } from "../../../../../../../redux/reselect/cms-layout-widgets";
import { setActiveMatchTracker } from "../../../../../../../redux/slices/liveSlice";
import { useLiveData } from "../../../../../../common/hooks/useLiveData";
import MatchDropdownPanel from "../../../../../components/MatchDropdownPanel";
import classes from "../../../../../scss/vanilladesktop.module.scss";
import { getNavigationTabs } from "../../../../LiveEventDetail/components/live-utils";
import LiveMatchTrackerScoreboard from "../../../../LiveEventDetail/components/LiveMatch/components/LiveMatchTrackerScoreboard";
import LiveNativeScoreboard from "../../../../LiveEventDetail/components/LiveMatch/components/LiveNativeScoreboard";
import NavigationTabs from "../../../../LiveEventDetail/components/NavigationTabs";

const HEADER_HEIGHT = 40;
const MARGIN_HEIGHT = 10;
const MARKET_HEIGHT = 46;

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

const CompactLiveMatch = ({ eventId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigationTabs = useMemo(() => getNavigationTabs(t), [t]);

  const matchTrackerWidget = useSelector(getCmsLayoutCompactDesktopLiveWidgetScoreboardMatchTracker);

  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, eventId ? `event-${eventId}` : null);

  const [leftSideHeight, setLeftSideHeight] = useState(0);
  const [selectedSorting, setSelectedSorting] = useState(navigationTabs[0].code);

  useEffect(() => {
    // create an Observer instance
    const resizeObserver = new ResizeObserver((entries) => {
      // console.log("Body client height changed:", entries[0].target.clientHeight);
      // console.log("Body scroll height changed:", entries[0].target.scrollHeight);
      // console.log("Body client width changed:", entries[0].target.clientWidth);
      // console.log("Body scroll width changed:", entries[0].target.scrollWidth);

      const target = entries[0].target;
      const height = Math.min(target.clientHeight, target.scrollHeight);

      const adjustedHeight = height;
      setLeftSideHeight(adjustedHeight > 0 ? adjustedHeight : 0);
    });

    // start observing a DOM node
    resizeObserver.observe(document.getElementById("live-left-side"));
  }, []); // Empty array ensures that effect is only run on mount

  const feedCode = eventLiveData?.feedCode;
  const sportCode = eventLiveData?.sport;
  const hasMatchTracker = eventLiveData?.hasMatchTracker;

  useEffect(() => {
    if (feedCode && hasMatchTracker) {
      dispatch(setActiveMatchTracker({ feedCode, hasMatchTracker, sportCode }));
    } else {
      dispatch(setActiveMatchTracker(undefined));
    }

    return undefined;
  }, [feedCode, sportCode, hasMatchTracker]);

  const getMarketGroups = useCallback((markets) => {
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

    return Object.values(marketGroupHash).sort((a, b) => a.ordinal - b.ordinal);
  }, []);

  const marketGroups = useMemo(
    () => (eventLiveData?.markets ? getMarketGroups(Object.values(eventLiveData?.markets)) : []),
    [eventLiveData?.markets],
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
        totalHeight =
          totalHeight + HEADER_HEIGHT + MARKET_HEIGHT * marketDepth + (i < marketGroups.length - 1 ? MARGIN_HEIGHT : 0);

        if (totalHeight > leftSideHeight) {
          // console.log(`Market index: ${i}. Total Height: ${totalHeight} exceeds panel height: ${leftSideHeight} `);
          return i;
        }
      }

      return Math.max(0, marketGroups.length);
    },
    [leftSideHeight],
  );

  const maxLeftMarketIndex = useMemo(
    () => getMaxLeftMarketIndex(selectedMarketGroups),
    [leftSideHeight, selectedMarketGroups],
  );

  return (
    <>
      <div className={classes["live-event-detail-match"]} style={{ marginBottom: "10px" }}>
        {matchTrackerWidget &&
          matchTrackerWidget?.data?.mode === "BETRADAR" &&
          matchTrackerWidget?.data?.sports?.includes(eventLiveData?.sport) &&
          eventLiveData.hasMatchTracker && <LiveMatchTrackerScoreboard matchTrackerWidget={matchTrackerWidget} />}
        {eventLiveData &&
          (matchTrackerWidget?.data?.mode === "NATIVE" ||
            (matchTrackerWidget?.data?.mode === "BETRADAR" &&
              (!matchTrackerWidget?.data?.sports?.includes(eventLiveData?.sport) ||
                !eventLiveData.hasMatchTracker))) && (
            <LiveNativeScoreboard
              aPeriodScores={
                eventLiveData.aScore ? [...eventLiveData.pScores.map((periodScore) => periodScore.aScore)] : []
              }
              aScore={eventLiveData.aScore ? eventLiveData.aScore : 0}
              cMin={eventLiveData.cMin}
              cPeriod={eventLiveData.cPeriod}
              cSec={eventLiveData.cSec}
              cStatus={eventLiveData.cStatus}
              cType={eventLiveData.cType}
              eventId={eventLiveData.eventId}
              hPeriodScores={
                eventLiveData.hScore ? [...eventLiveData.pScores.map((periodScore) => periodScore.hScore)] : []
              }
              hScore={eventLiveData.hScore ? eventLiveData.hScore : 0}
              icons={eventLiveData.icons}
              isOpAActive={eventLiveData.activeOp === "a"}
              isOpBActive={eventLiveData.activeOp === "b"}
              isPaused={eventLiveData.cStatus !== "STARTED"}
              opADesc={eventLiveData.opADesc}
              opBDesc={eventLiveData.opBDesc}
            />
          )}
      </div>
      <div>
        <NavigationTabs
          hasHandicap={hasHandicap}
          hasMoneyLine={hasMoneyLine}
          hasOddEven={hasOddEven}
          hasOther={hasOther}
          hasOverUnder={hasOverUnder}
          hasPeriod={hasPeriod}
          selectedSorting={selectedSorting}
          setSelectedSorting={setSelectedSorting}
        />
      </div>
      <div
        className={cx(
          classes["central-section__content"],
          classes["central-section__container"],
          classes["compact-blocks"],
        )}
      >
        <div className={classes["compact-blocks__container"]} id="live-left-side">
          <div className={classes["match-spoilers"]}>
            {selectedMarketGroups?.slice(0, maxLeftMarketIndex).map((marketGroup) => (
              <MatchDropdownPanel
                autoExpand
                eventId={eventId}
                key={marketGroup.key}
                label={marketGroup.key}
                markets={marketGroup.markets}
              />
            ))}
          </div>
        </div>
        <div className={classes["compact-blocks__container"]} id="live-right-side">
          <div className={classes["match-spoilers"]}>
            {selectedMarketGroups?.slice(maxLeftMarketIndex, selectedMarketGroups?.length).map((marketGroup, index) => (
              <MatchDropdownPanel
                autoExpand={index < 10}
                eventId={eventId}
                key={marketGroup.key}
                label={marketGroup.key}
                markets={marketGroup.markets}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
};
CompactLiveMatch.propTypes = propTypes;

export default CompactLiveMatch;

import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getCmsLayoutDesktopLiveWidgetScoreboardMatchTracker } from "../../../../../../redux/reselect/cms-layout-widgets";
import { useLiveData } from "../../../../../common/hooks/useLiveData";
import MatchDropdownPanel from "../../../../components/MatchDropdownPanel";
import classes from "../../../../scss/vanilladesktop.module.scss";
import { getNavigationTabs } from "../live-utils";
import NavigationTabs from "../NavigationTabs";

import LiveMatchTrackerScoreboard from "./components/LiveMatchTrackerScoreboard";
import LiveNativeScoreboard from "./components/LiveNativeScoreboard";

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

const LiveMatch = ({ eventId }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const navigationTabs = useMemo(() => getNavigationTabs(t), [t]);

  const matchTrackerWidget = useSelector((state) =>
    getCmsLayoutDesktopLiveWidgetScoreboardMatchTracker(state, location),
  );

  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, eventId ? `event-${eventId}` : null);

  const [selectedSorting, setSelectedSorting] = useState(navigationTabs[0].code);

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

  return (
    <>
      <div className={classes["live-event-detail-match"]}>
        {matchTrackerWidget &&
          matchTrackerWidget?.data?.mode === "BETRADAR" &&
          matchTrackerWidget?.data?.sports?.includes(eventLiveData?.sport) &&
          eventLiveData?.hasMatchTracker && <LiveMatchTrackerScoreboard matchTrackerWidget={matchTrackerWidget} />}
        {eventLiveData &&
          (matchTrackerWidget?.data?.mode === "NATIVE" ||
            (matchTrackerWidget?.data?.mode === "BETRADAR" &&
              (!matchTrackerWidget?.data?.sports?.includes(eventLiveData?.sport) ||
                !eventLiveData?.hasMatchTracker))) && (
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
      <div className={classes["central-section__content"]}>
        <div className={classes["central-section__container"]}>
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

          <div className={classes["match-spoilers"]}>
            {selectedMarketGroups?.map((marketGroup, index) => (
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
LiveMatch.propTypes = propTypes;

export default React.memo(LiveMatch);

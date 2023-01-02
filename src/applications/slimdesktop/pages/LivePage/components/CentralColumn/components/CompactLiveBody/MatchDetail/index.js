import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

import { getCmsLayoutDesktopLiveWidgetScoreboardMatchTracker } from "../../../../../../../../../redux/reselect/cms-layout-widgets";
import { setActiveMatchTracker } from "../../../../../../../../../redux/slices/liveSlice";
import { filterMarkets, groupMarkets } from "../../../../../../../../../utils/eventsHelpers";
import { getNavigationTabs } from "../../../../../../PrematchPage/components/CentralColumn/components/CompactPrematchBody/RightCompactColumn/components/PrematchNavigationTabs/constants";
import RightMatchOutcome from "../../../../../../PrematchPage/components/CentralColumn/components/CompactPrematchBody/RightCompactColumn/components/RightMatchOutcome";

import LiveNativeScoreboard from "./components/LiveNativeScoreboard";
import ScoreboardMatchTracker from "./components/ScoreboardMatchTracker";

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

const getRows = (selections) => {
  const selectionsPerRow = selections.length === 3 ? 3 : 2;

  const rows = selections.reduce((result, value, index, array) => {
    if (index % selectionsPerRow === 0) result.push(array.slice(index, index + selectionsPerRow));

    return result;
  }, []);

  return rows;
};

const MatchDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [openMarkets, setOpenMarkets] = useState([]);

  const matchTrackerWidget = useSelector((state) =>
    getCmsLayoutDesktopLiveWidgetScoreboardMatchTracker(state, location),
  );

  const navigationTabs = useMemo(() => getNavigationTabs(t), [t]);

  const [selectedMarketTypeGroupTab, setSelectedMarketTypeGroupTab] = useState(navigationTabs[0].code);

  const { eventId: eventIdStr } = useParams();

  const eventId = eventIdStr ? Number(eventIdStr) : undefined;

  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  useEffect(() => {
    if (eventLiveData?.feedCode) {
      dispatch(setActiveMatchTracker({ feedCode: eventLiveData.feedCode, sportCode: eventLiveData.sport }));
    }

    return undefined;
  }, [eventLiveData]);

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
    () =>
      eventLiveData?.markets
        ? getMarketGroups(Object.values(eventLiveData?.markets).sort((a, b) => a.ordinal - b.ordinal))
        : [],
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

  const onToggleMarketHandler = (id) => {
    if (openMarkets.includes(id)) {
      setOpenMarkets(openMarkets.filter((x) => x !== id));
    } else {
      setOpenMarkets([...openMarkets, id]);
    }
  };

  if (!eventId) return null;

  return (
    <div className={classes["content__box-2"]}>
      <div className={cx(classes["content-tabs"], classes["content-tabs--game-split"])}>
        <div className={cx(classes["content-tabs-controls"], classes["content-tabs-controls--full"])}>
          <a
            className={cx(
              classes["content-tabs-controls__game-link"],
              classes["content-tabs-controls__link"],
              classes["content-tabs-controls__link_active"],
            )}
            href="#tab-game-1"
          >
            <span className={classes["qicon-match-tracker"]} />
            {t("match_tracker")}
          </a>
          {/* <a href="#tab-game-2" className={classes['content-tabs-controls__game-link content-tabs-controls__link']}> */}
          {/*    <span className={classes['qicon-video-camera']}></span> */}
          {/*    Video stream */}
          {/* </a> */}
        </div>
        <div className={classes["content-tabs__content"]}>
          <div className={cx(classes["content-tab"], classes["content-tab_active"])}>
            {matchTrackerWidget &&
              matchTrackerWidget?.data?.mode === "BETRADAR" &&
              matchTrackerWidget?.data?.sports?.includes(eventLiveData?.sport) &&
              eventLiveData.hasMatchTracker && (
                <div className={classes["content-tab__game"]}>
                  <ScoreboardMatchTracker eventId={eventId} />
                </div>
              )}

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
        </div>
      </div>
      <div className={classes["content-tabs"]}>
        <div
          className={cx(
            classes["content-tabs_special"],
            classes["content-tabs-controls"],
            classes["content-tabs_special"],
          )}
        >
          {navigationTabs.map((tab, index) => (
            <div
              className={cx(
                classes["content-tabs__controls-link"],
                classes["content-tabs-controls__link"],
                { [classes["content-tabs-controls__link_active"]]: tab.code === selectedMarketTypeGroupTab },
                {
                  [classes["content-tabs-controls__link_disabled"]]: !isEnabled(
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
              key={index}
              onClick={() => setSelectedMarketTypeGroupTab(tab.code)}
            >
              {tab.desc}
            </div>
          ))}
        </div>

        <div className={classes["content-tabs__content"]}>
          <div className={cx(classes["content-tab"], { [classes["content-tab_active"]]: true })} id="tab-1">
            {(eventLiveData?.markets
              ? groupMarkets(
                  filterMarkets(
                    selectedMarketTypeGroupTab,
                    Object.values(eventLiveData.markets)
                      .sort((a, b) => a.ordinal - b.ordinal)
                      .map((x) => ({
                        desc: x.mDesc,
                        id: x.mId,
                        mOpen: x.mOpen,
                        marketTypeGroup: x.mGroup,
                        period: x.pDesc,
                        periodAbrv: x.pAbrv,
                        sels: x.sels,
                      })),
                  ),
                )
              : []
            ).map((submarkets, index) => (
              <div className={classes["content-dropdown"]} key={index}>
                <div
                  className={cx(classes["content-dropdown__head"], {
                    [classes["active"]]: openMarkets.includes(submarkets[0].id),
                  })}
                  onClick={() => onToggleMarketHandler(submarkets[0].id)}
                >
                  <div className={classes["content-dropdown__title"]}>
                    <b>{submarkets.length > 0 ? `${submarkets[0].desc} - ${submarkets[0].period}` : ""}</b>
                  </div>
                  <div className={cx(classes["content-dropdown__arrow"], classes["js-dropdown"])}>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </div>
                {openMarkets.includes(submarkets[0].id) && (
                  <div
                    className={cx(classes["content-dropdown__body"], classes["js-dropdown-box"])}
                    style={{ display: "block" }}
                  >
                    {submarkets.map((market) => {
                      const rows = getRows(
                        market.sels.map((sel) => ({
                          desc: sel.oDesc,
                          dir: sel.dir,
                          hidden: sel.hidden || !market.mOpen,
                          id: sel.oId,
                          price: sel.formattedPrice,
                          priceId: sel.pId,
                        })),
                      );

                      return rows.map((row, index) => (
                        <div className={classes["content-dropdown__row"]} key={index}>
                          {row.map((outcome, index2) => (
                            <RightMatchOutcome
                              coefficient={outcome}
                              coefficientCount={market.sels.length}
                              eventId={eventId}
                              index={index2}
                              key={outcome.id}
                            />
                          ))}
                        </div>
                      ));
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MatchDetail);

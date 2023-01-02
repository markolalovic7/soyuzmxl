import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BetSlipColumn from "applications/ollehdesktop/components/BetSlipColumn";
import SidebarModeSelector from "applications/ollehdesktop/components/SidebarModeSelector";
import amfbBackgroundImage from "applications/ollehdesktop/img/left-column/amfb.png";
import baseBackgroundImage from "applications/ollehdesktop/img/left-column/base.png";
import baskBackgroundImage from "applications/ollehdesktop/img/left-column/bask.png";
import boxiBackgroundImage from "applications/ollehdesktop/img/left-column/boxi.png";
import curlBackgroundImage from "applications/ollehdesktop/img/left-column/curl.png";
import dartBackgroundImage from "applications/ollehdesktop/img/left-column/dart.png";
import footBackgroundImage from "applications/ollehdesktop/img/left-column/foot.png";
import handBackgroundImage from "applications/ollehdesktop/img/left-column/hand.png";
import tablBackgroundImage from "applications/ollehdesktop/img/left-column/tabl.png";
import tennBackgroundImage from "applications/ollehdesktop/img/left-column/tenn.png";
import vollBackgroundImage from "applications/ollehdesktop/img/left-column/voll.png";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";

import { makeGetBetslipOutcomeIds } from "../../../../../redux/reselect/betslip-selector";
import { getDesktopBetslipMaxSelections } from "../../../../../redux/reselect/cms-layout-widgets";
import { getSportsSelector } from "../../../../../redux/reselect/sport-selector";
import { getSportsTreeSelector } from "../../../../../redux/reselect/sport-tree-selector";
import { getImg } from "../../../../../utils/bannerHelpers";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../utils/betslip-utils";
import { getEvent, getPathDescription } from "../../../../../utils/eventsHelpers";
import { isNotEmpty } from "../../../../../utils/lodash";
import { getEvents } from "../../../../../utils/prematch-data-utils";
import {
  getPatternBetradarVirtual,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternPrematch,
} from "../../../../../utils/route-patterns";
import Jersey from "../../../../common/components/Jersey";
import { useCouponData } from "../../../../common/hooks/useCouponData";
import LeaguesSideBar from "../../../components/LeaguesSideBar";
import { SIDEBAR_SPORT_MODE } from "../../../components/SidebarModeSelector/constants";
import { NAVIGATION_TABS } from "../../LivePage/constants";

import SportExpandingResults from "./SportExpandingResults";
import SportLeagueSelector from "./SportLeagueSelector";
import SportSummary from "./SportSummary";

const getSportBackgroundImage = (sportCode) => {
  switch (sportCode) {
    case "FOOT":
      return footBackgroundImage;
    case "HAND":
      return handBackgroundImage;
    case "DART":
      return dartBackgroundImage;
    case "BOXI":
      return boxiBackgroundImage;
    case "AMFB":
      return amfbBackgroundImage;
    case "BASK":
      return baskBackgroundImage;
    case "BASE":
      return baseBackgroundImage;
    case "TABL":
      return tablBackgroundImage;
    case "CURL":
      return curlBackgroundImage;
    case "TENN":
      return tennBackgroundImage;
    case "VOLL":
      return vollBackgroundImage;
    default:
      return undefined;
  }
};

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

const SportsPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const { eventPathId: eventPathIDStr } = useParams();

  const eventPathId = eventPathIDStr ? Number(eventPathIDStr) : undefined;

  const sports = useSelector(getSportsSelector);
  const sportTreeData = useSelector(getSportsTreeSelector);

  useEffect(() => {
    if (!eventPathId && isNotEmpty(sportTreeData)) {
      const firstSport = sportTreeData.filter((x) => Object.keys(x.criterias).find((x) => x.startsWith("d")))[0];
      const firstCountry = firstSport.path.filter((x) => Object.keys(x.criterias).find((x) => x.startsWith("d")))[0];
      const firstLeague = firstCountry.path.filter((x) => Object.keys(x.criterias).find((x) => x.startsWith("d")))[0];

      const firstEventPathId = firstLeague.id;
      history.push(`/prematch/eventpath/${firstEventPathId}`);
    }
  }, [eventPathId, sportTreeData]);

  // useMemo to get the current Sport, sportCountries, currentCountry, countryLeagues, currentLeague - OFF sportsTreeData
  const { countryLeagues, selectedCountry, selectedLeague, sportCode, sportCountries } = useMemo(() => {
    if (!isEmpty(sportTreeData)) {
      for (let i = 0; i < sportTreeData.length; i++) {
        // sport
        const sportCountries = sportTreeData[i].path.filter((x) =>
          Object.keys(x.criterias).find((x) => x.startsWith("d")),
        );

        for (let j = 0; j < sportCountries.length; j++) {
          // country

          // Skip if only outrights
          if (!Object.keys(sportCountries[j].criterias).find((x) => x.startsWith("d"))) continue;

          const countryLeagues = sportCountries[j].path.filter((x) =>
            Object.keys(x.criterias).find((x) => x.startsWith("d")),
          );

          for (let k = 0; k < countryLeagues.length; k++) {
            // league

            // Skip if only outrights
            if (!Object.keys(countryLeagues[k].criterias).find((x) => x.startsWith("d"))) continue;

            if (countryLeagues[k].id === eventPathId) {
              return {
                countryLeagues,
                selectedCountry: sportCountries[j],
                selectedLeague: countryLeagues[k],
                sportCode: sportTreeData[i].code,
                sportCountries,
              };
            }
          }
        }
      }
    }

    return {
      countryLeagues: undefined,
      selectedCountry: undefined,
      selectedLeague: undefined,
      sportCode: undefined,
      sportCountries: undefined,
    };
  }, [eventPathId, sportTreeData]);

  // usePrematch Data hook for the matches for the league.

  const code = eventPathId ? `p${eventPathId}` : undefined;
  const pathCouponData = useSelector((state) => state.coupon.couponData[code]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[code]);

  // ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"]
  useCouponData(dispatch, code, "GAME", false, null, false, false, true, false, null, false, null, null);

  const { eventId: eventIdStr } = useParams();
  const eventId = eventIdStr ? Number(eventIdStr) : undefined;

  useEffect(() => {
    if (!eventId && eventPathId && isNotEmpty(pathCouponData)) {
      const events = getEvents(Object.values(pathCouponData));

      if (events.length > 0) {
        history.push(`/prematch/eventpath/${eventPathId}/event/${events[0].id}`);
      }
    }
  }, [eventId, eventPathId, pathCouponData]);

  //  usePrematch data hook for the specific match detail.

  // Event section
  const eventCode = eventId ? `e${eventId}` : undefined;
  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);

  useCouponData(dispatch, eventCode, "ALL", true, null, false, false, false, true, null);

  const activeMatch = getEvent(eventCouponData);
  const pathDescription = eventCouponData ? getPathDescription(eventCouponData) : "";

  const markets = activeMatch ? Object.values(activeMatch.children) : [];

  // --- ---

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);
  const compactBetslipMode = true;

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length >= maxBetslipSelections && !betslipOutcomeIds.find((x) => x === outcomeId)) {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    } else {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  const [selectedSorting, setSelectedSorting] = useState(NAVIGATION_TABS[0].code);

  const getMarketGroups = useCallback((markets) => {
    const marketGroupHash = {};

    markets.forEach((market) => {
      const key = `${market.desc} - ${market.period}`;
      const desc = market.desc;
      const marketTypeGroup = market.marketTypeGroup;
      const period = market.period;
      const periodAbrv = market.periodAbrv;
      const ordinal = market.pos;
      const marketTO = {
        desc,
        id: market.mId,
        marketTypeGroup,
        open: market.open,
        outcomes: Object.values(market.children).map((sel) => ({
          desc: sel.desc,
          dir: sel.priceDir,
          hidden: sel.hidden || !market.open,
          id: sel.id,
          price: sel.price,
          priceId: sel.priceId,
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

  const marketGroups = useMemo(() => (markets ? getMarketGroups(markets) : []), [markets]);

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
    <main className={classes["main"]}>
      <div className={classes["left__column"]}>
        <SidebarModeSelector sideBarMode={SIDEBAR_SPORT_MODE} />
        <LeaguesSideBar />
      </div>
      <div className={classes["main__column"]}>
        <div className={classes["main__column-top"]}>
          <div className={classes["top__nav"]}>
            <div className={classes["top__nav-icon"]}>
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </div>
            <ul className={classes["top__nav-left"]}>
              <li>
                <Link to={getPatternPrematch()}>{t("sports")}</Link>
              </li>
              <li>
                <Link to={getPatternLive()}>{t("in_play_page")}</Link>
              </li>
            </ul>
          </div>
          <div className={classes["top__nav"]}>
            <ul className={classes["top__nav-right"]}>
              <li>
                <Link to={getPatternBetradarVirtual()}>{t("virtual_sports")}</Link>
              </li>
              <li>
                <Link className={classes["active"]} to={getPatternLiveCalendar()}>
                  {t("live_calendar")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {sportTreeData && selectedLeague && (
          <div className={classes["live__sports"]}>
            <div className={classes["live__sports-left"]}>
              <div className={classes["matches"]}>
                <div className={classes["matches-sorting"]}>
                  <div className={classes["matches-sorting__container"]}>
                    <div className={classes["matches-sorting__header"]}>
                      <div className={cx(classes["matches-sorting__arrow"], classes["matches-sorting__arrow_left"])}>
                        <span />
                      </div>
                      <div className={classes["matches-sorting__tabs"]}>
                        <div className={classes["matches-sorting__tab"]}>{selectedCountry.desc}</div>
                        <div className={classes["matches-sorting__tab"]}>{selectedLeague.desc}</div>
                      </div>
                      <div className={cx(classes["matches-sorting__arrow"], classes["matches-sorting__arrow_right"])}>
                        <span />
                      </div>
                    </div>
                    <SportLeagueSelector countryLeagues={countryLeagues} sportCountries={sportCountries} />
                  </div>
                </div>
                <div className={classes["matches__league league"]}>
                  <div className={classes["league__container"]}>
                    <div className={classes["league__tab"]}>
                      <div className={classes["league__arrow"]}>
                        <svg height="8" viewBox="0 0 5 8" width="8" xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <g>
                              <path d="M-.56 6.5L2.5 3.407 5.56 6.5l.94-.957-4-4.043-4 4.043z" fill="#aaa" />
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div className={cx(classes["league__open"], classes["active"])}>open</div>
                      <div className={classes["league__close"]}>close</div>
                      <div className={classes["league__arrow"]}>
                        <svg height="8" viewBox="0 0 5 8" width="8" xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <g>
                              <path d="M-.56 6.5L2.5 3.407 5.56 6.5l.94-.957-4-4.043-4 4.043z" fill="#aaa" />
                            </g>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className={cx(classes["league__spoilers"], classes["active"])}>
                    <div className={classes["league__spoiler"]}>
                      <div className={classes["league__spoiler-header"]}>
                        {[
                          "FOOT",
                          "HAND",
                          "DART",
                          "BOXI",
                          "AMFB",
                          "BASK",
                          "BASE",
                          "TABL",
                          "CURL",
                          "TENN",
                          "VOLL",
                        ].includes(sportCode) && (
                          <div className={cx(classes["league__spoiler-background"])}>
                            <img alt="sport" src={getSportBackgroundImage(sportCode)} />
                          </div>
                        )}
                        {/* <div className={cx(classes["league__spoiler-arrow"], {[classes['active']]: true})}> */}
                        {/*  <svg height="8" viewBox="0 0 5 8" width="8" xmlns="http://www.w3.org/2000/svg"> */}
                        {/*    <g> */}
                        {/*      <g> */}
                        {/*        <path d="M-.56 6.5L2.5 3.407 5.56 6.5l.94-.957-4-4.043-4 4.043z" fill="#aaa" /> */}
                        {/*      </g> */}
                        {/*    </g> */}
                        {/*  </svg> */}
                        {/* </div> */}
                        <div className={classes["league__spoiler-text"]}>
                          <div className={classes["league__spoiler-title"]}>{selectedCountry.desc}</div>
                          <div className={classes["league__spoiler-country"]}>{`/ ${selectedLeague.desc}`}</div>
                        </div>
                        <div className={classes["league__spoiler-sport"]}>
                          {sports && sportCode ? sports[sportCode].desc : ""}
                        </div>
                        <div className={classes["league__spoiler-cross"]}>
                          <svg height="8" viewBox="0 0 8 8" width="8" xmlns="http://www.w3.org/2000/svg">
                            <g>
                              <g>
                                <path
                                  d="M8 .806L7.194 0 4 3.194.806 0 0 .806 3.194 4 0 7.194.806 8 4 4.806 7.194 8 8 7.194 4.806 4z"
                                  fill="#ccc"
                                />
                              </g>
                            </g>
                          </svg>
                        </div>
                      </div>
                      {pathCouponData &&
                        getEvents(Object.values(pathCouponData)).map((match) => {
                          const markets = match?.children ? Object.values(match.children) : [];
                          const outcomes =
                            markets.length > 0 && markets[0].children ? Object.values(markets[0].children) : [];

                          return (
                            <SportSummary
                              count={match.count}
                              desc={match.desc}
                              epoch={match.epoch}
                              eventId={match.id}
                              eventPathId={eventPathId}
                              key={match.id}
                              outcomes={outcomes}
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={classes["live__sports-right"]}>
              {activeMatch && (
                <>
                  <div className={classes["live__scoreboard-sport"]}>
                    <div className={classes["live__scoreboard-sport__img"]}>
                      <img alt="sport" src={getImg(sportCode)} />
                    </div>
                    <div className={classes["live__scoreboard-sport-top"]}>
                      <span className={cx(classes["qicon-default"], classes[`qicon-${sportCode}`], classes["icon"])} />
                      <p>
                        <span>{pathDescription}</span>
                      </p>
                    </div>
                    <div className={classes["live__scoreboard-sport-bet"]}>
                      <div className={classes["live__scoreboard-sport-host"]}>
                        <div className={classes["live__totalscore-logoleft"]}>
                          <Jersey
                            baseColor={activeMatch?.icons?.a?.bc}
                            countryCode={activeMatch?.icons?.a?.cc}
                            horizontalStripesColor={activeMatch?.icons?.a?.hsc}
                            jerseyNumberColor={undefined}
                            shirtType={
                              activeMatch?.icons?.a?.st ||
                              (activeMatch?.icons?.a?.cc && !activeMatch?.icons?.a?.bc && "flag")
                            }
                            sleeveColor={activeMatch?.icons?.a?.slc}
                            sleeveDetailColor={activeMatch?.icons?.a?.sdc}
                            splitColor={activeMatch?.icons?.a?.spc}
                            squareColor={activeMatch?.icons?.a?.sqc}
                            verticalStripesColor={activeMatch?.icons?.a?.vsc}
                          />
                        </div>
                        <div className={classes["live__totalscore-name"]}>
                          {Object.values(markets[0].children)[0].desc}
                        </div>
                        {markets?.length > 0 && (
                          <div
                            onClick={() =>
                              toggleBetslipHandler(Object.values(markets[0].children)[0].id, activeMatch.id)
                            }
                          >
                            <a
                              className={cx(classes["live__scoreboard-sport-bet__item"], {
                                [classes["selected"]]: betslipOutcomeIds.includes(
                                  Object.values(markets[0].children)[0].id,
                                ),
                              })}
                            >
                              {Object.values(markets[0].children)[0].price}
                            </a>
                          </div>
                        )}
                      </div>

                      {Object.values(markets[0].children)?.length >= 3 && (
                        <div
                          className={classes["live__scoreboard-sport-centerbet"]}
                          onClick={() => toggleBetslipHandler(Object.values(markets[0].children)[1].id, activeMatch.id)}
                        >
                          <a
                            className={cx(classes["live__scoreboard-sport-bet__item"], {
                              [classes["selected"]]: betslipOutcomeIds.includes(
                                Object.values(markets[0].children)[1].id,
                              ),
                            })}
                          >
                            {Object.values(markets[0].children)[1].price}
                          </a>
                        </div>
                      )}

                      <div className={classes["live__scoreboard-sport-guest"]}>
                        {Object.values(markets[0].children)?.length >= 2 && (
                          <div
                            onClick={() =>
                              toggleBetslipHandler(
                                Object.values(markets[0].children)[Object.values(markets[0].children).length - 1].id,
                                activeMatch.id,
                              )
                            }
                          >
                            <a
                              className={cx(classes["live__scoreboard-sport-bet__item"], {
                                [classes["selected"]]: betslipOutcomeIds.includes(
                                  Object.values(markets[0].children)[Object.values(markets[0].children).length - 1].id,
                                ),
                              })}
                            >
                              {Object.values(markets[0].children)[Object.values(markets[0].children).length - 1].price}
                            </a>
                          </div>
                        )}
                        <div className={classes["live__totalscore-name"]}>
                          {Object.values(markets[0].children)[Object.values(markets[0].children).length - 1].desc}
                        </div>
                        <div className={classes["live__totalscore-logoright"]}>
                          <Jersey
                            baseColor={activeMatch?.icons?.b?.bc}
                            countryCode={activeMatch?.icons?.b?.cc}
                            horizontalStripesColor={activeMatch?.icons?.b?.hsc}
                            jerseyNumberColor={undefined}
                            shirtType={
                              activeMatch?.icons?.b?.st ||
                              (activeMatch?.icons?.b?.cc && !activeMatch?.icons?.b?.bc && "flag")
                            }
                            sleeveColor={activeMatch?.icons?.b?.slc}
                            sleeveDetailColor={activeMatch?.icons?.b?.sdc}
                            splitColor={activeMatch?.icons?.b?.spc}
                            squareColor={activeMatch?.icons?.b?.sqc}
                            verticalStripesColor={activeMatch?.icons?.b?.vsc}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={classes["live__scoreboard-sport-close"]}>
                      {" "}
                      {t("vanilladesktop.bets_close_at", {
                        time: dayjs.unix(markets[0].epoch / 1000).format("D MMMM hh:mm A"),
                      })}
                    </div>
                  </div>
                  <div className={classes["live__sports-navigation"]}>
                    <span>Filter By:</span>
                    {NAVIGATION_TABS.map((tab) => {
                      let marketCount = 0;
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
                    {selectedMarketGroups?.slice(0, selectedMarketGroups.length).map((marketGroup) => (
                      <SportExpandingResults
                        eventId={eventId}
                        key={marketGroup.key}
                        label={marketGroup.key}
                        markets={marketGroup.markets}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <BetSlipColumn />
    </main>
  );
};

export default React.memo(SportsPage);

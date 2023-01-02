import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import { useLiveData } from "../../../../../common/hooks/useLiveData";
import classes from "../../../../scss/vanillamobilestyle.module.scss";
import AdditionalMarket from "../../AdditionalMarket/AdditionalMarket";

import "../../../../scss/sportradar-match-tracker-theme.css";
import LiveMatchTracker from "./LiveMatchTracker/LiveMatchTracker";
import LiveMatchTrackerScoreboard from "./LiveMatchTrackerScoreboard/LiveMatchTrackerScoreboard";
import LiveNativeScoreboard from "./LiveNativeScoreboard";

import SectionLoader from "applications/vanillamobile/common/components/SectionLoader";
import { getCmsLayoutMobileVanillaLiveWidgetMatchTracker } from "redux/reselect/cms-layout-widgets";

const compare = (a, b) => a.ordinal - b.ordinal;

const sanitizePriceDir = (dir) => {
  if (dir === ">") return "u";
  if (dir === "<") return "d";

  return dir;
};

const LiveMatchDetail = (props) => {
  const language = useSelector(getAuthLanguage);

  const matchTrackerWidget = useSelector(getCmsLayoutMobileVanillaLiveWidgetMatchTracker);

  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    if (matchTrackerWidget?.data?.mode === "BETRADAR") {
      const clientId = matchTrackerWidget.data.betradarClientId;
      const script = document.createElement("script");
      script.innerHTML = `(function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h))})(window,document,"script", "https://widgets.sir.sportradar.com/${clientId}/widgetloader", "SIR", {
                              theme: false, // using custom theme
                              language: "${language}"
                          });`;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        window.SIR = null; // for good measure
      };
    }

    return undefined;
  }, [matchTrackerWidget, language]);

  const { eventId } = useParams();

  const dispatch = useDispatch();
  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  // Subscribe to the target event Id for the live feed
  useLiveData(dispatch, `event-${eventId}`);

  const [collapsedMarkets, setCollapsedMarkets] = useState([]);
  const toggleMarketHandler = (e, marketId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!collapsedMarkets.includes(marketId)) {
      setCollapsedMarkets([...collapsedMarkets, marketId]);
    } else {
      setCollapsedMarkets(collapsedMarkets.filter((itemId) => itemId !== marketId));
    }
  };

  const decorateMarkets = (rawMarkets) => {
    rawMarkets.sort(compare);

    const processedMarkets = rawMarkets.map((market) => {
      const processedMarket = { desc: market.mDesc, id: market.mId, open: market.mOpen, period: market.pDesc };
      processedMarket.children = market.sels.map((sel) => ({
        desc: sel.oDesc,
        dir: sanitizePriceDir(sel.dir),
        hidden: sel.hidden,
        id: sel.oId,
        price: sel.formattedPrice,
        spread: null,
      }));

      return processedMarket;
    });

    let lastMarketDescription = null;
    let currentGroup = [];
    const groupedMarkets = [];
    processedMarkets.forEach((market) => {
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
    });

    return groupedMarkets;
  };

  const rawMarkets = useMemo(
    () => (eventLiveData && eventLiveData.markets ? Object.values(eventLiveData.markets) : []),
    [eventLiveData],
  );
  const groupedMarkets = useMemo(() => decorateMarkets(Object.values(rawMarkets)), [rawMarkets, decorateMarkets]);

  const [matchTrackerOpen, setMatchTackerOpen] = useState(false);

  const onToggleMatchTracker = () => {
    setMatchTackerOpen(!matchTrackerOpen);
  };

  return eventLiveData ? (
    <main className={classes["main"]}>
      {matchTrackerWidget?.data?.mode === "BETRADAR" &&
        matchTrackerWidget?.data?.sports?.includes(eventLiveData?.sport) &&
        eventLiveData?.hasMatchTracker && (
          <div className={classes["main__score-img"]}>
            <LiveMatchTrackerScoreboard feedcode={eventLiveData.feedCode} matchTrackerWidget={matchTrackerWidget} />
          </div>
        )}
      {(matchTrackerWidget?.data?.mode === "NATIVE" ||
        (matchTrackerWidget?.data?.mode === "BETRADAR" &&
          (!matchTrackerWidget?.data?.sports?.includes(eventLiveData?.sport) || !eventLiveData?.hasMatchTracker))) && (
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
      <div className={classes["main__container_small"]}>
        {matchTrackerWidget?.data?.mode === "BETRADAR" &&
          matchTrackerWidget?.data?.sports?.includes(eventLiveData?.sport) &&
          eventLiveData?.hasMatchTracker && (
            <div className={classes["tracker-wrapper"]}>
              <div
                className={`${classes["tracker"]} ${classes["spoiler-list"]} ${
                  matchTrackerOpen ? classes["active"] : ""
                }`}
                onClick={onToggleMatchTracker}
              >
                <div className={classes["tracker__top"]}>
                  <span className={classes["tracker__icon"]}>
                    <i className={classes["qicon-stats"]} />
                  </span>
                  <span className={classes["tracker__text"]}>Match tracker</span>
                </div>
                <span
                  className={`${classes["tracker__arrow"]} ${classes["spoiler-arrow"]} ${
                    matchTrackerOpen ? classes["active"] : ""
                  }`}
                />
              </div>
              <div className={`${classes["tracker-img"]} ${matchTrackerOpen ? classes["open"] : ""}`}>
                {matchTrackerWidget?.data?.sports?.includes(eventLiveData?.sport) && (
                  <LiveMatchTracker feedcode={eventLiveData.feedCode} matchTrackerWidget={matchTrackerWidget} />
                )}
              </div>
            </div>
          )}

        <div className={classes["matches__body"]}>
          {groupedMarkets &&
            groupedMarkets.map((marketGroup) => (
              <AdditionalMarket
                eventId={eventLiveData.eventId}
                expanded={!collapsedMarkets.includes(marketGroup[0].id)}
                key={marketGroup[0].id}
                marketGroup={marketGroup}
                onToggle={toggleMarketHandler}
              />
            ))}
        </div>
      </div>
    </main>
  ) : (
    <SectionLoader />
  );
};

export default LiveMatchDetail;

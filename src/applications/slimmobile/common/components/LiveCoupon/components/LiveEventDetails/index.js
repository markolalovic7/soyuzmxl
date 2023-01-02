import MarketDetail from "applications/slimmobile/components/Sports/Common/MarketDetail/MarketDetail";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import cloneDeep from "lodash.clonedeep";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "applications/slimmobile/scss/sportradar-match-tracker-theme.css";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LiveEventDetails = (props) => {
  const eventId = props.eventId;
  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  const hasMatchTracker = eventLiveData?.hasMatchTracker;

  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    if (hasMatchTracker && props.feedcode && window.SIR) {
      // call function loaded by BR Script Loader (see LiveCoupon)
      window.SIR("addWidget", ".sr-widget-1", "match.lmtPlus", {
        goalBannerImage: "https://demosite888.com/cmscontent/image/402",
        layout: "double",
        logo: ["https://demosite888.com/cmscontent/image/402"],
        logoLink: "www.google.com",
        matchId: props.feedcode.substring(props.feedcode.lastIndexOf(":") + 1, props.feedcode.length),
        momentum: "extended",
        pitchLogo: "https://demosite888.com/cmscontent/image/402",
        scoreboard: "disable",
      });
    }
  }, [props.feedcode, hasMatchTracker]);

  const compare = (a, b) => a.ordinal - b.ordinal;

  const decorate = (eventLiveData) => {
    if (!eventLiveData) return null;

    const data = cloneDeep(eventLiveData);
    data.id = data.eventId;
    data.marketTypeGroup = data.group;

    data.children = [...Object.values(data.markets)];

    for (const market of data.children) {
      market.id = market.mId;
      market.desc = market.mDesc;
      market.period = market.pDesc;
      market.marketTypeGroup = market.mGroup;
      market.open = market.mOpen;

      market.children = market.sels;
      market.sels = null;

      market.children.forEach((selection) => {
        selection.id = selection.oId;
        selection.desc = selection.oDesc;
        selection.price = selection.formattedPrice;
      });
    }
    data.children.sort(compare);
    data.markets = null;

    return data;
  };

  const decoratedEventLiveData = decorate(eventLiveData);

  const [expandedMarkets, setExpandedMarkets] = useState([]);

  const toggleMarketHandler = (e, marketId) => {
    if (e.target === e.currentTarget) {
      if (!expandedMarkets.includes(marketId)) {
        setExpandedMarkets([...expandedMarkets, marketId]);
      } else {
        setExpandedMarkets(expandedMarkets.filter((itemId) => itemId !== marketId));
      }
    }
  };

  return (
    <div className={`${classes["result__hidden"]} ${classes["active"]}`}>
      <div className={classes["result__hidden-container"]}>
        {props.feedcode && eventLiveData?.hasMatchTracker ? (
          <div className="widgets">
            <div className="sr-widget sr-widget-1" id="sr-widget" />
          </div>
        ) : null}
        <div className={classes["matches"]}>
          <div className={classes["matches__body"]}>
            {!decoratedEventLiveData ? (
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
            ) : (
              <MarketDetail
                expandedMarkets={expandedMarkets}
                mainMarketId={props.mainMarketId}
                match={decoratedEventLiveData}
                toggleMarketHandler={toggleMarketHandler}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LiveEventDetails);

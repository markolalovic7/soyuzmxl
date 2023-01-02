import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useCouponData } from "applications/common/hooks/useCouponData";
import AdditionalMarket from "applications/vanillamobile/components/Sports/AdditionalMarket/AdditionalMarket";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import cx from "classnames";

const compare = (a, b) => a.ordinal - b.ordinal;

const AdditionalMarketContainer = ({ eventId, excludedMarketIds, live, mainMarketId }) => {
  const dispatch = useDispatch();
  const code = `${live ? "l" : "e"}${eventId}`;

  const eventCouponData = useSelector((state) => state.coupon.couponData[code]);

  const [expandedMarkets, setExpandedMarkets] = useState([]);

  useCouponData(dispatch, code, "ALL", true, null, false, false, null);

  const toggleMarketHandler = (e, marketId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!expandedMarkets.includes(marketId)) {
      setExpandedMarkets([...expandedMarkets, marketId]);
    } else {
      setExpandedMarkets(expandedMarkets.filter((itemId) => itemId !== marketId));
    }
  };

  const getEvent = (children) => {
    let event = null;
    if (children) {
      Object.values(children).forEach((child) => {
        if (child.type === "p") {
          // dive deeper...
          const match = getEvent(child.children);
          if (match) {
            event = match;
          }
        } else if (child.type === "e" || child.type === "l") {
          event = child;
        }
      });
    }

    return event;
  };

  const event = getEvent(eventCouponData);

  const groupMarkets = (rawMarkets) => {
    rawMarkets.sort(compare);

    let lastMarketDescription = null;
    let currentGroup = [];
    const groupedMarkets = [];
    rawMarkets.forEach((market) => {
      if (market.id !== mainMarketId && !excludedMarketIds.includes(market.id)) {
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

  const markets = event ? groupMarkets(Object.values(event.children)) : [];

  return (
    <div className={classes["matches__body"]}>
      {isEmpty(markets) && (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        </div>
      )}
      {markets.map((marketGroup) => (
        <AdditionalMarket
          eventId={eventId}
          expanded={expandedMarkets.includes(marketGroup[0].id)}
          key={marketGroup[0].id}
          marketGroup={marketGroup}
          onToggle={toggleMarketHandler}
        />
      ))}
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
  excludedMarketIds: PropTypes.array.isRequired,
  live: PropTypes.number.isRequired,
  mainMarketId: PropTypes.number.isRequired,
};
AdditionalMarketContainer.propTypes = propTypes;

export default React.memo(AdditionalMarketContainer);

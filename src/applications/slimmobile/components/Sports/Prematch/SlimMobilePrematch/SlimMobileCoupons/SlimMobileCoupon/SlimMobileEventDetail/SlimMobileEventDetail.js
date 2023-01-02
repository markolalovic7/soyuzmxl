import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useCouponData } from "../../../../../../../../common/hooks/useCouponData";
import MarketDetail from "../../../../../Common/MarketDetail/MarketDetail";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SlimMobileEventDetail = ({ mainMarketId, matchId }) => {
  const eventId = matchId;

  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);
  const dispatch = useDispatch();
  const eventLoading = useSelector((state) => state.coupon.couponLoading[`e${eventId}`]);

  const [expandedMarkets, setExpandedMarkets] = useState([]);

  useEffect(() => {
    setExpandedMarkets([]); // make sure the state is cleaned while navigating...
  }, [eventId]);

  const code = eventId ? `e${eventId}` : null;
  useCouponData(dispatch, code, "ALL", true, null, false, false, false, false, null);

  const toggleMarketHandler = (e, marketId) => {
    if (e.target === e.currentTarget) {
      if (!expandedMarkets.includes(marketId)) {
        setExpandedMarkets([...expandedMarkets, marketId]);
      } else {
        setExpandedMarkets(expandedMarkets.filter((itemId) => itemId !== marketId));
      }
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

  const match = getEvent(eventCouponData);

  return (
    <div className={classes["live98"]}>
      <div className={classes["live98__container"]}>
        <div className={classes["matches"]}>
          <div className={classes["matches__body"]}>
            {eventLoading && !eventCouponData ? (
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
            ) : eventCouponData ? (
              <MarketDetail
                expandedMarkets={expandedMarkets}
                mainMarketId={mainMarketId}
                match={match}
                toggleMarketHandler={toggleMarketHandler}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  mainMarketId: PropTypes.number.isRequired,
  matchId: PropTypes.number.isRequired,
};
SlimMobileEventDetail.propTypes = propTypes;

export default SlimMobileEventDetail;

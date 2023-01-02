import { useCouponData } from "applications/common/hooks/useCouponData";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MarketDetail from "../../../Sports/Common/MarketDetail/MarketDetail";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const propTypes = {
  mainMarketId: PropTypes.number.isRequired,
  matchId: PropTypes.number.isRequired,
};

const defaultProps = {};

const MainFeaturedPrematchEventDetail = ({ mainMarketId, matchId }) => {
  const eventId = matchId;

  const dispatch = useDispatch();
  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);
  const eventLoading = useSelector((state) => state.coupon.couponLoading[`e${eventId}`]);

  const [expandedMarkets, setExpandedMarkets] = useState([]);

  useEffect(() => {
    setExpandedMarkets([]); // make sure the expanded markets state is cleaned while navigating...
  }, [dispatch, eventId]);

  const code = eventId ? `e${eventId}` : null;
  useCouponData(dispatch, code, "GAME", true, null, false, false, false, false, null);

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

MainFeaturedPrematchEventDetail.propTypes = propTypes;
MainFeaturedPrematchEventDetail.defaultProps = defaultProps;

export default MainFeaturedPrematchEventDetail;

import cx from "classnames";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { isWindows } from "react-device-detect";
import { useDispatch } from "react-redux";
import { matchPath, useHistory, useParams } from "react-router";
import { useLocation } from "react-router-dom";

import {
  getPatternPrematchSportsEventPath,
  getPatternPrematchSportsEventPathEvent,
} from "../../../utils/route-patterns";
import { useCouponData } from "../../common/hooks/useCouponData";
import LiveSportCarousel from "../components/Carousel/LiveSportCarousel";
import SportCarousel from "../components/Carousel/PremathSportCarousel/components";
import { useEZSwipeable } from "../hooks/swipe-hooks";
import { getSportEndDate } from "../utils/sports-tree-utils";

import CentralAreaWrapper from "./CentralAreaWrapper";

import classes from "applications/ezbet/scss/ezbet.module.scss";

// Swipe draggable effect inspired by https://codepen.io/Coda/pen/NWKVwJR

const EZSportCarouselWrapper = ({ children, live }) => {
  const { eventId: eventIdStr, eventPathId: eventPathIdStr } = useParams();

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const { couponCode, couponType, toDate } = useMemo(() => {
    const eventPathId = eventPathIdStr && !Number.isNaN(eventPathIdStr) ? Number(eventPathIdStr) : null;
    const eventId = eventIdStr && !Number.isNaN(eventIdStr) ? Number(eventIdStr) : null;

    const isPrematchLeaguePage = matchPath(location.pathname, {
      exact: true,
      path: getPatternPrematchSportsEventPath(),
    });
    const isPrematchEventDetailPage = matchPath(location.pathname, {
      exact: true,
      path: getPatternPrematchSportsEventPathEvent(),
    });

    if (isPrematchLeaguePage && eventPathId)
      return { couponCode: `p${eventPathId}`, couponType: "EVENT_PATH", toDate: null };
    if (isPrematchEventDetailPage && eventId)
      return { couponCode: `e${eventId}`, couponType: "EVENT", toDate: getSportEndDate() };

    // in any other scenario
    return { couponCode: null, couponType: null, toDate: null };
  }, [location.pathname, eventPathIdStr, eventIdStr]);

  useCouponData(
    dispatch,
    couponCode,
    "GAME",
    couponType !== "EVENT_PATH",
    null,
    false,
    false,
    couponType === "EVENT_PATH",
    false,
    null,
    true,
    null,
    toDate,
  );

  const { swipeHandlers } = useEZSwipeable();

  return (
    <div className={cx(classes["filter-and-matches-wrapper"], { [classes["windows"]]: isWindows })}>
      {live ? <LiveSportCarousel /> : <SportCarousel />}
      <div {...swipeHandlers} className={classes["main-matches"]}>
        <CentralAreaWrapper>{children}</CentralAreaWrapper>
        <div style={{ height: "32px" }} />
      </div>
    </div>
  );
};

const propTypes = {
  children: PropTypes.any.isRequired,
  live: PropTypes.bool,
};

const defaultProps = { live: false };

EZSportCarouselWrapper.propTypes = propTypes;
EZSportCarouselWrapper.defaultProps = defaultProps;

export default React.memo(EZSportCarouselWrapper);

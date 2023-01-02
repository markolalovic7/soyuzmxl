import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isEmpty from "lodash.isempty";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import dayjs from "../../../../../services/dayjs";
import { getEvent, getPathDescription, groupMarketsAndPeriods } from "../../../../../utils/eventsHelpers";
import { recursivePathSearch } from "../../../../../utils/sdc-search-utils";
import classes from "../../../scss/ezbet.module.scss";
import { TWO_DAY_SPORTS_KEY } from "../../../utils/constants";
import PrematchMarketSection from "../../EventDetailPage/components/PrematchMarketSection/components";

import DesktopPrematchBanner from "./DesktopPrematchBanner";
import DesktopPrematchEventHeader from "./DesktopPrematchEventHeader";

const DesktopEventDetailPage = () => {
  const { eventId: eventIdStr, eventPathId: eventPathIdStr, sportCode } = useParams();

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollEffectMinimise, setScrollEffectMinimise] = useState(false);

  const eventPathId = eventPathIdStr && !Number.isNaN(eventPathIdStr) ? Number(eventPathIdStr) : null;
  const eventId = eventIdStr && !Number.isNaN(eventIdStr) ? Number(eventIdStr) : null;

  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);
  const eventLoading = useSelector((state) => state.coupon.couponLoading[`e${eventId}`]);

  const sportsTreeData = useSelector((state) =>
    state.sportsTree.sportsTreeCache ? state.sportsTree.sportsTreeCache[TWO_DAY_SPORTS_KEY]?.ept ?? [] : [],
  );

  const { marketGroups, match, pathDescription } = useMemo(() => {
    const match = !isEmpty(eventCouponData) ? getEvent(eventCouponData) : undefined;
    const pathDescription = !isEmpty(eventCouponData) ? getPathDescription(eventCouponData) : undefined;
    const marketGroups = !isEmpty(eventCouponData) ? groupMarketsAndPeriods(Object.values(match.children)) : [];

    return { marketGroups, match, pathDescription };
  }, [eventCouponData]);

  const eventsInLeague = useMemo(() => {
    const epoch = match?.epoch;
    if (!epoch) return undefined;

    let dayIndex;
    if (dayjs().isSame(dayjs.unix(epoch / 1000), "day")) dayIndex = 0;
    if (
      dayjs()
        .add(1, "day")
        .isSame(dayjs.unix(epoch / 1000), "day")
    )
      dayIndex = 1;
    if (
      dayjs()
        .add(2, "day")
        .isSame(dayjs.unix(epoch / 1000), "day")
    )
      dayIndex = 2;

    const path = sportsTreeData && eventPathId ? recursivePathSearch(sportsTreeData, eventPathId) : {};

    if (!path) return 0;

    const eventsInLeague = path.criterias[`d${dayIndex}`] ? Number(path.criterias[`d${dayIndex}`]) : 0;

    return eventsInLeague;
  }, [match?.epoch, sportsTreeData, eventPathId]);

  const onScrollHandler = useCallback((e, scrollTop, scrollEffectMinimise) => {
    const onScrollHandler = (e, scrollTop, scrollEffectMinimise) => {
      const newScrollTop = e.target.scrollTop;
      setScrollTop(newScrollTop);
      setScrolling(newScrollTop > scrollTop);

      if (newScrollTop > 65 && !scrollEffectMinimise) {
        setScrollEffectMinimise(true);
      } else if (scrollEffectMinimise && newScrollTop < 110) {
        // remove active and scrolled...
        setScrollEffectMinimise(false);
      }
    };

    onScrollHandler(e, scrollTop, scrollEffectMinimise);
  }, []);

  if (isEmpty(eventCouponData)) {
    return (
      <section className={classes["filter-wrapper"]}>
        <FontAwesomeIcon
          className="fa-spin"
          icon={faSpinner}
          size="3x"
          style={{
            "--fa-primary-color": "white",
            "--fa-secondary-color": "#E6E6E6",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </section>
    );
  }

  return (
    <>
      <DesktopPrematchEventHeader
        countryCodeA={match.ac}
        countryCodeB={match.bc}
        eventCount={eventsInLeague}
        eventPathDesc={pathDescription}
        eventPathId={eventPathId}
        oppA={match.a}
        oppB={match.b}
        sportCode={match.code}
        startTime={dayjs.unix(match.epoch / 1000)}
      />
      <div
        className={classes["event-detail-wrapper"]}
        id="prematch-event-detail-wrapper"
        onScroll={(e) => onScrollHandler(e, scrollTop, scrollEffectMinimise)}
      >
        <DesktopPrematchBanner
          countryCodeA={match.ac}
          countryCodeB={match.bc}
          eventCount={eventsInLeague}
          eventPathDesc={pathDescription}
          eventPathId={eventPathId}
          oppA={match.a}
          oppB={match.b}
          scrollEffectMinimise={scrollEffectMinimise}
          sportCode={match.code}
          startTime={dayjs.unix(match.epoch / 1000)}
        />
        <PrematchMarketSection
          eventId={match.id}
          feedcode={match.brMatchId}
          groupedMarkets={marketGroups}
          sportCode={match.code}
        />
      </div>
    </>
  );
};

export default DesktopEventDetailPage;

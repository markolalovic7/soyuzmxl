import dayjs from "dayjs";
import trim from "lodash.trim";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { sortEvents } from "../../../../../../utils/event-sorting";
import SectionLoader from "../../SectionLoader";

import LeagueContainer from "./LeagueContainer";

import { useCouponData } from "applications/common/hooks/useCouponData";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getEvents } from "utils/prematch-data-utils";

const propTypes = {
  eventType: PropTypes.string.isRequired,
  filterEventId: PropTypes.number,
  live: PropTypes.bool,
  max: PropTypes.number,
  searchCode: PropTypes.string.isRequired,
  virtual: PropTypes.bool,
};

const defaultProps = {
  filterEventId: undefined,
  live: false,
  max: undefined,
  virtual: false,
};

// TODO: Refactor in future.
const EuropeanPrematchContainer = ({ eventType, filterEventId, live, max, searchCode, virtual }) => {
  const dispatch = useDispatch();
  const pathCouponData = useSelector((state) => state.coupon.couponData[searchCode]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[searchCode]);

  const [activeEventId, setActiveEventId] = useState(null); // defaultActiveId is used when we navigate to a path where we preselect an eventId

  const code = searchCode;

  // When we navigate and change the effective search code, do clear out the "active event Id", so if we navigate back it's not automatically expanded.
  useEffect(() => {
    if (searchCode && trim(searchCode).length > 0) {
      setActiveEventId(null);
    }
  }, [dispatch, searchCode]);

  // ['THREE_WAYS_MONEY_LINE', 'TWO_WAYS_MONEY_LINE', 'TWO_WAYS_TOTAL', 'TWO_WAYS_SPREAD']
  useCouponData(
    dispatch,
    code,
    eventType,
    eventType === "RANK",
    eventType === "GAME" ? ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"] : null,
    live,
    virtual,
    true,
    false,
    max
      ? {
          nextMode: true,
          searchLimit: max,
        }
      : null,
  );

  const onToggleActiveEventHandler = (eventId) => {
    if (activeEventId === eventId) {
      setActiveEventId(null);
    } else {
      setActiveEventId(eventId);
    }
  };

  return (
    <div className={classes["bets__container"]}>
      {pathCouponData &&
        Object.values(pathCouponData).map((sport) => {
          // it should be just one in this page...

          if (sport.children) {
            // const categories = Object.values(sport.children).slice().sort(sortEventPaths);
            const categories = Object.values(sport.children);

            return categories.map((category) => {
              const categoryDescription = category.desc;
              if (category.children) {
                // const tournaments = Object.values(category.children).slice().sort(sortEventPaths);
                const tournaments = Object.values(category.children);

                return tournaments.map((tournament) => {
                  const pathDescription = `${categoryDescription} : ${tournament.desc}`;
                  const rawEvents = getEvents(Object.values(tournament.children))
                    .filter((match) => live || dayjs.unix(match.epoch).isAfter(dayjs()))
                    .slice()
                    .sort(sortEvents);
                  const events = filterEventId ? rawEvents.filter((m) => m.id === filterEventId) : rawEvents;

                  return (
                    <LeagueContainer
                      activeEventId={activeEventId}
                      eventType={eventType}
                      events={events}
                      key={tournament.id}
                      live={live}
                      pathDescription={pathDescription}
                      virtual={virtual}
                      onToggleActiveEvent={onToggleActiveEventHandler}
                    />
                  );
                });
              }

              return null;
            });
          }

          return null;
        })}

      {!pathCouponData && pathLoading && <SectionLoader />}
    </div>
  );
};

EuropeanPrematchContainer.propTypes = propTypes;
EuropeanPrematchContainer.defaultProps = defaultProps;

export default React.memo(EuropeanPrematchContainer);

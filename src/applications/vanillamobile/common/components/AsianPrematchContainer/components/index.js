import dayjs from "dayjs";
import trim from "lodash.trim";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useAsianCouponData } from "../../../../../common/hooks/useAsianCouponData";
import SectionLoader from "../../SectionLoader";
import { sortEvents } from "../utils";

import LeagueContainer from "./LeagueContainer";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getEvents } from "utils/prematch-data-utils";

const propTypes = {
  eventType: PropTypes.string.isRequired,
  filterEventId: PropTypes.number,
  max: PropTypes.number,
  searchCode: PropTypes.string.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {
  filterEventId: undefined,
  max: undefined,
};

// TODO: Refactor in future.
const AsianPrematchContainer = ({ eventType, filterEventId, max, searchCode, sportCode }) => {
  const dispatch = useDispatch();

  const code = searchCode;

  const pathCouponData = useSelector((state) => state.coupon.asianCouponData[`${code}/${sportCode}-DEFAULT`]);
  const pathLoading = useSelector((state) => state.coupon.asianCouponLoading[`${code}/${sportCode}-DEFAULT`]);

  const [activeEventId, setActiveEventId] = useState(null); // defaultActiveId is used when we navigate to a path where we preselect an eventId

  // When we navigate and change the effective search code, do clear out the "active event Id", so if we navigate back it's not automatically expanded.
  useEffect(() => {
    if (searchCode && trim(searchCode).length > 0) {
      setActiveEventId(null);
    }
  }, [dispatch, searchCode]);

  useAsianCouponData(dispatch, code, "XXXX", undefined, undefined, `${sportCode}-DEFAULT`, max ?? undefined, true);

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
                    .filter((match) => dayjs.unix(match.epoch).isAfter(dayjs()))
                    .slice()
                    .sort(sortEvents);
                  const events = filterEventId ? rawEvents.filter((m) => m.id === filterEventId) : rawEvents;

                  return (
                    <LeagueContainer
                      activeEventId={activeEventId}
                      eventType={eventType}
                      events={events}
                      key={tournament.id}
                      pathDescription={pathDescription}
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

AsianPrematchContainer.propTypes = propTypes;
AsianPrematchContainer.defaultProps = defaultProps;

export default React.memo(AsianPrematchContainer);

import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getEvents } from "../../../../../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../../../../../common/hooks/useCouponData";
import classes from "../../../../../../scss/vanilladesktop.module.scss";
import CentralColumnSportCard from "../../../CentralColumnSportCard";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const getMarketTypeGroups = (selectedMarketTypeGroup) => {
  if (selectedMarketTypeGroup) {
    switch (selectedMarketTypeGroup) {
      case "MONEY_LINE":
        return ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE"];
      case "HANDICAP":
        return ["TWO_WAYS_SPREAD"];
      case "OVER_UNDER":
        return ["TWO_WAYS_TOTAL"];
      default:
        return null;
    }
  }

  return null;
};

const CentralColumnCoupon = ({
  code,
  eventPathId,
  eventType,
  excludedTournaments,
  fromDate,
  selectedMarketTypeGroup,
  toDate,
}) => {
  const pathCouponData = useSelector((state) => state.coupon.couponData[code]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[code]);

  const dispatch = useDispatch();

  // ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"]
  useCouponData(
    dispatch,
    code,
    eventType,
    eventType === "RANK",
    eventType === "GAME" ? getMarketTypeGroups(selectedMarketTypeGroup) : null,
    false,
    false,
    true,
    false,
    null,
    false,
    fromDate,
    toDate,
  );

  if (pathCouponData) {
    return Object.values(pathCouponData).map((sport) => {
      if (sport.children) {
        const categories = Object.values(sport.children).slice().sort(sortEventPaths);

        return categories.map((category) => {
          const categoryDescription = category.desc;
          if (category.children) {
            const tournaments = Object.values(category.children).slice().sort(sortEventPaths);

            return tournaments.map((tournament) => {
              if (excludedTournaments.includes(tournament.id)) {
                return null;
              }

              const pathDescription = `${categoryDescription} : ${tournament.desc}`;
              const events = getEvents(Object.values(tournament.children))
                .filter((match) => Object.values(match.children).filter((market) => market.open).length > 0)
                .slice()
                .sort(sortEvents);

              if (events.length === 0) return null;

              return (
                <CentralColumnSportCard
                  eventPathId={tournament.id}
                  heading={pathDescription}
                  isOutright={eventType === "RANK"}
                  key={tournament.id}
                  rows={events}
                />
              );
            });
          }

          return null;
        });
      }

      return null;
    });
  }

  return (
    <div className={classes["spinner-container"]}>
      <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
    </div>
  );
};

const propTypes = {
  code: PropTypes.string.isRequired,
  eventPathId: PropTypes.number.isRequired,
  eventType: PropTypes.string.isRequired,
  excludedTournaments: PropTypes.array.isRequired,
  fromDate: PropTypes.string,
  selectedMarketTypeGroup: PropTypes.string,
  toDate: PropTypes.string,
};

const defaultProps = {
  fromDate: undefined,
  selectedMarketTypeGroup: undefined,
  toDate: undefined,
};

CentralColumnCoupon.propTypes = propTypes;
CentralColumnCoupon.defaultProps = defaultProps;

export default React.memo(CentralColumnCoupon);

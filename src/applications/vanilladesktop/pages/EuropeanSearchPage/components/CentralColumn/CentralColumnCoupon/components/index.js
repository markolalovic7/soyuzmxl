import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAuthLanguage, getAuthPriceFormat } from "../../../../../../../../redux/reselect/auth-selector";
import { searchForCouponData } from "../../../../../../../../redux/slices/couponSlice";
import { getEvents } from "../../../../../../../../utils/prematch-data-utils";
import classes from "../../../../../../scss/vanilladesktop.module.scss";
import CentralColumnSportCard from "../../../../../EuropeanSportsPage/components/CentralColumnSportCard";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const CentralColumnCoupon = ({ searchPhrase }) => {
  const dispatch = useDispatch();

  const priceFormat = useSelector(getAuthPriceFormat);
  const language = useSelector(getAuthLanguage);
  const searchCouponData = useSelector((state) => state.coupon.searchCouponData);
  const searchLoading = useSelector((state) => state.coupon.searchLoading);

  useEffect(() => {
    const eventPathSubscriptionData = {
      allMarkets: false,
      keyword: searchPhrase,
      live: false,
      virtual: false,
      // african: false,
      // asianCriteria: null,
      // marketTypeGroups: null,
      // count: null,
      // from: null,
    };

    dispatch(searchForCouponData({ ...eventPathSubscriptionData }));
  }, [dispatch, searchPhrase, priceFormat, language]);

  if (searchCouponData) {
    return Object.values(searchCouponData).map((sport) => {
      if (sport.children) {
        const categories = Object.values(sport.children).slice().sort(sortEventPaths);

        return categories.map((category) => {
          const categoryDescription = category.desc;
          if (category.children) {
            const tournaments = Object.values(category.children).slice().sort(sortEventPaths);

            return tournaments.map((tournament) => {
              const pathDescription = `${categoryDescription} : ${tournament.desc}`;
              const events = getEvents(Object.values(tournament.children)).slice().sort(sortEvents);

              return (
                <CentralColumnSportCard
                  eventPathId={tournament.id}
                  heading={pathDescription}
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
  searchPhrase: PropTypes.string.isRequired,
};

CentralColumnCoupon.propTypes = propTypes;

export default React.memo(CentralColumnCoupon);

import cx from "classnames";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import NoResultSearchWallpaper from "../NoResultSearchWallpaper";

import LeagueContainer from "applications/vanillamobile/common/components/EuropeanPrematchContainer/components/LeagueContainer";
import SectionLoader from "applications/vanillamobile/common/components/SectionLoader";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { searchForCouponData } from "redux/slices/couponSlice";
import { getEvents } from "utils/prematch-data-utils";

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const propTypes = {
  searchPhrase: PropTypes.string.isRequired,
};

const defaultProps = {};

const SearchResultContainer = ({ searchPhrase }) => {
  const dispatch = useDispatch();
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
  }, [dispatch, searchPhrase]);

  const [activeEventId, setActiveEventId] = useState(null);
  const onToggleActiveEventHandler = (eventId) => {
    if (activeEventId === eventId) {
      setActiveEventId(null);
    } else {
      setActiveEventId(eventId);
    }
  };

  const [expandedSports, setExpandedSports] = useState([]);

  const toggleSportHandler = (sportCode) => {
    if (!expandedSports.includes(sportCode)) {
      setExpandedSports([...expandedSports, sportCode]);
    } else {
      setExpandedSports(expandedSports.filter((code) => code !== sportCode));
    }
  };

  useEffect(() => {
    if (searchCouponData && Object.values(searchCouponData).length > 0) {
      // init the expanded sports for the first one to be open by default...
      setExpandedSports([Object.values(searchCouponData)[0].code]);
    }
  }, [searchCouponData]);

  return (
    <>
      {searchCouponData && Object.values(searchCouponData).length === 0 ? (
        <NoResultSearchWallpaper />
      ) : (
        <>
          {searchCouponData &&
            Object.values(searchCouponData).map((sport) => {
              // it should be just one in this page...

              if (sport.children) {
                const categories = Object.values(sport.children).slice().sort(sortEventPaths);

                return (
                  <div className={classes["sports-spoiler "]}>
                    <div
                      className={`${classes["sport-spoiler"]} ${classes["sport-spoiler_live"]} ${
                        classes[`sport-spoiler_${sport.code.toLowerCase()}`]
                      } ${classes["spoiler-list"]} ${expandedSports.includes(sport.code) ? classes["active"] : ""}`}
                    >
                      <span className={classes["sport-spoiler__color"]} />
                      <span className={classes["sport-spoiler__icon"]}>
                        <i className={cx(classes["qicon-default"], classes[`qicon-${sport.code.toLowerCase()}`])} />
                      </span>
                      <div className={classes["sport-spoiler__text"]}>{sport.desc}</div>
                      <span
                        className={`${classes["sport-spoiler__arrow"]} ${classes["spoiler-arrow"]} ${
                          expandedSports.includes(sport.code) ? classes["active"] : ""
                        }`}
                        onClick={() => toggleSportHandler(sport.code)}
                      />
                    </div>

                    {expandedSports.includes(sport.code) ? (
                      <div className={classes["bets"]}>
                        <div className={classes["bets__container"]}>
                          {categories.map((category) => {
                            const categoryDescription = category.desc;
                            if (category.children) {
                              const tournaments = Object.values(category.children).slice().sort(sortEventPaths);

                              return tournaments.map((tournament) => {
                                const pathDescription = `${categoryDescription} : ${tournament.desc}`;
                                const events = getEvents(Object.values(tournament.children)).slice().sort(sortEvents);

                                return (
                                  <LeagueContainer
                                    activeEventId={activeEventId}
                                    events={events}
                                    key={tournament.id}
                                    pathDescription={pathDescription}
                                    virtual={false}
                                    onToggleActiveEvent={onToggleActiveEventHandler}
                                  />
                                );
                              });
                            }

                            return null;
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              }

              return null;
            })}

          {!searchCouponData && searchLoading && <SectionLoader />}
        </>
      )}
    </>
  );
};

SearchResultContainer.propTypes = propTypes;
SearchResultContainer.defaultProps = defaultProps;

export default SearchResultContainer;

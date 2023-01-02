import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";

import { useGetMatchStatuses } from "../../../../../hooks/matchstatus-hooks";
import { clearSearchResults, searchForCouponData } from "../../../../../redux/slices/couponSlice";
import { getEvents } from "../../../../../utils/prematch-data-utils";
import OutcomePrice from "../../../components/OutcomePrice/OutcomePrice";
import SportIcon from "../../../components/SportIcon/SportIcon";
import { useActiveBreakPointEllipsisLengths } from "../../../hooks/breakpoint-hooks";
import { LIVE_LEAGUE_PERIOD_DESC } from "../../../utils/breakpoint-constants";
import { getSportEndDate } from "../../../utils/sports-tree-utils";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const FREQUENT_COUPON_REFRESH_INTERVAL = 2000;

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const SearchPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const matchStatuses = useGetMatchStatuses(dispatch);

  const periodDescMaxLength = useActiveBreakPointEllipsisLengths(LIVE_LEAGUE_PERIOD_DESC);

  const searchCouponData = useSelector((state) => state.coupon.searchCouponData);
  const searchLoading = useSelector((state) => state.coupon.searchLoading);

  const { searchPhrase } = useParams();

  useEffect(() => {
    if (isEmpty(searchPhrase)) return undefined;

    const eventPathSubscriptionData = {
      allMarkets: false,
      // eventType: "GAME",
      keyword: encodeURIComponent(searchPhrase),
      shortNames: true,
      // african: false,
      // asianCriteria: null,
      // marketTypeGroups: null,
      // count: null,
      // from: null,
      toDate: getSportEndDate(),
      // live: true,
      virtual: false,
    };

    dispatch(searchForCouponData({ ...eventPathSubscriptionData }));

    // Refresh periodically (only deltas will be collected by the API)
    const interval = setInterval(() => {
      dispatch(searchForCouponData({ ...eventPathSubscriptionData }));
    }, FREQUENT_COUPON_REFRESH_INTERVAL);

    return () => {
      // unsubscribe
      clearInterval(interval);
      dispatch(clearSearchResults());
    };
  }, [dispatch, searchPhrase]);

  if ((!searchCouponData && searchLoading) || isEmpty(matchStatuses)) {
    return (
      <div className={classes["search-page"]}>
        <FontAwesomeIcon
          className="fa-spin"
          icon={faSpinner}
          size="3x"
          style={{
            "--fa-primary-color": "#00ACEE",
            "--fa-secondary-color": "#E6E6E6",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
    );
  }

  if (isEmpty(searchPhrase) || (searchCouponData && isEmpty(searchCouponData))) {
    return (
      <div className={classes["search-page"]}>
        {isEmpty(searchPhrase) ? "이벤트 검색 시작" : "결과를 찾을수 없습니다."}
      </div>
    );
  }

  if (!searchCouponData) return null;

  return Object.values(searchCouponData).map((sport) => {
    if (sport.children) {
      const categories = Object.values(sport.children).slice().sort(sortEventPaths);

      return categories.map((category) => {
        // const categoryDescription = category.desc;
        if (category.children) {
          const tournaments = Object.values(category.children).slice().sort(sortEventPaths);

          return tournaments.map((tournament) => {
            // const pathDescription = `${categoryDescription} : ${tournament.desc}`;
            // const pathDescription =
            //   tournament.desc.length > 12 ? `${tournament.desc.slice(0, 12)}···` : tournament.desc;
            const events = getEvents(Object.values(tournament.children)).slice().sort(sortEvents);

            return (
              <React.Fragment key={tournament.id}>
                <section className={classes["filter-wrapper"]}>
                  <div className={classes["left"]}>
                    <div className={cx(classes["sport-iconx-active"])}>
                      <SportIcon code={sport.code} />
                    </div>
                    <div className={cx(classes["flex-al-center"], classes["w-100"], classes["ov-hidden"])}>
                      <p>{tournament.desc}</p>
                      <span className={classes["league-name-count"]}>{`( ${events.length} )`}</span>
                    </div>
                  </div>
                </section>
                {events.length > 0 && (
                  <section className={classes["matches"]}>
                    {events?.map((match) => {
                      const isLive = !!match.score;
                      const clockPeriodDesc =
                        isLive && matchStatuses.find((period) => period.abbreviation === match.time.p)?.description;

                      return (
                        match.children &&
                        Object.values(match.children).map((market, index) => (
                          <div className={classes["match-wrapper"]} key={index}>
                            <div className={classes["match"]}>
                              <p>{match.a}</p>
                              <p>{match.b}</p>
                              {isLive ? (
                                <div className={cx(classes["date-time-market-type"], classes["relative"])}>
                                  <div className={classes["left-live-info"]}>
                                    <span
                                      className={classes["date"]}
                                      style={{ marginRight: "5px" }}
                                      title={match.period}
                                    >
                                      {clockPeriodDesc}
                                    </span>
                                    {match.time.newStatus === 3 && <i className={classes["icon-history-regular"]} />}
                                  </div>
                                  <div className={classes["right-side-live"]}>
                                    {match.av && <i className={classes["icon-tv-retro-light"]} />}
                                    <span
                                      className={classes["market-type"]}
                                      style={{ marginLeft: "6px", marginRight: "2px" }}
                                      onClick={() =>
                                        history.push(
                                          `/live/sport/${sport.code}/eventpath/${tournament.id}/event/${match.id}`,
                                        )
                                      }
                                    >
                                      {`+${match.count > 0 ? Math.max(match.count - 1, 0) : ""}`}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className={cx(classes["date-time-market-type"], classes["relative"])}>
                                  <span className={classes["date"]}>
                                    {dayjs.unix(match.epoch / 1000).format("MM-DD")}
                                  </span>
                                  <span className={classes["time"]} style={{ marginRight: "0px" }}>
                                    {dayjs.unix(match.epoch / 1000).format("HH:mm")}
                                  </span>
                                  <div className={classes["right-side-regular"]}>
                                    <span
                                      className={classes["market-type"]}
                                      onClick={() =>
                                        history.push(
                                          `/prematch/sport/${sport.code}/eventpath/${tournament.id}/event/${match.id}`,
                                        )
                                      }
                                    >
                                      {`+${Math.max(match.count - 1, 0)}`}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className={classes["forecasts"]} id="forecasts">
                              {isLive && (
                                <div className={classes["match-scores"]}>
                                  <p>{match.score.a}</p>
                                  <p>{match.score.b}</p>
                                </div>
                              )}
                              {market.children &&
                                Object.values(market.children).map((outcome, index) => (
                                  <OutcomePrice
                                    desc={outcome.desc}
                                    dir={outcome.dir}
                                    eventId={match.id}
                                    hidden={outcome.hidden}
                                    isDraw={false}
                                    key={outcome.id}
                                    outcomeId={outcome.id}
                                    price={outcome.price}
                                  />
                                ))}
                            </div>
                          </div>
                        ))
                      );
                    })}
                  </section>
                )}
              </React.Fragment>
            );
          });
        }

        return null;
      });
    }

    return null;
  });
};

// SearchPage.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   sportCode: PropTypes.string.isRequired,
// };
export default React.memo(SearchPage);

import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../utils/betslip-utils";
import { getEvents } from "../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../common/hooks/useCouponData";
import classes from "../../scss/betpoint.module.scss";
import { sortEvents } from "../../../../utils/event-sorting";

const propTypes = {
  eventId: PropTypes.number,
  eventPathId: PropTypes.number,
  live: PropTypes.bool,
  max: PropTypes.number,
  sportCode: PropTypes.string,
  virtual: PropTypes.bool,
};

const defaultProps = {
  eventId: undefined,
  eventPathId: undefined,
  live: false,
  max: undefined,
  sportCode: undefined,
  virtual: false,
};

const CentralSportsContent = ({ eventId, eventPathId, live, max, sportCode, virtual }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const code = eventId ? `${live ? "l" : "e"}${eventId}` : eventPathId ? `p${eventPathId}` : undefined;
  const pathCouponData = useSelector((state) => state.coupon.couponData[code]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[code]);

  useCouponData(
    dispatch,
    code,
    !eventId ? "ALL" : "GAME",
    !!eventId,
    null,
    live,
    virtual ? (max ? "1" : "true") : false, // handle the diff expectations between SDC and next here
    false,
    false,
    max
      ? {
          nextMode: true,
          searchLimit: max,
        }
      : null,
  );

  const isEvent = !!eventId;

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const toggleBetslipHandler = (outcomeId, eventId) => {
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, false);
    onRefreshBetslipHandler(dispatch, location.pathname);
  };

  return (
    <div className={classes["content"]}>
      {code && !pathCouponData && (
        <FontAwesomeIcon className="fa-spin" icon={faSpinner} size="3x" style={{ color: "white" }} />
      )}

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
                  const events = getEvents(Object.values(tournament.children))
                    .filter((match) => dayjs.unix(match.epoch).isAfter(dayjs()))
                    .slice()
                    .sort(sortEvents);

                  return (
                    <React.Fragment key={pathDescription}>
                      <div className={classes["content__titles"]}>
                        <div className={classes["content__title"]}>
                          <span>{pathDescription}</span>
                        </div>
                      </div>

                      {events.map((match) => (
                        <React.Fragment key={match.id}>
                          <div className={classes["content__subtitle"]}>
                            <span>{`${match.desc} - ${dayjs.unix(match.epoch / 1000).format("D MMMM hh:mm A")}`}</span>
                            {!isEvent && (
                              <div
                                className={classes["card__subtitle-icon"]}
                                style={{
                                  cursor: match.count - Object.values(match.children).length > 0 ? "pointer" : "auto",
                                  pointerEvents:
                                    match.count - Object.values(match.children).length > 0 ? "auto" : "none",
                                }}
                                onClick={() =>
                                  virtual
                                    ? history.push(`/virtual/eventpath/${eventPathId}/event/${match.id}`)
                                    : history.push(
                                        `/prematch/sport/${sportCode}/eventpath/${eventPathId}/event/${match.id}`,
                                      )
                                }
                              >
                                {`+${match.count - Object.values(match.children).length}`}
                              </div>
                            )}
                          </div>

                          {Object.values(match.children).map((market) => (
                            <>
                              <div className={cx(classes["content__subtitle"], classes["content__subtitle_special"])}>
                                <span>{`${market.desc} - ${market.period}`}</span>
                                <div className={classes["card__subtitle-icon"]}>
                                  <i className={classes["qicon-stats"]} />
                                </div>
                              </div>
                              <div className={classes["card"]}>
                                <div className={cx(classes["card__coeficients"], classes["open"])}>
                                  {market.children &&
                                    Object.values(market.children).map((outcome) => (
                                      <div
                                        className={classes["card__coeficient"]}
                                        key={outcome.id}
                                        onClick={() => toggleBetslipHandler(outcome.id, match.id)}
                                      >
                                        <div className={classes["card__team"]}>{outcome.desc}</div>
                                        <div
                                          className={cx(classes["card__chance"], {
                                            [classes["card__chance_special"]]: betslipOutcomeIds.includes(outcome.id),
                                          })}
                                        >
                                          {outcome.price}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  );
                });
              }

              return null;
            });
          }

          return null;
        })}
    </div>
  );
};

CentralSportsContent.propTypes = propTypes;
CentralSportsContent.defaultProps = defaultProps;

export default React.memo(CentralSportsContent);

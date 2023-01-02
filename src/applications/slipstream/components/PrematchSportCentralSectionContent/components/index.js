import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../redux/reselect/betslip-selector";
import { getRetailSelectedPlayerAccountId } from "../../../../../redux/reselect/retail-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../utils/betslip-utils";
import { getEvents } from "../../../../../utils/prematch-data-utils";
import classes from "../../../scss/slipstream.module.scss";
import { sortEvents } from "../../../../../utils/event-sorting";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {
  isEvent: PropTypes.bool.isRequired,
  live: PropTypes.bool,
  pathCouponData: PropTypes.object,
  pathLoading: PropTypes.bool,
  virtual: PropTypes.string,
};

const defaultProps = {
  live: undefined,
  pathCouponData: undefined,
  pathLoading: undefined,
  virtual: undefined,
};

const getParams = (virtual, live) => {
  if (live || virtual) {
    return `?${live ? "live=1" : ""}${virtual ? `&virtual=1` : ""}`.replace("?&", "?");
  }

  return "";
};

const PrematchSportCentralSectionContent = ({ isEvent, live, pathCouponData, pathLoading, virtual }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const selectedPlayerId = useSelector(getRetailSelectedPlayerAccountId);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (selectedPlayerId) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, false);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  const params = getParams(virtual, live);

  return (
    <div className={classes["content"]}>
      {!pathCouponData && pathLoading && (
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
                    <div className={classes["content__container"]} key={pathDescription}>
                      <div className={classes["content__title"]}>{pathDescription}</div>
                      <div className={classes["content__cards"]}>
                        {events.map((match) => (
                          // console.log(
                          //   `${match.id} - ${match.desc} - count: ${match.count} - marketcount: ${
                          //     Object.values(match.children).length
                          //   } - Total: ${match.count - Object.values(match.children).length}`,
                          // );

                          <div className={cx(classes["content__card"], classes["card"])} key={match.id}>
                            <div className={classes["card__header"]}>
                              <div className={classes["card__titles"]}>
                                <div className={classes["card__match"]}>
                                  <span>{match.desc}</span>
                                </div>
                                <div className={classes["card__date"]}>
                                  {dayjs.unix(match.epoch / 1000).format("D MMMM hh:mm A")}
                                </div>
                              </div>
                              {!isEvent && (
                                <div
                                  className={classes["card__count"]}
                                  onClick={() =>
                                    history.push(`/prematch/eventpath/${tournament.id}/event/${match.id}${params}`)
                                  }
                                >
                                  <div className={classes["card__counting"]}>
                                    {`+${match.count - Object.values(match.children).length}`}
                                  </div>
                                  <span className={classes["card__arrow"]}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                  </span>
                                </div>
                              )}
                            </div>

                            {!isEvent &&
                              Object.values(match.children).map((market) => (
                                <div className={classes["card__body"]} key={market.id}>
                                  <div className={classes["card__label"]}>{`${market.desc} - ${market.period}`}</div>
                                  <div className={classes["card__coeficients"]}>
                                    {market.children &&
                                      Object.values(market.children) &&
                                      Object.values(market.children).length > 0 && (
                                        <div
                                          className={cx(classes["card__coeficient"])}
                                          onClick={() =>
                                            toggleBetslipHandler(Object.values(market.children)[0].id, match.id)
                                          }
                                        >
                                          <div className={classes["card__outcome"]}>H</div>
                                          <div
                                            className={cx(classes["card__chance"], {
                                              [classes["selected"]]: betslipOutcomeIds.includes(
                                                Object.values(market.children)[0].id,
                                              ),
                                            })}
                                          >
                                            {Object.values(market.children)[0].price}
                                          </div>
                                        </div>
                                      )}
                                    {market.children &&
                                      Object.values(market.children) &&
                                      Object.values(market.children).length === 3 && (
                                        <div
                                          className={cx(classes["card__coeficient"])}
                                          onClick={() =>
                                            toggleBetslipHandler(Object.values(market.children)[1].id, match.id)
                                          }
                                        >
                                          <div className={classes["card__outcome"]}>X</div>
                                          <div
                                            className={cx(classes["card__chance"], {
                                              [classes["selected"]]: betslipOutcomeIds.includes(
                                                Object.values(market.children)[1].id,
                                              ),
                                            })}
                                          >
                                            {Object.values(market.children)[1].price}
                                          </div>
                                        </div>
                                      )}
                                    {market.children &&
                                      Object.values(market.children) &&
                                      Object.values(market.children).length > 1 && (
                                        <div
                                          className={cx(classes["card__coeficient"])}
                                          onClick={() =>
                                            toggleBetslipHandler(
                                              Object.values(market.children)[Object.values(market.children).length - 1]
                                                .id,
                                              match.id,
                                            )
                                          }
                                        >
                                          <div className={classes["card__outcome"]}>A</div>
                                          <div
                                            className={cx(classes["card__chance"], {
                                              [classes["selected"]]: betslipOutcomeIds.includes(
                                                Object.values(market.children)[
                                                  Object.values(market.children).length - 1
                                                ].id,
                                              ),
                                            })}
                                          >
                                            {
                                              Object.values(market.children)[Object.values(market.children).length - 1]
                                                .price
                                            }
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              ))}

                            {isEvent &&
                              Object.values(match.children).map((market) => (
                                <div className={classes["live-stakes"]} key={market.id} style={{ marginBottom: "5px" }}>
                                  <div className={classes["live-stake"]}>
                                    <div className={classes["live-stake__title"]}>
                                      {`${market.desc} - ${market.period}`}
                                    </div>
                                    <div className={classes["live-stake__coeficients"]}>
                                      {Object.values(market.children).map((outcome) => (
                                        <div
                                          className={cx(classes["live-stake__coeficient"], {
                                            [classes["active"]]: betslipOutcomeIds.includes(outcome.id),
                                          })}
                                          key={outcome.id}
                                          onClick={() => toggleBetslipHandler(outcome.id, match.id)}
                                        >
                                          <div className={classes["live-stake__team"]}>{outcome.desc}</div>
                                          <div className={classes["live-stake__chance"]}>{outcome.price}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
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

PrematchSportCentralSectionContent.propTypes = propTypes;
PrematchSportCentralSectionContent.defaultProps = defaultProps;

export default React.memo(PrematchSportCentralSectionContent);

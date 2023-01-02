import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionLoader from "applications/slimmobile/common/components/SectionLoader";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { CSSTransition } from "react-transition-group";
import { openLinkInNewWindow } from "utils/misc";
import { getEvents } from "utils/prematch-data-utils";

import { getAuthLanguage } from "../../../../../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../../../../../redux/reselect/betslip-selector";
import { getMobileBetslipMaxSelections } from "../../../../../../../../redux/reselect/cms-layout-widgets";
import { getCmsConfigSportsBook } from "../../../../../../../../redux/reselect/cms-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../utils/betslip-utils";
import CentralCarousel from "../../../../../../common/components/CentralCarousel";
import CentralIFrame from "../../../../../../common/components/CentralIFrame";

import SlimMobileEventDetail from "./SlimMobileEventDetail/SlimMobileEventDetail";

const propTypes = {
  activeMatchId: PropTypes.number.isRequired,
  couponData: PropTypes.object.isRequired,
  filterEventId: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  setActiveMatchId: PropTypes.func.isRequired,
};

const SlimMobileCoupon = ({ activeMatchId, couponData, filterEventId, loading, setActiveMatchId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getMobileBetslipMaxSelections);
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;
  const language = useSelector(getAuthLanguage);

  const toggleEventHandler = (matchId) => () => {
    if (activeMatchId === matchId) {
      setActiveMatchId(null); // collapse, effectively
    } else {
      setActiveMatchId(matchId);
    }
  };

  const addToBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  const getOutcomeDescriptionByIndex = (index) => {
    // TODO to be translated
    switch (index) {
      case 0:
        return "H";
      case 1:
        return "X";
      case 2:
        return "A";
      default:
        throw new Error();
    }
  };

  const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

  const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

  const coupon =
    couponData != null
      ? Object.values(couponData).map((sport) => {
          const sportCode = sport.code.toLowerCase();

          if (sport.children) {
            const categories = Object.values(sport.children).slice().sort(sortEventPaths);

            return categories.map((category) => {
              let pathDescription = category.desc;
              if (category.children) {
                const tournaments = Object.values(category.children).slice().sort(sortEventPaths);

                return tournaments.map((tournament) => {
                  pathDescription = `${pathDescription} : ${tournament.desc}`;

                  const events = getEvents(Object.values(tournament.children)).slice().sort(sortEvents);

                  return (
                    <React.Fragment key={tournament.id}>
                      <div className={classes["main__title"]} key={tournament.id}>
                        <h1>{pathDescription}</h1>
                      </div>

                      {events.map((match) => {
                        if (filterEventId && match.id !== filterEventId) return null; // used in case of redirects from pages that open a single event...

                        const mainMarketId = match && match.children ? Object.values(match.children)[0].id : null;

                        return (
                          <div className={classes["result"]} key={match.id}>
                            <div className={classes["result__body"]}>
                              <div className={classes["result__item"]}>
                                <div className={classes["result__item-header"]} key={1}>
                                  <div className={classes["result__date"]}>
                                    <span>
                                      <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode}`])} />
                                    </span>
                                    {dayjs.unix(match.epoch / 1000).format("MMMM D, hh:mm A")}
                                  </div>
                                  <div className={classes["result__icons"]}>
                                    {match.brMatchId && betradarStatsOn && betradarStatsURL ? (
                                      <div
                                        className={classes["result__icon"]}
                                        key={1}
                                        onClick={() =>
                                          openLinkInNewWindow(
                                            `${betradarStatsURL}/${language}/match/${match.brMatchId}`,
                                          )
                                        }
                                      >
                                        <i className={classes["qicon-stats"]} />
                                      </div>
                                    ) : null}
                                    <div className={classes["result__icon"]} key={2}>
                                      <span>
                                        <FontAwesomeIcon icon={faStar} />
                                      </span>
                                    </div>
                                    {match.count > 1 ? (
                                      <div
                                        className={`${classes["result__icon"]} ${classes["live98-link"]} ${
                                          activeMatchId === match.id ? classes["active"] : ""
                                        }`}
                                        key={3}
                                        onClick={toggleEventHandler(match.id)}
                                      >
                                        {`+${match.count - 1}`}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                                <div className={classes["result__sublabel"]} key={2}>
                                  {match.desc}
                                </div>

                                {match.children
                                  ? Object.values(match.children).map((market) => {
                                      if (market.children) {
                                        // notice we go for hiding outrights all together...
                                        return (
                                          <div className={classes["result__cards"]} key={market.id}>
                                            {Object.values(market.children).map((outcome, index) => {
                                              const disabled = outcome.hidden || !market.open;

                                              return (
                                                <div
                                                  className={`${classes["result__card"]} ${
                                                    betslipOutcomeIds.includes(parseInt(outcome.id, 10))
                                                      ? classes["active"]
                                                      : ""
                                                  } ${disabled ? classes["disabled"] : ""} ${
                                                    classes["price-indicator"]
                                                  }`}
                                                  id={`outcomeId-${outcome.id}`}
                                                  key={outcome.id}
                                                  onClick={() => addToBetslipHandler(outcome.id, match.id)}
                                                >
                                                  {outcome.dir ? (
                                                    outcome.dir === "d" ? (
                                                      <span
                                                        className={`${classes["price-indicator__triangle"]} ${classes["price-indicator__triangle_red"]}`}
                                                      />
                                                    ) : outcome.dir === "u" ? (
                                                      <span
                                                        className={`${classes["price-indicator__triangle"]} ${classes["price-indicator__triangle_green"]}`}
                                                      />
                                                    ) : null
                                                  ) : null}
                                                  <span key={1}>
                                                    {market.marketTypeGroup !== "RANK_OUTRIGHT"
                                                      ? getOutcomeDescriptionByIndex(index)
                                                      : outcome.desc}
                                                  </span>
                                                  <span key={2}>{outcome.price}</span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        );
                                      }

                                      return null;
                                    })
                                  : null}
                              </div>
                              {match.id === activeMatchId ? (
                                <CSSTransition
                                  appear
                                  in
                                  classNames={{
                                    appear: classes["react-css-animation-appear"],
                                    appearActive: classes["react-css-animation-appear-active"],
                                    enter: classes["react-css-animation-enter"],
                                    enterActive: classes["react-css-animation-enter-active"],
                                    exit: classes["react-css-animation-exit"],
                                    exitActive: classes["react-css-animation-exit-active"],
                                  }}
                                  timeout={1000}
                                >
                                  <SlimMobileEventDetail mainMarketId={mainMarketId} matchId={match.id} />
                                </CSSTransition>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                });
              }

              return null;
            });
          }

          return null;
        })
      : null;

  return (
    <main className={classes["main"]}>
      <CentralCarousel />
      <CentralIFrame />
      {coupon}
      {loading && !couponData && <SectionLoader />}
    </main>
  );
};

SlimMobileCoupon.propTypes = propTypes;

export default SlimMobileCoupon;

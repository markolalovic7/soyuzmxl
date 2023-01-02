import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCouponData } from "applications/common/hooks/useCouponData";
import SectionLoader from "applications/slimmobile/common/components/SectionLoader";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { CSSTransition } from "react-transition-group";
import { openLinkInNewWindow } from "utils/misc";
import { getEvents } from "utils/prematch-data-utils";

import { getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../../../redux/reselect/betslip-selector";
import { getMobileBetslipMaxSelections } from "../../../../../../redux/reselect/cms-layout-widgets";
import { getCmsConfigSportsBook } from "../../../../../../redux/reselect/cms-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../utils/betslip-utils";
import MainFeaturedPrematchEventDetail from "../MainFeaturedPrematchEventDetail";

const propTypes = {
  eventPathListFilter: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
  eventPathListFilter: [],
};

const MainPrematchFeaturedCoupon = ({ eventPathListFilter }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const codes = eventPathListFilter ? eventPathListFilter.map((id) => `p${id}`).join(",") : null;

  const prematchCouponData = useSelector((state) => state.coupon.couponData[codes]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[codes]);
  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getMobileBetslipMaxSelections);
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;
  const language = useSelector(getAuthLanguage);

  const [activePrematchMatchId, setActivePrematchMatchId] = useState(null);

  // Clear out the active match Id while navigating
  useEffect(() => {
    setActivePrematchMatchId(null);
  }, [codes]);

  // TODO change to featured when CMS is ready
  useCouponData(dispatch, codes, "GAME", false, null, false, false, true, false, null);

  const toggleEventHandler = (matchId) => () => {
    if (activePrematchMatchId === matchId) {
      setActivePrematchMatchId(null); // collapse, effectively
    } else {
      setActivePrematchMatchId(matchId);
    }
  };

  const toggleBetslipSelectionHandler = (outcomeId, eventId) => {
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
    prematchCouponData != null
      ? Object.values(prematchCouponData).map((sport) => {
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
                      {events.map((match) => {
                        const mainMarketId = match && match.children ? Object.values(match.children)[0].id : null;

                        return (
                          <div className={classes["result__body"]} key={match.id}>
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
                                          `${betradarStatsURL}/${language}/en/match/${match.brMatchId}`,
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
                                        activePrematchMatchId === match.id ? classes["active"] : ""
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
                                                } ${disabled ? classes["disabled"] : ""} ${classes["price-indicator"]}`}
                                                id={`outcomeId-${outcome.id}`}
                                                key={outcome.id}
                                                onClick={() => {
                                                  toggleBetslipSelectionHandler(outcome.id, match.id);
                                                }}
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
                                                <span key={1}>{getOutcomeDescriptionByIndex(index)}</span>
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
                            {match.id === activePrematchMatchId ? (
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
                                <MainFeaturedPrematchEventDetail mainMarketId={mainMarketId} matchId={match.id} />
                              </CSSTransition>
                            ) : (
                              ""
                            )}
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
    <>
      {coupon}
      {prematchLoading && !prematchCouponData && <SectionLoader />}
    </>
  );
};

MainPrematchFeaturedCoupon.propTypes = propTypes;
MainPrematchFeaturedCoupon.defaultProps = defaultProps;

export default MainPrematchFeaturedCoupon;

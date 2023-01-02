import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getCmsConfigSportsBook } from "../../../../../../redux/reselect/cms-selector";
import { sortEvents } from "../../../../../../utils/event-sorting";
import SmsButton from "../../../../common/components/SmsButton";

import { useCouponData } from "applications/common/hooks/useCouponData";
import SectionLoader from "applications/vanillamobile/common/components/SectionLoader";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { makeGetBetslipOutcomeIds } from "redux/reselect/betslip-selector";
import { getMobileBetslipMaxSelections, isMobileCompactBetslip } from "redux/reselect/cms-layout-widgets";
import dayjs from "services/dayjs";
import { onRefreshBetslipHandler, onToggleSelection } from "utils/betslip-utils";
import { getEvents } from "utils/prematch-data-utils";

const propTypes = {
  searchCode: PropTypes.string.isRequired,
};

const KironRacingContainer = ({ searchCode }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));
  const maxBetslipSelections = useSelector(getMobileBetslipMaxSelections);
  const compactBetslipMode = useSelector(isMobileCompactBetslip);

  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  const pathCouponData = useSelector((state) => state.coupon.couponData[searchCode]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[searchCode]);

  const code = searchCode;

  // ['THREE_WAYS_MONEY_LINE', 'TWO_WAYS_MONEY_LINE', 'TWO_WAYS_TOTAL', 'TWO_WAYS_SPREAD']
  useCouponData(dispatch, code, "RANK", true, null, false, true, false, false, null);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length >= maxBetslipSelections && !betslipOutcomeIds.find((x) => x === outcomeId)) {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    } else {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
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
              // const categoryDescription = category.desc;
              if (category.children) {
                // const tournaments = Object.values(category.children).slice().sort(sortEventPaths);
                const tournaments = Object.values(category.children);

                return tournaments.map((tournament) => {
                  // const pathDescription = `${categoryDescription} : ${tournament.desc}`;
                  const events = getEvents(Object.values(tournament.children))
                    .filter((match) => Object.values(match.children).findIndex((market) => !market.flags) > -1)
                    .slice()
                    .sort(sortEvents);

                  return events.map((match) => {
                    const markets = Object.values(match.children);

                    if (markets.length === 0) return null;

                    const winMarket = markets?.find((m) => m?.externalCode?.endsWith("Win"));
                    const placeMarket = markets?.find((m) => m?.externalCode?.endsWith("Place"));

                    if (!(winMarket && placeMarket)) return null;

                    return (
                      <div className={classes["bet"]} key={match.id}>
                        <div className={classes["bet__container"]}>
                          <div className={classes["bet__header"]}>
                            <div className={classes["bet__numbers"]}>
                              <div className={classes["bet__time"]}>{dayjs.unix(match.epoch / 1000).calendar()}</div>
                            </div>
                            <div className={classes["bet__header-container"]}>
                              <div className={cx(classes["bet__team"], classes["bet__team_grey"])}>
                                <span>{match.desc}</span>
                                <span>{tournament.desc}</span>
                              </div>
                              <div className={classes["bet__headings"]}>
                                <div className={classes["bet__heading"]}>
                                  <span className={classes["bet__subheading"]}>WIN</span>
                                  {isSmsInfoEnabled && <SmsButton />}
                                </div>
                                <div className={classes["bet__heading"]}>
                                  <span className={classes["bet__subheading"]}>TOP3</span>
                                  {isSmsInfoEnabled && <SmsButton />}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={classes["virtual-matches"]}>
                          {Object.values(winMarket.children).map((outcome, index) => {
                            const top3Outcome = placeMarket ? Object.values(placeMarket.children)[index] : undefined;

                            return (
                              <div className={classes["virtual-match"]} key={outcome.id}>
                                <span className={classes["virtual-match__number"]}>{index + 1}</span>
                                <div className={classes["virtual-match__titles"]}>
                                  <div className={classes["virtual-match__title"]}>{outcome.desc}</div>
                                  {/* <div className={classes["virtual-match__label"]}>Form: N/A</div> */}
                                  {/* <div className={classes["virtual-match__label"]}>Rating: N/A</div> */}
                                </div>
                                <div className={classes["virtual-match__coeficients"]}>
                                  <div
                                    className={cx(classes["bet__icon"], {
                                      [classes["active"]]: betslipOutcomeIds.includes(outcome.id),
                                    })}
                                    style={{ cursor: "pointer", pointerEvents: "auto" }}
                                    onClick={() => toggleBetslipHandler(outcome.id, match.id)}
                                  >
                                    {outcome.price}
                                  </div>
                                  <div
                                    className={cx(classes["bet__icon"], {
                                      [classes["active"]]: betslipOutcomeIds.includes(top3Outcome.id),
                                    })}
                                    style={{ cursor: "pointer", pointerEvents: "auto" }}
                                    onClick={() => toggleBetslipHandler(top3Outcome.id, match.id)}
                                  >
                                    {top3Outcome ? top3Outcome.price : ""}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
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

KironRacingContainer.propTypes = propTypes;

export default KironRacingContainer;

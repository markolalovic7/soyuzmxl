import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getEvents } from "../../../../../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../../../../../common/hooks/useCouponData";
import MatchSummary from "../../../../../PrematchPage/components/CentralColumn/components/CompactPrematchBody/LeftCompactColumn/components/MatchSummary";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const PrematchDashboardColumn = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const eventPathIds = [227]; // TODO this must come from favourites in the future

  const code = eventPathIds.map((id) => `p${id}`).join(",");
  const pathCouponData = useSelector((state) => state.coupon.couponData[code]);

  // ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"]
  useCouponData(dispatch, code, "GAME", false, null, false, false, true, false, null, false, null, null);

  return (
    <div
      className={cx(classes["content-col--half"], classes["content-col"], {
        [classes["content-col--half_special"]]: false,
      })}
    >
      <div className={classes["box-title"]}>{t("sports")}</div>
      {pathCouponData ? (
        Object.values(pathCouponData).map((sport) => {
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
                    <div className={classes["content-col__cards"]}>
                      {events
                        .map((match) => {
                          const markets = match?.children ? Object.values(match.children) : [];
                          const outcomes =
                            markets.length > 0 && markets[0].children ? Object.values(markets[0].children) : [];

                          return {
                            code: `+${match.count > 1 ? match.count - 1 : 0}`,
                            coefficients: outcomes.map((outcome) => ({
                              desc: outcome.desc,
                              dir: outcome.priceDir,
                              hidden: outcome.hidden,
                              outcomeId: outcome.id,
                              price: outcome.price,
                            })),
                            epoch: match.epoch,
                            eventId: match.id,
                            feedCode: match.brMatchId,
                            label: match.desc,
                          };
                        })
                        .map((ticket) => (
                          <MatchSummary
                            coefficients={ticket.coefficients}
                            countCode={ticket.code}
                            epoch={ticket.epoch}
                            eventId={ticket.eventId}
                            feedCode={ticket.feedCode}
                            key={ticket.eventId}
                            label={ticket.label}
                            sportCode={sport.code}
                          />
                        ))}
                    </div>
                  );
                });
              }

              return null;
            });
          }

          return null;
        })
      ) : (
        <div className={classes["spinner-container"]}>
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        </div>
      )}
    </div>
  );
};

export default React.memo(PrematchDashboardColumn);

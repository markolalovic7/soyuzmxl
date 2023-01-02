import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { getEvents } from "../../../../../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../../../../../common/hooks/useCouponData";
import MatchSummary from "../CompactPrematchBody/LeftCompactColumn/components/MatchSummary";

import MatchDetail from "./components/MatchDetail";

import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const RegularPrematchBody = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { eventId: eventIdStr, eventPathId: eventPathIdsStr } = useParams();
  const selectedEventId = Number(eventIdStr);

  const eventPathIds = eventPathIdsStr ? eventPathIdsStr.split(",").map((x) => Number(x)) : [];

  const code = eventPathIds.map((id) => `p${id}`).join(",");
  const pathCouponData = useSelector((state) => state.coupon.couponData[code]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[code]);
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData?.ept);

  // ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"]
  useCouponData(dispatch, code, null, false, null, false, false, true, false, null, false, null, null);

  useEffect(() => {
    if (!eventPathIds && sportsTreeData?.length > 0) {
      history.push(`/prematch/eventpath/${sportsTreeData[0].path[0].path[0].id}`);
    }

    return undefined;
  }, [eventPathIds, history, sportsTreeData]);

  if (!pathCouponData)
    return (
      <div className={classes["spinner-container"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );

  return (
    <div className={classes["content__cols"]}>
      <div className={cx(classes["content-col"], classes["content-col--full"])}>
        {Object.values(pathCouponData).map((sport) => {
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
                    <React.Fragment key={pathDescription}>
                      <div className={classes["title-1"]}>{pathDescription}</div>
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
                            <>
                              <MatchSummary
                                allowToUnselect
                                coefficients={ticket.coefficients}
                                countCode={ticket.code}
                                epoch={ticket.epoch}
                                eventId={ticket.eventId}
                                feedCode={ticket.feedCode}
                                key={ticket.eventId}
                                label={ticket.label}
                                sportCode={sport.code}
                              />
                              {ticket.eventId === selectedEventId && <MatchDetail eventId={ticket.eventId} />}
                            </>
                          ))}
                      </div>
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
    </div>
  );
};

export default RegularPrematchBody;

import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import { filterMarkets, getEvent, groupMarkets } from "../../../../../../utils/eventsHelpers";
import { getEvents } from "../../../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../../../common/hooks/useCouponData";
import CentralColumnWidgets from "../../../../components/CentralColumnWidgets";
import PrematchNavigationTabs from "../../../../components/PrematchNavigationTabs";
import { getNavigationTabs } from "../../../../components/PrematchNavigationTabs/constants";
import CompactTicket from "../CompactTicket";
import EventMatch from "../EventMatch";
import MatchSpoilersSection from "../MatchSpoilersSection";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const CentralColumn = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { eventId: eventIdStr, eventPathId: eventPathIdStr } = useParams();

  const eventPathId = eventPathIdStr ? parseInt(eventPathIdStr, 10) : undefined;
  const eventId = eventIdStr ? parseInt(eventIdStr, 10) : undefined;

  // Event Path section
  const code = eventPathId ? `p${eventPathId}` : undefined;
  const pathCouponData = useSelector((state) => state.coupon.couponData[code]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[code]);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData?.ept);

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const navigationTabs = useMemo(() => getNavigationTabs(t), [t]);

  const [selectedMarketTypeGroupTab, setSelectedMarketTypeGroupTab] = useState(navigationTabs[0].code);

  useEffect(() => {
    if (!eventPathId && sportsTreeData?.length > 0) {
      history.push(`/prematch/eventpath/${sportsTreeData[0].path[0].path[0].id}`);
    }

    return undefined;
  }, [eventPathId, history, sportsTreeData]);

  // ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"]
  useCouponData(dispatch, code, null, false, null, false, false, true, false, null, null, null);

  // Event section
  const eventCode = eventId ? `e${eventId}` : undefined;
  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);

  useCouponData(dispatch, eventCode, "ALL", true, null, false, false, false, false, null);

  useEffect(() => {
    if (!eventId && eventPathId && pathCouponData) {
      const events = getEvents(Object.values(pathCouponData));
      if (events.length > 0) history.push(`/prematch/eventpath/${eventPathId}/event/${events[0].id}`);
    }

    return undefined;
  }, [eventId, eventPathId, history, pathCouponData]);

  const match = getEvent(eventCouponData);

  const markets = match ? Object.values(match.children) : [];

  const onSelectMatchHandler = (matchId) => {
    history.push(`/prematch/eventpath/${eventPathId}/event/${matchId}`);
  };

  return (
    <div
      className={cx(classes["central-section"], classes["central-section_compact"], {
        [classes["iframe"]]: isApplicationEmbedded,
      })}
    >
      <div className={classes["central-section__content"]}>
        <CentralColumnWidgets />
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
                      <React.Fragment key={pathDescription}>
                        <h3 className={classes["main-title"]}>
                          <p className={classes["main-title__text"]}>{pathDescription}</p>
                          {/* <div className={classes["main-title__icons"]}> */}
                          {/*  <div className={classes["main-title__icon"]}> */}
                          {/*    <IconSvg /> */}
                          {/*    /!* <span className={classes["main-title__numbers"]}>119</span> *!/ */}
                          {/*  </div> */}
                          {/* </div> */}
                        </h3>
                        <div className={classes["central-section__container"]}>
                          <div className={classes["compact-central-section"]}>
                            <div className={classes["compact-central-section__tickets"]}>
                              <div className={classes["tickets"]}>
                                {events
                                  .map((match) => {
                                    const markets = match?.children ? Object.values(match.children) : [];
                                    const outcomes =
                                      markets.length > 0 && markets[0].children
                                        ? Object.values(markets[0].children)
                                        : [];

                                    return {
                                      code: `+${match.count > 1 ? match.count - 1 : 0}`,
                                      coefficients: outcomes.map((outcome) => ({
                                        desc: outcome.desc,
                                        dir: outcome.priceDir,
                                        hidden: outcome.hidden,
                                        outcomeId: outcome.id,
                                        price: outcome.price,
                                      })),
                                      date: dayjs.unix(match.epoch / 1000).format("D MMMM hh:mm A"),
                                      eventId: match.id,
                                      feedCode: match.brMatchId,
                                      label: match.desc,
                                    };
                                  })
                                  .map((ticket, index) => (
                                    <CompactTicket
                                      key={index}
                                      selected={ticket.eventId === eventId}
                                      ticket={ticket}
                                      onSelect={onSelectMatchHandler}
                                    />
                                  ))}
                              </div>
                            </div>
                            <div className={classes["compact-central-section__matches"]}>
                              {eventCouponData && match ? (
                                <>
                                  <EventMatch
                                    eventId={match?.id}
                                    market={markets?.length > 0 ? markets[0] : undefined}
                                    pathDescription={pathDescription}
                                    sportCode={match.code}
                                  />
                                  <div className={classes["compact-central-section__scrollable"]}>
                                    <PrematchNavigationTabs
                                      markets={markets?.slice(1, markets.length)}
                                      selectedMarketTypeGroupTab={selectedMarketTypeGroupTab}
                                      setSelectedMarketTypeGroupTab={setSelectedMarketTypeGroupTab}
                                    />
                                    <MatchSpoilersSection
                                      eventId={match?.id}
                                      markets={
                                        markets
                                          ? groupMarkets(
                                              filterMarkets(
                                                selectedMarketTypeGroupTab,
                                                markets.slice(1, markets.length),
                                              ),
                                            )
                                          : []
                                      }
                                    />
                                  </div>
                                </>
                              ) : (
                                <FontAwesomeIcon
                                  className={cx("fa-spin", classes["spinner"])}
                                  icon={faSpinner}
                                  size="3x"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
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
    </div>
  );
};

export default CentralColumn;

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { getImg } from "../../../../../../../../../utils/bannerHelpers";
import {
  filterMarkets,
  getEvent,
  getPathDescription,
  groupMarkets,
} from "../../../../../../../../../utils/eventsHelpers";
import { useCouponData } from "../../../../../../../../common/hooks/useCouponData";
import { getNavigationTabs } from "../../../../../../../../vanilladesktop/components/PrematchNavigationTabs/constants";

import HeaderOutcomePrice from "./components/HeaderOutcomePrice";
import PrematchNavigationTabs from "./components/PrematchNavigationTabs";
import RightMatchOutcome from "./components/RightMatchOutcome";

import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";

const getRows = (selections) => {
  const selectionsPerRow = selections.length === 3 ? 3 : 2;

  const rows = selections.reduce((result, value, index, array) => {
    if (index % selectionsPerRow === 0) result.push(array.slice(index, index + selectionsPerRow));

    return result;
  }, []);

  return rows;
};

const RightCompactColumn = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const navigationTabs = useMemo(() => getNavigationTabs(t), [t]);
  const [selectedMarketTypeGroupTab, setSelectedMarketTypeGroupTab] = useState(navigationTabs[0].code);

  const [openMarkets, setOpenMarkets] = useState([]);

  const { eventId: eventIdStr } = useParams();

  const eventId = eventIdStr ? parseInt(eventIdStr, 10) : undefined;

  // Event section
  const eventCode = eventId ? `e${eventId}` : undefined;
  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);

  useCouponData(dispatch, eventCode, "ALL", true, null, false, false, false, false, null);

  const match = getEvent(eventCouponData);
  const pathDescription = eventCouponData ? getPathDescription(eventCouponData) : "";

  const markets = match ? Object.values(match.children) : [];

  const onToggleMarketHandler = (id) => {
    if (openMarkets.includes(id)) {
      setOpenMarkets(openMarkets.filter((x) => x !== id));
    } else {
      setOpenMarkets([...openMarkets, id]);
    }
  };

  return (
    <div className={cx(classes["content-col--half"], classes["content-col"], classes["content-col--half_special"])}>
      <div className={classes["content__box-2"]}>
        {!match && <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />}

        {eventCouponData && match && (
          <>
            <div
              className={cx(classes["sport-head"], classes["sport-head--split"])}
              style={{ backgroundImage: `url(${getImg(match.code)})` }}
            >
              <div className={classes["sport-head__inner"]}>
                <div className={classes["sport-head__info"]}>
                  <div className={cx(classes["title-1"], classes["title-1_special"])}>{pathDescription}</div>
                  <div className={classes["sport-head__time"]}>
                    {t("vanilladesktop.bets_close_at", {
                      time: dayjs.unix(match.epoch / 1000).format("D MMMM hh:mm A"),
                    })}
                  </div>
                </div>
                {markets?.length > 0 && (
                  <div className={classes["sport-head__score"]}>
                    {Object.values(markets[0].children)?.map((outcome, index) => (
                      <HeaderOutcomePrice
                        desc={outcome.desc}
                        eventId={match.id}
                        hidden={outcome.hidden}
                        isSmall={markets[0].children.length === 3 && index === 1}
                        key={outcome.id}
                        outcomeId={outcome.id}
                        price={outcome.price}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            {markets.length > 1 && (
              <div className={classes["content-tabs"]}>
                <PrematchNavigationTabs
                  markets={markets?.slice(1, markets.length)}
                  selectedMarketTypeGroupTab={selectedMarketTypeGroupTab}
                  setSelectedMarketTypeGroupTab={setSelectedMarketTypeGroupTab}
                />

                <div className={classes["content-tabs__content"]}>
                  <div className={cx(classes["content-tab"], { [classes["content-tab_active"]]: true })} id="tab-1">
                    {(markets
                      ? groupMarkets(filterMarkets(selectedMarketTypeGroupTab, markets.slice(1, markets.length)))
                      : []
                    ).map((submarkets, index) => (
                      <div className={classes["content-dropdown"]} key={index}>
                        <div
                          className={cx(classes["content-dropdown__head"], {
                            [classes["active"]]: openMarkets.includes(submarkets[0].id),
                          })}
                          onClick={() => onToggleMarketHandler(submarkets[0].id)}
                        >
                          <div className={classes["content-dropdown__title"]}>
                            <b>{submarkets.length > 0 ? `${submarkets[0].desc} - ${submarkets[0].period}` : ""}</b>
                          </div>
                          <div className={cx(classes["content-dropdown__arrow"], classes["js-dropdown"])}>
                            <FontAwesomeIcon icon={faChevronDown} />
                          </div>
                        </div>
                        {openMarkets.includes(submarkets[0].id) && (
                          <div
                            className={cx(classes["content-dropdown__body"], classes["js-dropdown-box"])}
                            style={{ display: "block" }}
                          >
                            {submarkets.map((market) => {
                              const rows = getRows(Object.values(market.children));

                              return rows.map((row, index) => (
                                <div className={classes["content-dropdown__row"]} key={index}>
                                  {row.map((outcome, index2) => (
                                    <RightMatchOutcome
                                      coefficient={outcome}
                                      coefficientCount={Object.values(market.children).length}
                                      eventId={eventId}
                                      index={index2}
                                      key={outcome.id}
                                    />
                                  ))}
                                </div>
                              ));
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(RightCompactColumn);

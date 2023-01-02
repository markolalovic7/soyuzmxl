import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  BETRADAR_VIRTUAL_FEED_CODE_VBI,
  BETRADAR_VIRTUAL_FEED_CODE_VBL,
} from "../../../../../../constants/betradar-virtual-sport-feed-code-types";
import { isLiveBetradarVirtualSports } from "../../../../../../utils/betradar-virtual-utils";
import { getPathDescription } from "../../../../../../utils/eventsHelpers";
import { getEvents } from "../../../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../../../common/hooks/useCouponData";
import RectangleIcon from "../../../../img/icons/rectangle_2.svg";
import classes from "../../../../scss/ollehdesktop.module.scss";
import GamesListBetButton from "../GamesListBetButton";

import VirtualMarketDetail from "./components/VirtualMarketDetail";

const getMarket = (markets, marketTypeGroup) => markets.find((m) => m.marketTypeGroup === marketTypeGroup);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const VirtualCoupon = ({ code, feedCode, live }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Subscribe to prematch data...
  const prematchCouponData = useSelector((state) => state.coupon.couponData[code]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[code]);

  useCouponData(
    dispatch,
    code,
    "GAME",
    false,
    ["THREE_WAYS_MONEY_LINE", "TWO_WAYS_MONEY_LINE", "TWO_WAYS_TOTAL", "TWO_WAYS_SPREAD"],
    live,
    true,
    true,
    false,
    null,
  );

  const [activeEventId, setActiveEventId] = useState();

  const matches = prematchCouponData ? getEvents(Object.values(prematchCouponData)).sort(sortEvents) : [];
  const pathDescription = matches?.length > 0 ? getPathDescription(prematchCouponData) : "";

  useEffect(() => {
    if (!activeEventId || !matches?.find((m) => m.id === activeEventId)) {
      if (matches?.length > 0) {
        setActiveEventId(matches[0].id);
      }
    }
  }, [activeEventId, matches]);

  if (!(matches?.length > 0)) return null;

  return (
    <>
      <div className={classes["main__column-days"]}>
        {pathDescription.split(" ")[0]}
        <span>
          &nbsp;
          {pathDescription.split(" ")[1]}
        </span>
      </div>
      <div className={classes["games__list"]}>
        <table className={classes["games__list-table"]}>
          <thead>
            <tr>
              <th aria-label="teams" />
              <th>1x2</th>
              <th>{t("handicap")}</th>
              <th>{t("over_under")}</th>
              <th aria-label="stats" />
            </tr>
            <tr>
              <th>Virtual Teams</th>
              <th>
                <span>1</span>
                {feedCode !== BETRADAR_VIRTUAL_FEED_CODE_VBL && <span>X</span>}
                <span>2</span>
              </th>
              <th>
                <span>H</span>
                <span>1</span>
                <span>2</span>
              </th>
              <th>
                <span>T</span>
                <span>O</span>
                <span>U</span>
              </th>
              <th aria-label="stats" />
              <th aria-label="stats" />
            </tr>
          </thead>
          <tbody>
            {matches?.map((match) => {
              const wdwMarket = match.children ? getMarket(Object.values(match.children), "MONEY_LINE") : [];
              const ahMarket = match.children ? getMarket(Object.values(match.children), "FIXED_SPREAD") : [];
              const ouMarket = match.children ? getMarket(Object.values(match.children), "FIXED_TOTAL") : [];

              let ahSpread = 0;
              if (ahMarket) {
                const ahSpreadChunks = ahMarket.externalCode.split(":");
                const ahSpreadNumber = Number(ahSpreadChunks[ahSpreadChunks.length - 1]);
                ahSpread = (ahSpreadNumber !== 0 ? -1 : 1) * ahSpreadNumber;
              }

              let ouSpread = 0;
              if (ouMarket) {
                const ouSpreadChunks = ouMarket.externalCode.split(":");
                ouSpread = Number(ouSpreadChunks[ouSpreadChunks.length - 1]);
              }

              return (
                <tr key={match.id}>
                  <td>
                    <span>{match.a}</span>
                    &nbsp;vs&nbsp;
                    <span>{match.b}</span>
                  </td>
                  <td>
                    {wdwMarket?.children &&
                      Object.values(wdwMarket.children).map((o) => (
                        <GamesListBetButton eventId={match.id} key={o.id} label={o.price} outcomeId={o.id} />
                      ))}
                  </td>
                  <td>
                    {ahMarket?.children && (
                      <button style={{ color: "#ffd800", cursor: "default" }} type="button">
                        {ahSpread.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </button>
                    )}
                    {ahMarket?.children &&
                      Object.values(ahMarket.children).map((o) => (
                        <GamesListBetButton eventId={match.id} key={o.id} label={o.price} outcomeId={o.id} />
                      ))}
                  </td>
                  <td>
                    {ouMarket?.children && (
                      <button style={{ color: "#ffd800", cursor: "default" }} type="button">
                        {ouSpread.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </button>
                    )}
                    {ouMarket?.children &&
                      Object.values(ouMarket.children).map((o) => (
                        <GamesListBetButton eventId={match.id} key={o.id} label={o.price} outcomeId={o.id} />
                      ))}
                  </td>
                  <td style={{ cursor: "pointer", width: "auto" }}>
                    <img alt="" src={RectangleIcon} />
                  </td>
                  <td style={{ cursor: "pointer" }} onClick={() => setActiveEventId(match.id)}>
                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* <div className={classes["games__list-footer"]} style={{ fontSize: "11px" }}> */}
        {/* */}
        {/* </div> */}
      </div>

      <div style={{ minHeight: feedCode === BETRADAR_VIRTUAL_FEED_CODE_VBI ? "500px" : "2500px" }}>
        {activeEventId && (
          <VirtualMarketDetail activeEventId={activeEventId} live={isLiveBetradarVirtualSports(feedCode)} />
        )}
      </div>
    </>
  );
};

const propTypes = {
  code: PropTypes.string.isRequired,
  feedCode: PropTypes.string.isRequired,
  live: PropTypes.bool.isRequired,
};
VirtualCoupon.propTypes = propTypes;

export default VirtualCoupon;

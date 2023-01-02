import cx from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { filterMarkets, groupMarkets } from "../../../../../../../../utils/eventsHelpers";
import { getEvents } from "../../../../../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../../../../../common/hooks/useCouponData";
import classes from "../../../../../../scss/ollehdesktop.module.scss";
import TotalSpoilerRate from "../../../TotalSpoilerRate";
import VirtualMarketTypeSelector from "../../../VirtualMarketTypeSelector";

const propTypes = {
  activeEventId: PropTypes.number.isRequired,
};

const getRows = (children) => {
  const arrays = [];
  if (children) {
    const size = children.length > 3 ? 2 : children.length; // if size is 2-3, display as is. If the size is > 3, split in groups of 2

    for (let i = 0; i < children.length; i += size) {
      arrays.push(children.slice(i, i + size));
    }
  }

  return arrays;
};

const VirtualMarketDetail = ({ activeEventId, live }) => {
  const [marketTypeGroupSelection, setMarketTypeGroupSelection] = useState("ALL");
  const [isTotalOpen, setIsTotalOpen] = useState(true);

  // Subscribe to detail prematch data...
  const dispatch = useDispatch();
  const detailedCode = `${live ? "l" : "e"}${activeEventId}`;
  const prematchDetailedCouponData = useSelector((state) => state.coupon.couponData[detailedCode]);
  const prematchDetailLoading = useSelector((state) => state.coupon.couponLoading[detailedCode]);

  useCouponData(dispatch, detailedCode, "GAME", true, null, live, true, false, false, null);

  const matches = prematchDetailedCouponData ? getEvents(Object.values(prematchDetailedCouponData)) : [];

  if (!matches || matches.length === 0) return null;

  return (
    <div className={classes["sports__spoilers"]}>
      <div className={classes["sport__spoiler-title"]}>
        <div
          className={cx(classes["sport__spoiler-title-left"], {
            [classes["active"]]: isTotalOpen,
          })}
          // onClick={() => setIsTotalOpen((isOpen) => !isOpen)}
        >
          {/* <FontAwesomeIcon icon={faChevronRight} /> */}
          <span>{`${matches[0].desc}`}</span>
        </div>
        <div className={classes["games__list-footer"]} style={{ fontSize: "11px" }}>
          <VirtualMarketTypeSelector
            marketTypeGroupSelection={marketTypeGroupSelection}
            setMarketTypeGroupSelection={setMarketTypeGroupSelection}
          />
        </div>
        <div className={classes["sport__spoiler-title-right"]}>
          <div>
            Day
            <span>&nbsp;10</span>
          </div>
        </div>
      </div>
      <div className={cx(classes["sport__spoiler-wrapper"], { [classes["hidden"]]: !isTotalOpen })}>
        {groupMarkets(
          filterMarkets(marketTypeGroupSelection, matches[0].children ? Object.values(matches[0].children) : []),
        ).map((marketGroup) => {
          const rows = [];

          marketGroup.forEach((market) => {
            const marketRows = market.children
              ? getRows(
                  Object.values(market.children).map((o) => ({
                    ...o,
                    hidden: o.hidden || !market.open,
                  })),
                )
              : []; // split in 2-3 outcomes per row (for as many rows as required...)
            rows.push(...marketRows);
          });

          return (
            <div className={classes["sport__spoiler-content"]} key={marketGroup[0].id}>
              <h4>{`${marketGroup[0].desc} - ${marketGroup[0].period}`}</h4>
              <div className={classes["sport__spoiler-rates"]}>
                {rows.map((row) =>
                  row.map(({ desc, dir, hidden, id, price }) => (
                    <TotalSpoilerRate
                      dir={dir}
                      eventId={matches[0].id}
                      hidden={hidden}
                      key={id}
                      leftLabel={desc}
                      outcomeId={id}
                      rightLabel={price}
                    />
                  )),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

VirtualMarketDetail.propTypes = propTypes;

export default VirtualMarketDetail;

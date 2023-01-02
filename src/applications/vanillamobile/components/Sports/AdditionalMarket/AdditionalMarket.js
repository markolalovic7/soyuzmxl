import React from "react";
import { useSelector } from "react-redux";

import { getCmsConfigSportsBook } from "../../../../../redux/reselect/cms-selector";
import OutcomePriceButton from "../OutcomePriceButton/OutcomePriceButton";

import SmsButton from "applications/vanillamobile/common/components/SmsButton";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const AdditionalMarket = (props) => {
  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  // Where more than one market exist per group, we use the first market as reference...
  const marketId = props.marketGroup[0].id;
  const desc = props.marketGroup[0].desc;
  const period = props.marketGroup[0].period;

  const rows = [];
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

  props.marketGroup.forEach((market) => {
    const marketRows = market.children
      ? getRows(Object.values(market.children).map((o) => ({ ...o, hidden: o.hidden || !market.open })))
      : []; // split in 2-3 outcomes per row (for as many rows as required...)
    rows.push(...marketRows);
  });

  return (
    <div className={classes["matches__wrapper"]}>
      <div
        className={`${classes["matches__list"]} ${classes["spoiler-list"]} ${props.expanded ? classes["active"] : ""}`}
        onClick={(e) => props.onToggle(e, marketId)}
      >
        <div
          className={`${classes["spoiler-arrow"]} ${classes["matches__arrow"]} ${
            props.expanded ? classes["active"] : ""
          }`}
          onClick={(e) => props.onToggle(e, marketId)}
        />
        <span>{`${desc.length <= 35 ? desc : `${desc.slice(0, 30)}...`} - ${period}`}</span>
        {isSmsInfoEnabled && <SmsButton />}
      </div>
      <div className={`${classes["matches__elements"]} ${props.expanded ? classes["open"] : ""}`}>
        {rows.map((outcomes, index) => (
          <div className={classes["matches__row"]} key={`${marketId}-${index}`}>
            {outcomes.map((outcome) => (
              <OutcomePriceButton
                description={outcome.desc}
                dir={outcome.dir}
                eventId={props.eventId}
                hidden={outcome.hidden}
                key={outcome.id}
                outcomeId={outcome.id}
                period={null}
                price={outcome.price}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AdditionalMarket);

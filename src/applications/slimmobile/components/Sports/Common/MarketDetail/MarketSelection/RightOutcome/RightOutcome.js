import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import React from "react";

const MarketSelection = (props) => (
  <div
    className={`${classes["matches__selection"]} ${props.active ? classes["active"] : ""} ${
      props.disabled ? classes["disabled"] : ""
    } ${classes["price-indicator"]}`}
    key={props.outcome.id}
    onClick={() => props.addToBetslipHandler(props.outcome.id, props.eventId)}
  >
    {props.outcome.dir ? (
      props.outcome.dir === "d" || props.outcome.dir === "<" ? (
        <span className={`${classes["price-indicator__triangle"]} ${classes["price-indicator__triangle_red"]}`} />
      ) : props.outcome.dir === "u" || props.outcome.dir === ">" ? (
        <span className={`${classes["price-indicator__triangle"]} ${classes["price-indicator__triangle_green"]}`} />
      ) : null
    ) : null}
    <span className={classes["matches__selection-bold"]}>{props.outcome.price}</span>
    <span className={classes["matches__selection_right"]}>{props.outcome.desc}</span>
  </div>
);

export default React.memo(MarketSelection);

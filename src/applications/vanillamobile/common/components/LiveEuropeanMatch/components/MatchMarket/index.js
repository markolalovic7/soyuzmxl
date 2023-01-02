import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { getCmsConfigSportsBook } from "../../../../../../../redux/reselect/cms-selector";

import SmsButton from "applications/vanillamobile/common/components/SmsButton";
import OutcomePriceButton from "applications/vanillamobile/components/Sports/OutcomePriceButton/OutcomePriceButton";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  eventId: PropTypes.number.isRequired,
  sels: PropTypes.array,
};
const defaultProps = {
  sels: [],
};

const LiveMatchMarket = ({ eventId, sels }) => {
  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  if (isEmpty(sels)) {
    return null;
  }

  return (
    <div className={classes["bet__row"]}>
      {sels.map((sel) => (
        <OutcomePriceButton
          description={sel.oDesc}
          dir={sel.dir === ">" ? "u" : sel.dir === "<" ? "d" : ""}
          eventId={eventId}
          hidden={sel.hidden}
          key={sel.oId}
          outcomeId={sel.oId}
          period={null}
          price={sel.formattedPrice}
        />
      ))}
      {isSmsInfoEnabled && <SmsButton />}
    </div>
  );
};

LiveMatchMarket.propTypes = propTypes;
LiveMatchMarket.defaultProps = defaultProps;

export default React.memo(LiveMatchMarket);

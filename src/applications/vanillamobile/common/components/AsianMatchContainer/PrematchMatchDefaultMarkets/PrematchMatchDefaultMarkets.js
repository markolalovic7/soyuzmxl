import PropTypes from "prop-types";
import { memo } from "react";
import { useSelector } from "react-redux";

import SmsButton from "applications/vanillamobile/common/components/SmsButton";
import OutcomePriceButton from "applications/vanillamobile/components/Sports/OutcomePriceButton/OutcomePriceButton";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getCmsConfigSportsBook } from "redux/reselect/cms-selector";

const propTypes = {
  eventId: PropTypes.number.isRequired,
  markets: PropTypes.array.isRequired,
};

const defaultProps = {};

const PrematchMatchDefaultMarkets = ({ eventId, markets }) => {
  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  return (
    <div className={classes["bet__body"]}>
      <div className={classes["bet__coeficients"]}>
        {markets
          .filter((market) => market.open)
          .map((market) => (
            <div className={classes["bet__row"]} key={market.id}>
              {market.children &&
                Object.values(market.children)
                  .filter((outcome) => !outcome.hidden)
                  .map((outcome) => (
                    <OutcomePriceButton
                      description={outcome.desc}
                      dir={outcome.dir}
                      eventId={eventId}
                      hidden={outcome.hidden || !market.open}
                      key={outcome.id}
                      outcomeId={outcome.id}
                      period={null}
                      price={outcome.price}
                    />
                  ))}
              {isSmsInfoEnabled && <SmsButton />}
            </div>
          ))}
      </div>
    </div>
  );
};

PrematchMatchDefaultMarkets.propTypes = propTypes;
PrematchMatchDefaultMarkets.defaultProps = defaultProps;

export default memo(PrematchMatchDefaultMarkets);

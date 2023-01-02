import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import BetButton from "applications/vanillamobile/common/components/BetButton";
import SmsButton from "applications/vanillamobile/common/components/SmsButton";
import OutcomePriceButton from "applications/vanillamobile/components/Sports/OutcomePriceButton/OutcomePriceButton";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getCmsConfigSportsBook } from "redux/reselect/cms-selector";

const propTypes = {
  match: PropTypes.object.isRequired,
};

const defaultProps = {};

const OutrightContainer = ({ match }) => {
  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

  return (
    match.children &&
    Object.values(match.children).map((market) => (
      <div className={classes["bet"]} key={market.id}>
        <div className={classes["bet__container"]}>
          <div className={classes["bet__header"]}>
            <div className={classes["bet__numbers"]}>
              <div className={classes["bet__id"]}>{`ID ${market.id}`}</div>
              <div className={classes["bet__time"]}>{dayjs.unix(match.epoch / 1000).calendar()}</div>
            </div>
            <div className={classes["bet__header-container"]}>
              <div className={`${classes["bet__team"]} ${classes["bet__team_grey"]}`}>
                <span>{market.desc}</span>
                <span>Win Only</span>
              </div>
              <div className={classes["bet__icons"]}>
                {betradarStatsOn && betradarStatsURL && match.brMatchId && (
                  <BetButton feedCode={match.brMatchId} url={betradarStatsURL} />
                )}
                {isSmsInfoEnabled && <SmsButton />}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${classes["matches__elements"]} ${classes["matches__elements_radius-bottom"]} ${classes["open"]}`}
        >
          {market.children &&
            Object.values(market.children)
              .filter((outcome) => !outcome.hidden)
              .map((outcome) => (
                <div className={classes["matches__row"]} key={outcome.id}>
                  <OutcomePriceButton
                    description={outcome.desc}
                    dir={outcome.dir}
                    eventId={match.id}
                    outcomeId={outcome.id}
                    period={null}
                    price={outcome.price}
                  />
                </div>
              ))}
        </div>
      </div>
    ))
  );
};

OutrightContainer.propTypes = propTypes;
OutrightContainer.defaultProps = defaultProps;

export default OutrightContainer;

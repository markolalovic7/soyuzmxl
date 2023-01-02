import SelectableCoefficient from "applications/vanilladesktop/components/SelectableCoeficient/components";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { getImg } from "../../../../../../utils/bannerHelpers";

const EventMatch = ({ eventId, market, pathDescription, sportCode }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["event-match"]} style={{ backgroundImage: `url(${getImg(sportCode)})` }}>
      <div className={classes["event-match__top"]}>
        <h3 className={classes["event-match__title"]}>{pathDescription}</h3>
      </div>
      <div className={classes["event-match__coeficients"]}>
        {market?.children &&
          Object.values(market.children).map((item) => (
            <SelectableCoefficient
              desc={item.desc}
              dir={item.priceDir}
              eventId={eventId}
              hidden={item.hidden}
              key={item.id}
              outcomeId={item.id}
              price={item.price}
            />
          ))}
      </div>
      <span className={classes["event-match__date"]}>
        {t("vanilladesktop.bets_close_at", { time: dayjs.unix(market.epoch / 1000).format("D MMMM hh:mm A") })}
      </span>
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number,
  market: PropTypes.object,
  pathDescription: PropTypes.string,
  sportCode: PropTypes.string,
};

const defaultProps = {
  eventId: undefined,
  market: undefined,
  pathDescription: undefined,
  sportCode: undefined,
};

EventMatch.propTypes = propTypes;
EventMatch.defaultProps = defaultProps;

export default EventMatch;

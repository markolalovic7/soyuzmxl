import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useLiveData } from "../../../common/hooks/useLiveData";
import ExpandedMarket from "../ExpandedMarket";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getPriceDir = (priceDir) => {
  if (priceDir === ">") return "u";
  if (priceDir === "<") return "d";

  return undefined;
};
const propTypes = {
  eventId: PropTypes.number.isRequired,
  isOpened: PropTypes.bool.isRequired,
};

const LiveTableRowDropdownSpoiler = ({ eventId, isOpened }) => {
  const dispatch = useDispatch();

  const eventLiveData = useSelector((state) => state.live.liveData[`event-${eventId}`]);

  // Subscribe to the the specific event live feed
  useLiveData(dispatch, eventId ? `event-${eventId}` : null);

  const markets = eventLiveData
    ? Object.values(eventLiveData.markets)
        .sort((a, b) => a.ordinal - b.ordinal)
        .map((market) => ({
          children: market.sels
            .map((outcome) => ({
              desc: outcome.oDesc,
              dir: getPriceDir(outcome.dir),
              hidden: outcome.hidden,
              id: outcome.oId,
              price: outcome.price,
            }))
            .reduce((map, obj) => {
              map[obj.id] = obj;

              return map;
            }, {}),
          desc: market.mDesc,
          id: market.mId,
          open: market.mOpen,
          period: market.pDesc,
        }))
    : [];

  if (!eventLiveData) {
    return (
      <div className={classes["spinner-container"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );
  }

  return (
    <tr>
      <td colSpan="16">
        <div
          className={cx(classes["african-sports-table__spoilers"], {
            [classes["active"]]: isOpened,
          })}
        >
          <div className={classes["african-sports-table__spoilers-container"]}>
            {markets.map((market, index) => {
              if (index % 2 === 1) return null;

              return <ExpandedMarket eventId={eventId} key={market.id} market={market} />;
            })}
          </div>
          <div className={classes["african-sports-table__spoilers-container"]}>
            {markets.map((market, index) => {
              if (index % 2 === 0) return null;

              return <ExpandedMarket eventId={eventId} key={market.id} market={market} />;
            })}
          </div>
        </div>
      </td>
    </tr>
  );
};

LiveTableRowDropdownSpoiler.propTypes = propTypes;

export default LiveTableRowDropdownSpoiler;

import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { getEvent } from "../../../../utils/eventsHelpers";
import { useCouponData } from "../../../common/hooks/useCouponData";
import ExpandedMarket from "../ExpandedMarket";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const propTypes = {
  eventId: PropTypes.number.isRequired,
  isOpened: PropTypes.bool.isRequired,
};

const PrematchTableRowDropdownSpoiler = ({ eventId, isOpened }) => {
  const dispatch = useDispatch();
  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[`e${eventId}`]);

  const code = `e${eventId}`;
  useCouponData(dispatch, code, "ALL", true, null, false, false, false, false, null);

  const match = getEvent(eventCouponData);

  const markets = match ? Object.values(match.children) : [];

  if (prematchLoading) {
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

              return <ExpandedMarket eventId={match.id} key={market.id} market={market} />;
            })}
          </div>
          <div className={classes["african-sports-table__spoilers-container"]}>
            {markets.map((market, index) => {
              if (index % 2 === 0) return null;

              return <ExpandedMarket eventId={match.id} key={market.id} market={market} />;
            })}
          </div>
        </div>
      </td>
    </tr>
  );
};

PrematchTableRowDropdownSpoiler.propTypes = propTypes;

export default PrematchTableRowDropdownSpoiler;

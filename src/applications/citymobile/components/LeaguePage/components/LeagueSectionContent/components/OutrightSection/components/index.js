import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getLocaleDateSlashTimeFormat } from "utils/date-format";

import { getAuthLanguage, getAuthTimezoneOffset } from "../../../../../../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../../../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../../utils/betslip-utils";
import { addPrematchContentByDate } from "../../../../../../../../citydesktop/components/Common/utils/dataAggregatorUtils";
import { useCouponData } from "../../../../../../../../common/hooks/useCouponData";
import classes from "../../../../../../../scss/citymobile.module.scss";

const getTrimmedDescription = (desc) => {
  if (desc && desc.split(" - ").length > 1) {
    return desc.split(" - ").slice(1, 10).join(" - ");
  }

  return desc;
};

const combineContent = (eventPathId, prematchData) => {
  const content = [];

  addPrematchContentByDate(content, prematchData);

  return content;
};

const OutrightSection = ({ eventPathId, sportCode }) => {
  const location = useLocation();
  const locale = useSelector(getAuthLanguage);
  const dateFormat = useMemo(() => getLocaleDateSlashTimeFormat(locale), [locale]);

  const timezoneOffset = useSelector(getAuthTimezoneOffset);

  const dispatch = useDispatch();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const toggleBetslipHandler = (outcomeId, eventId) => {
    // eslint-disable-next-line sort-keys
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
    onRefreshBetslipHandler(dispatch, location.pathname, true);
  };

  // ************ PREMATCH DATA ************** //
  const prematchSdcCode = `p${eventPathId}`;

  const prematchCouponData = useSelector((state) => state.coupon.couponData[prematchSdcCode]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[prematchSdcCode]);

  // ************ END PREMATCH DATA ************** //

  useCouponData(dispatch, prematchSdcCode, "RANK", true, null, false, false, true, false, null, true, null, null);

  const combinedContent = combineContent(eventPathId, prematchCouponData);

  const isReady = !prematchLoading && prematchCouponData;

  return !isReady ? (
    <Spinner className={classes.loader} />
  ) : (
    <>
      {combinedContent.map((c) =>
        c.events.map((match) =>
          match.markets.map((market) => (
            <>
              <h3
                className={`${classes["sports-title"]} ${classes["sports-title_special"]} ${classes["sports-title_small"]}`}
                key={market.marketId}
              >
                {`${getTrimmedDescription(market.marketDescription)} - ${dayjs
                  .unix(match.epoch / 1000)
                  .format(dateFormat)}`}
              </h3>
              <div className={classes["outcomes"]}>
                {market.outcomes
                  .filter((o) => !o.outcomeHidden)
                  .sort((a, b) => a.price - b.price)
                  .map((o) => (
                    <div
                      className={`${classes["outcome"]} ${
                        betslipOutcomeIds.includes(parseInt(o.outcomeId, 10)) ? classes["selected"] : ""
                      }`}
                      key={o.outcomeId}
                      onClick={() => toggleBetslipHandler(o.outcomeId, match.eventId)}
                    >
                      <span className={classes["outcome__description"]}>{o.outcomeDescription}</span>
                      <span className={classes["outcome__odds"]}>{o.price}</span>
                    </div>
                  ))}
              </div>
            </>
          )),
        ),
      )}
    </>
  );
};

const propTypes = {
  eventPathId: PropTypes.number.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {};

OutrightSection.propTypes = propTypes;
OutrightSection.defaultProps = defaultProps;

export default OutrightSection;

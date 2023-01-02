import Spinner from "applications/common/components/Spinner";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getLocaleDateSlashTimeFormat } from "utils/date-format";

import { getAuthLanguage, getAuthTimezoneOffset } from "../../../../../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../../../../../redux/reselect/betslip-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../utils/betslip-utils";
import { useCouponData } from "../../../../../../../common/hooks/useCouponData";
import classes from "../../../../../../scss/citywebstyle.module.scss";
import { addPrematchContentByDate } from "../../../../../Common/utils/dataAggregatorUtils";

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

const isCouponReadyToShow = (activeEventPathId, prematchLoading, prematchCouponData) => {
  if (!prematchLoading && prematchCouponData) {
    return true;
  }

  return false;
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

const LeaguepageOutrightContent = ({ activeEventPathId, showFullDescription }) => {
  const locale = useSelector(getAuthLanguage);
  const dateFormat = useMemo(() => getLocaleDateSlashTimeFormat(locale), [locale]);

  // Subscribe to live data...
  const dispatch = useDispatch();
  const location = useLocation();

  const timezoneOffset = useSelector(getAuthTimezoneOffset);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const toggleBetslipHandler = (outcomeId, eventId) => {
    onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
    onRefreshBetslipHandler(dispatch, location.pathname, true);
  };

  // Subscribe to prematch data...
  const prematchCouponData = useSelector((state) => state.coupon.couponData[`p${activeEventPathId}`]);
  const prematchLoading = useSelector((state) => state.coupon.couponLoading[`p${activeEventPathId}`]);

  const code = activeEventPathId ? `p${activeEventPathId}` : null;
  useCouponData(dispatch, code, "RANK", true, null, false, false, true, false, null, true);

  const combinedContent = combineContent(activeEventPathId, prematchCouponData);

  const isReady = isCouponReadyToShow(activeEventPathId, prematchLoading, prematchCouponData);

  return !isReady ? (
    <div className={classes["homepage-spinner"]}>
      <Spinner className={classes.loader} />
    </div>
  ) : (
    <>
      {combinedContent.map((c) =>
        c.events.map((match) =>
          match.markets.map((market) => (
            <>
              <h3 className={`${classes["sports-title"]} ${classes["sports-title_time"]}`} key={market.marketId}>
                {`${
                  !showFullDescription ? getTrimmedDescription(market.marketDescription) : market.marketDescription
                } - ${dayjs
                  .unix(match.epoch / 1000)
                  .utcOffset(timezoneOffset)
                  .format(dateFormat)}`}
              </h3>
              <div className={classes["outcomes"]}>
                {getRows(market.outcomes.filter((o) => !o.outcomeHidden).sort((a, b) => a.price - b.price)).map((r) => (
                  <div className={`${classes["outcomes__row"]}`} key={r[0].outcomeId}>
                    <div
                      className={`${classes["outcome"]} ${
                        betslipOutcomeIds.includes(parseInt(r[0].outcomeId, 10)) ? classes["selected"] : ""
                      }`}
                      onClick={() => toggleBetslipHandler(r[0].outcomeId, match.eventId)}
                    >
                      <span className={classes["outcome__description"]}>{r[0].outcomeDescription}</span>
                      <span className={classes["outcome__odds"]}>{r[0].price}</span>
                    </div>
                    {r.length >= 2 ? (
                      <div
                        className={`${classes["outcome"]} ${
                          betslipOutcomeIds.includes(parseInt(r[1].outcomeId, 10)) ? classes["selected"] : ""
                        }`}
                        onClick={() => toggleBetslipHandler(r[1].outcomeId, match.eventId)}
                      >
                        <span className={classes["outcome__description"]}>{r[1].outcomeDescription}</span>
                        <span className={classes["outcome__odds"]}>{r[1].price}</span>
                      </div>
                    ) : null}
                    {r.length === 3 ? (
                      <div
                        className={`${classes["outcome"]} ${
                          betslipOutcomeIds.includes(parseInt(r[2].outcomeId, 10)) ? classes["selected"] : ""
                        }`}
                        onClick={() => toggleBetslipHandler(r[2].outcomeId, match.eventId)}
                      >
                        <span className={classes["outcome__description"]}>{r[2].outcomeDescription}</span>
                        <span className={classes["outcome__odds"]}>{r[2].price}</span>
                      </div>
                    ) : null}
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
  activeEventPathId: PropTypes.number.isRequired,
  showFullDescription: PropTypes.bool.isRequired,
};

LeaguepageOutrightContent.propTypes = propTypes;

export default LeaguepageOutrightContent;

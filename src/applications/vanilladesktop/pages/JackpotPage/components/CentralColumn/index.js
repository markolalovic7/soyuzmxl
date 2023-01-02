import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useGetJackpots } from "../../../../../../hooks/jackpots-hooks";
import { getAuthCurrencyCode } from "../../../../../../redux/reselect/auth-selector";
import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import { getJackpotByJackpotId } from "../../../../../../redux/reselect/jackpot-selector";
import { getEvents } from "../../../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../../../common/hooks/useCouponData";
import CentralColumnHeading from "../CentralColumnHeading";
import JackpotCard from "../JackpotCard";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const sortEvents = (a, b) => a.pos - b.pos;

const CentralColumn = ({ activeJackpotId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const jackpot = useSelector((state) => (activeJackpotId ? getJackpotByJackpotId(state, activeJackpotId) : {}));

  const [jackpots, isLoading] = useGetJackpots(dispatch);

  const currentCurrencyCode = useSelector(getAuthCurrencyCode);
  const codes = activeJackpotId ? `j${activeJackpotId}` : undefined;
  const pathCouponData = useSelector((state) => state.coupon.couponData[codes]);

  useCouponData(dispatch, codes, "GAME", true, null, false, false, true, false, null);

  const matches = useMemo(() => {
    if (isEmpty(pathCouponData)) {
      return [];
    }

    return getEvents(Object.values(pathCouponData)).sort(sortEvents);
  }, [pathCouponData]);

  if (!jackpot && isLoading) {
    return <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />;
  }

  let reserveNumber = 0;

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["central-section__content"]}>
        <CentralColumnHeading description={jackpot.description} />
        <div className={classes["jackpot-cards"]}>
          {matches
            .map((match) => {
              const markets = match?.children ? Object.values(match.children) : [];

              if (markets.length > 0) {
                const market = markets[0];
                if (market.reserve) reserveNumber += 1;

                return {
                  coefficients: Object.values(market.children).map((outcome) => ({
                    desc: outcome.desc,
                    eventId: match.id,
                    outcomeId: outcome.id,
                    price: outcome.price,
                  })),
                  eventId: match.id,
                  label: match.desc,
                  marketPeriod: `${market.desc} - ${market.period}`,
                  reserveNumber: market.reserve ? reserveNumber : undefined,
                  time: dayjs.unix(match.epoch / 1000).format("MMMM D, hh:mm A"),
                };
              }

              return null;
            })
            .map((match, index) => (
              <JackpotCard
                coefficients={match.coefficients}
                eventId={match.eventId}
                feedCode={match.feedCode}
                jackpotId={activeJackpotId}
                key={index}
                label={match.label}
                marketPeriod={match.marketPeriod}
                reserveNumber={match.reserveNumber}
                time={match.time}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  activeJackpotId: PropTypes.number,
};

const defaultProps = {
  activeJackpotId: undefined,
};

CentralColumn.propTypes = propTypes;
CentralColumn.defaultProps = defaultProps;

export default CentralColumn;

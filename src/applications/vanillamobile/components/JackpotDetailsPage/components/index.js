import isEmpty from "lodash.isempty";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { getCmsConfigSportsBook } from "../../../../../redux/reselect/cms-selector";
import { getJackpotItemCurrency } from "../../JackpotsPage/utils";
import classes from "../styles/index.module.scss";

import JackpotMatch from "./JackpotMatch";
import { useCouponData } from "applications/common/hooks/useCouponData";
import SmsButton from "applications/vanillamobile/common/components/SmsButton";
import { useGetJackpots } from "hooks/jackpots-hooks";
import { getAuthCurrencyCode } from "redux/reselect/auth-selector";
import { getJackpotByJackpotId } from "redux/reselect/jackpot-selector";
import { getEvents } from "utils/prematch-data-utils";
import { getHrefJackpots } from "utils/route-href";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {};
const defaultProps = {};

const sortEvents = (a, b) => a.pos - b.pos;

const JackpotDetailsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { jackpotId } = useParams();
  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  const jackpot = useSelector((state) => getJackpotByJackpotId(state, jackpotId));

  const [, isLoading] = useGetJackpots(dispatch);

  const currentCurrencyCode = useSelector(getAuthCurrencyCode);
  const codes = `j${jackpotId}`;
  const pathCouponData = useSelector((state) => state.coupon.couponData[codes]);

  useCouponData(dispatch, codes, "GAME", true, null, false, false, true, false, null);

  const matches = useMemo(() => {
    if (isEmpty(pathCouponData)) {
      return [];
    }

    return getEvents(Object.values(pathCouponData)).sort(sortEvents);
  }, [pathCouponData]);

  if (!jackpot && isLoading) {
    return (
      <div className={classes["spinner-container"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );
  }

  if (!jackpot) {
    return (
      <div className={classes["jackpot-details-empty-container"]}>
        <div className={classes["jackpot-details-empty-text"]}>
          {t("vanillamobile.pages.jackpot_details.jackpot_details_empty")}
        </div>
      </div>
    );
  }

  const prize = jackpot && getJackpotItemCurrency(jackpot.currencyStakeMap, currentCurrencyCode).prize;

  return (
    <div className={classes["jackpot-inner"]}>
      <div className={classes["jackpot-inner__title"]}>
        <Link className={classes["jackpot-inner__back"]} to={getHrefJackpots()}>
          <span />
          <span>{t("back")}</span>
        </Link>
        <div className={classes["jackpot-inner__label"]}>
          {t("vanillamobile.pages.jackpot_details.jackpot_details_title")}
        </div>
      </div>
      {prize && (
        <div className={classes["jackpot-inner__banner"]}>{`${prize.toLocaleString()} ${currentCurrencyCode}`}</div>
      )}
      <div className={`${classes["main__container"]} ${classes["main__container_small"]}`}>
        <div className={classes["jackpot-inner__match"]}>
          <div className={classes["jackpot-inner__info"]}>
            <span className={classes["jackpot-inner__date"]}>{jackpot.description}</span>
            <span className={classes["jackpot-inner__id"]}>
              {t("vanillamobile.pages.jackpot_details.jackpot_details_jackpot_id", { jackpotId })}
            </span>
          </div>
          {isSmsInfoEnabled && <SmsButton />}
        </div>
        {matches.map((match) => (
          <JackpotMatch jackpotId={jackpotId} key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
};

JackpotDetailsPage.propTypes = propTypes;
JackpotDetailsPage.defaultProps = defaultProps;

export default JackpotDetailsPage;

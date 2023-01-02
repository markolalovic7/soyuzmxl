import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getHrefJackpot } from "utils/route-href";

const propTypes = {
  currencyCode: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgBgUrl: PropTypes.string.isRequired,
  jackpotId: PropTypes.number.isRequired,
  prize: PropTypes.string,
  stake: PropTypes.number,
};
const defaultProps = {
  prize: undefined,
  stake: undefined,
};

const JackpotItem = ({ currencyCode, description, imgBgUrl, jackpotId, prize, stake }) => {
  const { t } = useTranslation();

  return (
    <Link
      className={classes["jackpot__item"]}
      style={{ background: `url(${imgBgUrl}) center/cover no-repeat #212121` }}
      to={getHrefJackpot(jackpotId)}
    >
      <div className={classes["jackpot__row"]}>
        <div className={classes["jackpot__sport"]}>
          <span className={classes["jackpot__match"]}>{description}</span>
          <span className={classes["jackpot__id"]}>{`ID: ${jackpotId}`}</span>
        </div>
        {prize && stake && (
          <div className={classes["jackpot__numbers"]}>
            <span className={classes["jackpot__prize"]}>{t("vanillamobile.pages.jackpots.jackpot_prize_title")}</span>
            <span className={classes["jackpot__usd"]}>{`${currencyCode} ${prize}`}</span>
            <div className={classes["jackpot__stake"]}>
              {t("vanillamobile.pages.jackpots.jackpot_stake", { stake })}
            </div>
            <div />
          </div>
        )}
      </div>
    </Link>
  );
};

JackpotItem.propTypes = propTypes;
JackpotItem.defaultProps = defaultProps;

export default JackpotItem;

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getJackpotItemCurrency } from "../utils";
import { getJackpotImgBgUrl } from "../utils/images";

import JackpotItem from "./JackpotItem";
import SectionNoData from "applications/vanillamobile/common/components/SectionNoData";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { useGetJackpots } from "hooks/jackpots-hooks";
import { getAuthCurrencyCode, getAuthLanguage } from "redux/reselect/auth-selector";
import { formatCurrency } from "utils/ui-labels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {};
const defaultProps = {};

const JackpotsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const currentCurrencyCode = useSelector(getAuthCurrencyCode);
  const currentLanguage = useSelector(getAuthLanguage);

  const [jackpots, isLoading] = useGetJackpots(dispatch);

  const renderBody = () => {
    if (isLoading && jackpots.length === 0) {
      return (
        <div className={classes["spinner-container"]}>
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        </div>
      );
    }
    const jackpotsFiltered = jackpots.filter(
      (jackpot) => !!getJackpotItemCurrency(jackpot.currencyStakeMap, currentCurrencyCode),
    );
    if (jackpotsFiltered.length === 0) {
      return <SectionNoData title={t("vanillamobile.pages.jackpots.jackpot_empty")} />;
    }

    return jackpotsFiltered.map((jackpot) => {
      const { prize, stake } = getJackpotItemCurrency(jackpot.currencyStakeMap, currentCurrencyCode);

      return (
        <JackpotItem
          currencyCode={currentCurrencyCode}
          description={jackpot.description}
          imgBgUrl={getJackpotImgBgUrl(jackpot.sportCodes[0])}
          jackpotId={jackpot.id}
          key={jackpot.id}
          prize={formatCurrency(prize, currentCurrencyCode, currentLanguage)}
          stake={stake}
        />
      );
    });
  };

  return (
    <div className={classes["jackpot"]}>
      <div className={`${classes["main__container"]} ${classes["main__container_small"]}`}>{renderBody()}</div>
    </div>
  );
};

JackpotsPage.propTypes = propTypes;
JackpotsPage.defaultProps = defaultProps;

export default JackpotsPage;

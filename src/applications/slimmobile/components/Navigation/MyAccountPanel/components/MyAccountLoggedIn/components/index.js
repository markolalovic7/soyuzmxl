import { faQuestionCircle, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "applications/common/components/Spinner";
import ItemLink from "applications/slimmobile/common/components/ItemLink";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "redux/actions/auth-actions";
import { getCmsConfigBrandDetails, getCmsConfigIframeMode } from "redux/reselect/cms-selector";
import {
  getHrefAccountEdit,
  getHrefAccountPasswordEdit,
  getHrefHome,
  getHrefMyBets,
  getHrefMyStatements,
} from "utils/route-href";

import { getAuthAccountId, getAuthLoggedIn } from "../../../../../../../../redux/reselect/auth-selector";
import { getBalance } from "../../../../../../../../redux/reselect/balance-selector";
import { loadBalance, loadSingleWalletBalance } from "../../../../../../../../redux/slices/balanceSlice";

const propTypes = {
  handleClose: PropTypes.func.isRequired,
};

const MyAccountLoggedIn = ({ handleClose }) => {
  const { t } = useTranslation();
  const username = useSelector((state) => state.auth?.username);
  const currencyCode = useSelector((state) => state.auth?.currencyCode);
  const balance = useSelector(getBalance);
  const balanceIsLoading = useSelector((state) => state.balance?.loading);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);
  const accountId = useSelector(getAuthAccountId);
  const isLoggedIn = useSelector(getAuthLoggedIn);

  const dispatch = useDispatch();

  const onLogoutHandler = () => {
    dispatch(logout());
  };

  const refreshBetslip = () => {
    if (accountId && cmsConfigBrandDetails && isLoggedIn) {
      if (cmsConfigBrandDetails.data.singleWalletMode) {
        dispatch(loadSingleWalletBalance({ accountId }));
      } else {
        dispatch(loadBalance({ accountId }));
      }
    }
  };

  return (
    <>
      <div className={classes["login__title"]}>
        <span>{t("hi_username_greeting", { username })}</span>
        <span className={classes["login__icon"]} id="login-close-2" onClick={handleClose}>
          <i className={classes["qicon-account-logged-in"]} />
        </span>
      </div>
      <div className={classes["login__top"]}>
        <div className={classes["login__balance"]}>
          {!balance && balanceIsLoading && (
            <div className={classes["login__balance-loader"]}>
              <Spinner className={`${classes.loader} ${classes["loader-xs"]} `} />
            </div>
          )}
          {balance && (
            <>
              <div className={classes["login__balance-text"]}>
                <span className={classes["login__balance-your"]}>{t("your_balance")}</span>
                <span className={classes["login__balance-money"]}>
                  {`${getSymbolFromCurrency(currencyCode)} ${balance.availableBalance.toLocaleString()}`}
                </span>
              </div>
              <span className={classes["login__balance-icon"]} onClick={refreshBetslip}>
                {!balanceIsLoading && <i className={classes["qicon-refresh"]} />}
                {balanceIsLoading && <FontAwesomeIcon className="fa-spin" icon={faSync} size="lg" />}
              </span>
            </>
          )}
        </div>
        <div className={classes["login__menu"]}>
          <ul className={classes["login__list"]}>
            <li>
              <ItemLink href={getHrefMyBets()} icon="qicon-money" label={t("my_bets")} />
            </li>

            {!isApplicationEmbedded && (
              <>
                <li>
                  <ItemLink href={getHrefMyStatements()} icon="qicon-user" label={t("my_statements")} />
                </li>
                <li>
                  <ItemLink href={getHrefAccountEdit()} icon="qicon-edit-profile" label={t("edit_profile")} />
                </li>
                <li>
                  <ItemLink
                    href={getHrefAccountPasswordEdit()}
                    icon="qicon-shield-guard"
                    label={t("change_password")}
                  />
                </li>
                <li>
                  {/* TODO: Finish Deposit page */}
                  <ItemLink href={getHrefHome()} icon="qicon-deposit" label={t("deposit")} />
                </li>
                <li>
                  {/* TODO: Finish How to Deposit page */}
                  <ItemLink
                    href={getHrefHome()}
                    label={t("how_to_deposit")}
                    renderIcon={() => <FontAwesomeIcon icon={faQuestionCircle} />}
                  />
                </li>
                <li>
                  {/* TODO: Finish How to Withdraw page */}
                  <ItemLink href={getHrefHome()} icon="qicon-withdraw" label={t("withdraw")} onClick={() => {}} />
                </li>
                <li>
                  <ItemLink
                    href={getHrefHome()}
                    label={t("how_to_withdraw")}
                    renderIcon={() => <FontAwesomeIcon icon={faQuestionCircle} />}
                    onClick={() => {}}
                  />
                </li>
                <li>
                  <ItemLink href={getHrefHome()} icon="qicon-sign-out" label={t("logout")} onClick={onLogoutHandler} />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

MyAccountLoggedIn.propTypes = propTypes;

export default MyAccountLoggedIn;

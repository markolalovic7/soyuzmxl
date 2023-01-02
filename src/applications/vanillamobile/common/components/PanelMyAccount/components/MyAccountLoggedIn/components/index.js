import { faCommentDots, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import PropsTypes from "prop-types";
import React, { forwardRef, memo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useOnClickOutside } from "../../../../../../../../hooks/utils-hooks";
import { loadBalance, loadSingleWalletBalance } from "../../../../../../../../redux/slices/balanceSlice";
import { getPatternChatPage } from "../../../../../../../../utils/route-patterns";
import ItemLink from "../../../../ItemLink";
import MyAccountSettings from "../../MyAccountSettings";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { logout } from "redux/actions/auth-actions";
import { getAuthAccountId, getAuthCurrencyCode, getAuthLoggedIn, getAuthUsername } from "redux/reselect/auth-selector";
import { getBalance } from "redux/reselect/balance-selector";
import { getCmsConfigBrandDetails, getCmsConfigIframeMode } from "redux/reselect/cms-selector";
import {
  getHrefAccountEdit,
  getHrefAccountPasswordEdit,
  getHrefHome,
  getHrefMyBets,
  getHrefMyStatements,
} from "utils/route-href";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {
  onCloseMyAccount: PropsTypes.func.isRequired,
  showMyAccount: PropsTypes.bool,
};

const defaultProps = {
  showMyAccount: false,
};

const MyAccountLoggedIn = forwardRef(({ onCloseMyAccount, showMyAccount }, ref) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);
  const username = useSelector(getAuthUsername);
  const currencyCode = useSelector(getAuthCurrencyCode);
  const balance = useSelector(getBalance);
  const balanceIsLoading = useSelector((state) => state.balance?.loading);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);
  const accountId = useSelector(getAuthAccountId);
  const isLoggedIn = useSelector(getAuthLoggedIn);

  const {
    data: { chat },
  } = cmsConfigBrandDetails || { data: {} };

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

  const [isBalancedOpened, setIsBalanceOpened] = useState(false);
  const balanceRef = useRef();
  useOnClickOutside(balanceRef, () => setIsBalanceOpened(false));

  return (
    <aside className={`${classes["login"]} ${showMyAccount ? classes["active"] : ""}`} id="login-2">
      <div
        className={`${classes["login__container"]} ${showMyAccount ? classes["active"] : ""}`}
        id="login__container-2"
        ref={ref}
      >
        <div className={classes["login__title"]}>
          <span>{t("hi_username_greeting", { username })}</span>
          <span className={classes["login__icon"]} id="login-close-2" onClick={onCloseMyAccount}>
            <i className={classes["qicon-account-logged-in"]} />
          </span>
        </div>
        <div className={classes["login__top"]}>
          {balance && (
            <div className={classes["login__balance"]} ref={balanceRef}>
              <div className={classes["login__box"]} onClick={() => setIsBalanceOpened((prevState) => !prevState)}>
                <div className={classes["login__balance-text"]}>
                  <span className={classes["login__balance-your"]}>{t("your_balance")}</span>
                  <span className={classes["login__balance-money"]}>
                    {`${getSymbolFromCurrency(currencyCode)} ${balance.availableBalance.toLocaleString()}`}
                  </span>
                </div>
                <div className={classes["login__arrow"]} />
              </div>
              <span className={classes["login__balance-icon"]} onClick={refreshBetslip}>
                {!balanceIsLoading && <i className={classes["qicon-refresh"]} />}
                {balanceIsLoading && <FontAwesomeIcon className="fa-spin" icon={faSync} size="lg" />}
              </span>
              <ul className={cx(classes["settings__sublist"], { [classes["active"]]: isBalancedOpened })}>
                <li className={classes["settings__subli"]}>
                  <div className={classes["settings__box"]}>
                    <div className={classes["settings__promo"]}>{t("balance.cash_balance")}</div>
                    <div className={classes["settings__money"]}>
                      {!balance && balanceIsLoading ? (
                        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                      ) : (
                        `${getSymbolFromCurrency(currencyCode)} ${balance?.cashBalance?.toLocaleString()}`
                      )}
                    </div>
                  </div>
                </li>
                {balance?.promoBalance > 0 && (
                  <li className={classes["settings__subli"]}>
                    <div className={classes["settings__box"]}>
                      <div className={classes["settings__promo"]}>{t("balance.promo_balance")}</div>
                      <div className={classes["settings__money"]}>
                        {`${getSymbolFromCurrency(currencyCode)} ${balance?.promoBalance?.toLocaleString()}`}
                      </div>
                    </div>
                  </li>
                )}
                {balance?.promoSnrBalance > 0 && (
                  <li className={classes["settings__subli"]}>
                    <div className={classes["settings__box"]}>
                      <div className={classes["settings__promo"]}>{t("balance.promo_snr_balance")}</div>
                      <div className={classes["settings__money"]}>
                        {`${getSymbolFromCurrency(currencyCode)} ${balance?.promoSnrBalance?.toLocaleString()}`}
                      </div>
                    </div>
                  </li>
                )}

                {balance?.creditLimit > 0 && (
                  <li className={classes["settings__subli"]}>
                    <div className={classes["settings__box"]}>
                      <div className={classes["settings__promo"]}>{t("balance.credit")}</div>
                      <div className={classes["settings__money"]}>
                        {`${getSymbolFromCurrency(currencyCode)} ${balance?.creditLimit?.toLocaleString()}`}
                      </div>
                    </div>
                  </li>
                )}

                {balance?.tempCreditLimit > 0 && (
                  <li className={classes["settings__subli"]}>
                    <div className={classes["settings__box"]}>
                      <div className={classes["settings__promo"]}>{t("balance.temp_credit")}</div>
                      <div className={classes["settings__money"]}>
                        {`${getSymbolFromCurrency(currencyCode)} ${balance?.tempCreditLimit?.toLocaleString()}`}
                      </div>
                    </div>
                  </li>
                )}

                {balance?.agentCreditLimit > 0 && (
                  <li className={classes["settings__subli"]}>
                    <div className={classes["settings__box"]}>
                      <div className={classes["settings__promo"]}>{t("balance.agent_credit")}</div>
                      <div className={classes["settings__money"]}>
                        {`${getSymbolFromCurrency(currencyCode)} ${balance?.agentCreditLimit?.toLocaleString()}`}
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
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
                    {/* Todo: Finish here. */}
                    <ItemLink href={getHrefHome()} icon="qicon-deposit" label={t("deposit")} />
                  </li>
                  <li>
                    {/* Todo: Finish here. */}
                    <ItemLink href={getHrefHome()} icon="qicon-withdraw" label={t("withdraw")} />
                  </li>
                </>
              )}
              {chat && (
                <li>
                  <Link className={classes["login__item"]} to={getPatternChatPage()}>
                    <span className={classes["login__item-icon"]}>
                      <FontAwesomeIcon icon={faCommentDots} />
                    </span>
                    <span className={classes["login__item-text"]}>{t("chat.chat")}</span>
                  </Link>
                </li>
              )}
              {!isApplicationEmbedded && (
                <li>
                  <ItemLink href={getHrefHome()} icon="qicon-sign-out" label={t("logout")} onClick={onLogoutHandler} />
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className={classes["login__wrapper"]}>
          <MyAccountSettings />
        </div>
      </div>
    </aside>
  );
});

MyAccountLoggedIn.propTypes = propTypes;
MyAccountLoggedIn.defaultProps = defaultProps;

export default memo(MyAccountLoggedIn);

import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ThemeSwitcher from "react-css-vars-soyuz";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { useOnClickOutside } from "../../../../../hooks/utils-hooks";
import { getBalance } from "../../../../../redux/reselect/balance-selector";
import {
  getPatternAccountEdit,
  getPatternAccountSecurityEdit,
  getPatternMyBets,
  getPatternMyStatements,
} from "../../../../../utils/route-patterns";
import LoginPopup from "../../LoginPopup";

import {
  getAccountOptions,
  getIFrameAccountOptions,
  LANGUAGE_OPTIONS,
  PRICE_FORMAT_OPTIONS,
  THEMES_OPTIONS,
} from "./constants";
import HeaderDropdownMenu from "./HeaderDropdownMenu";
import HeaderLinks from "./HeaderLinks";

import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import themes from "applications/vanilladesktop/themes";
import { logout, setAuthDesktopTheme, setAuthDesktopView } from "redux/actions/auth-actions";
import { getCachedAssets } from "redux/reselect/assets-selectors";
import { getAuthAccountId, getAuthDesktopView, getAuthLoggedIn, getAuthSelector } from "redux/reselect/auth-selector";
import {
  getCmsConfigAppearance,
  getCmsConfigBetting,
  getCmsConfigBrandDetails,
  getCmsConfigBrandLogos,
  getCmsConfigIframeMode,
} from "redux/reselect/cms-selector";
import { setAuthLanguage, setAuthPriceFormat } from "redux/slices/authSlice";
import { loadBalance, loadSingleWalletBalance } from "redux/slices/balanceSlice";
import { isNotEmpty } from "utils/lodash";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const Header = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const cmsConfigBetting = useSelector(getCmsConfigBetting);
  const cmsConfigAppearance = useSelector(getCmsConfigAppearance);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const view = useSelector(getAuthDesktopView);

  const accountId = useSelector(getAuthAccountId);
  const isLoggedIn = useSelector(getAuthLoggedIn);

  const currencyCode = useSelector((state) => state.auth?.currencyCode);
  const balance = useSelector(getBalance);
  const balanceIsLoading = useSelector((state) => state.balance?.loading);
  const { brandLogoAssetId } = useSelector(getCmsConfigBrandLogos);
  const assets = useSelector(getCachedAssets);

  const iframeMode = useSelector(getCmsConfigIframeMode);

  const [isLoginPopupOpened, setIsLoginPopupOpened] = useState(false);

  const { pathname } = location;

  const {
    data: { priceFormats },
  } = cmsConfigBetting || { data: {} };

  const {
    data: { desktopEnabledThemes, desktopViews },
  } = cmsConfigAppearance || { data: {} };

  const desktopViewList = isNotEmpty(desktopViews)
    ? Object.values(desktopViews).map(({ desktopView }) => ({
        label: t(`desktop_views.${desktopView}`),
        value: desktopView,
      }))
    : [];

  const vanillaThemes = useMemo(() => {
    const enabledThemeList =
      isNotEmpty(desktopEnabledThemes) && isNotEmpty(desktopEnabledThemes[view])
        ? desktopEnabledThemes[view]
        : THEMES_OPTIONS; // if no config, we allow all

    return THEMES_OPTIONS.filter((theme) => enabledThemeList.includes(theme)).map((theme) => ({
      label: t(`mobile_themes.${theme}`),
      value: theme,
    }));
  }, [t, desktopEnabledThemes, view]);

  const {
    data: { languages },
  } = cmsConfigBrandDetails || { data: {} };

  const {
    desktopTheme,
    desktopView: authDesktopView,
    language: authLanguage,
    priceFormat: authPriceFormat,
  } = useSelector(getAuthSelector);

  useEffect(() => {
    setIsLoginPopupOpened(false);
  }, [pathname]);

  const closeLoginPopup = () => setIsLoginPopupOpened(false);

  const onLanguageChange = useCallback(
    (language) => {
      if (authLanguage !== language) {
        dispatch(
          setAuthLanguage({
            language,
          }),
        );
      }
    },
    [authLanguage, dispatch],
  );

  const onPriceFormatChange = useCallback(
    (priceFormat) => {
      if (authPriceFormat !== priceFormat) {
        dispatch(
          setAuthPriceFormat({
            priceFormat,
          }),
        );
      }
    },
    [authPriceFormat, dispatch],
  );

  const onDesktopViewChange = useCallback(
    (desktopView) => {
      if (authDesktopView !== desktopView) {
        dispatch(
          setAuthDesktopView({
            desktopView,
          }),
        );
      }
    },
    [authDesktopView, dispatch],
  );

  const onAccountOptionSelectHandler = useCallback(
    (action) => {
      if (action === "logout") {
        dispatch(logout());
      }
      if (action === "my_bets") {
        history.push(getPatternMyBets());
      }
      if (action === "my_statements") {
        history.push(getPatternMyStatements());
      }
      if (action === "password_and_security") {
        history.push(getPatternAccountSecurityEdit());
      }
      if (action === "profile") {
        history.push(getPatternAccountEdit());
      }
    },
    [dispatch],
  );

  const onThemeChange = useCallback(
    (desktopTheme) => {
      dispatch(setAuthDesktopTheme({ desktopTheme }));
    },
    [dispatch],
  );

  const refreshBalance = () => {
    if (accountId && cmsConfigBrandDetails && isLoggedIn) {
      if (cmsConfigBrandDetails.data.singleWalletMode) {
        dispatch(loadSingleWalletBalance({ accountId }));
      } else {
        dispatch(loadBalance({ accountId }));
      }
    }
  };

  useEffect(() => {
    if (!vanillaThemes.some((theme) => theme.value === desktopTheme)) {
      dispatch(
        setAuthDesktopTheme({
          desktopTheme: vanillaThemes[0].value,
        }),
      );
    }
  }, [dispatch, desktopTheme, vanillaThemes]);

  const [isBalancedOpened, setIsBalanceOpened] = useState(false);
  const balanceRef = useRef();
  useOnClickOutside(balanceRef, () => setIsBalanceOpened(false));

  return (
    <header className={classes["header"]}>
      <ThemeSwitcher theme={themes[desktopTheme]} />
      <div className={classes["header__container"]}>
        <Link className={classes["header__logo"]} to="/">
          {!iframeMode && assets[brandLogoAssetId] && <img alt="logo" src={assets[brandLogoAssetId]} />}
        </Link>
        <nav className={classes["header__menu"]}>
          <HeaderLinks />
        </nav>
        <div className={classes["header__dropdowns"]}>
          {!process.env.REACT_APP_12BET_SETTING_MODE_ON && languages.length > 1 && (
            <HeaderDropdownMenu
              options={LANGUAGE_OPTIONS.filter((l) => languages?.includes(l.value))}
              value={authLanguage}
              onChange={onLanguageChange}
            />
          )}
          {vanillaThemes.length > 1 && (
            <HeaderDropdownMenu
              options={vanillaThemes}
              renderDropdownIcon={() => <i className={classes["qicon-paint-board"]} />}
              value={desktopTheme}
              onChange={onThemeChange}
            />
          )}
          {priceFormats.length > 1 && (
            <HeaderDropdownMenu
              options={PRICE_FORMAT_OPTIONS.filter((l) => priceFormats?.includes(l.value)).map((priceFormat) => ({
                label: t(`price_formats.${priceFormat.value}`),
                value: priceFormat.value,
              }))}
              renderDropdownIcon={() => <i className={classes["qicon-price-format"]} />}
              value={authPriceFormat}
              onChange={onPriceFormatChange}
            />
          )}
          {desktopViewList.length > 1 && (
            <HeaderDropdownMenu
              options={desktopViewList}
              renderDropdownIcon={() => <i className={classes["qicon-visibility"]} />}
              value={authDesktopView}
              onChange={onDesktopViewChange}
            />
          )}
        </div>
        {!isLoggedIn && !isApplicationEmbedded && (
          <div className={`${classes["header__buttons"]} ${classes["active"]}`}>
            <button
              className={`${classes["header__button"]} ${classes["popup-link"]}`}
              type="button"
              onClick={() => setIsLoginPopupOpened(true)}
            >
              {t("login")}
            </button>
            <Link className={classes["header__button"]} to="/createaccount" type="button">
              {t("create_account")}
            </Link>
          </div>
        )}
        {isLoggedIn && (
          <>
            <HeaderDropdownMenu
              options={isApplicationEmbedded ? getIFrameAccountOptions(t) : getAccountOptions(t)}
              renderDropdownIcon={() => (
                <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <g>
                      <path d="M8 10c4.42 0 8 1.79 8 4v2H0v-2c0-2.21 3.58-4 8-4zm4-6a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                    </g>
                  </g>
                </svg>
              )}
              onChange={onAccountOptionSelectHandler}
            />
            <div className={classes["header__cash"]} ref={balanceRef}>
              <div
                className={cx(classes["header__cash-text"], classes["dropdown"], {
                  [classes["active"]]: isBalancedOpened,
                })}
                onClick={() => setIsBalanceOpened((prevState) => !prevState)}
              >
                <span className={classes["header__cash-text-title"]}>
                  {!balance && balanceIsLoading ? (
                    <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                  ) : (
                    `${getSymbolFromCurrency(currencyCode)} ${balance?.availableBalance?.toLocaleString()}`
                  )}
                </span>
                <div className={classes["header__cash-text-arrow"]} />
              </div>
              <div
                className={cx(
                  classes["header__dropdown-content"],
                  { [classes["iframe"]]: iframeMode },
                  classes["dropdown"],
                  {
                    [classes["open"]]: isBalancedOpened,
                  },
                )}
              >
                <ul>
                  <li className={classes["header__dropdown-theme"]}>
                    <div className={classes["header__dropdown-box"]}>
                      <div className={classes["header__dropdown-promo"]}>{t("balance.cash_balance")}</div>
                      <div className={classes["header__dropdown-money"]}>
                        {!balance && balanceIsLoading ? (
                          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                        ) : (
                          `${getSymbolFromCurrency(currencyCode)} ${balance?.cashBalance?.toLocaleString()}`
                        )}
                      </div>
                    </div>
                  </li>
                  {balance?.promoBalance > 0 && (
                    <li className={classes["header__dropdown-theme"]}>
                      <div className={classes["header__dropdown-box"]}>
                        <div className={classes["header__dropdown-promo"]}>{t("balance.promo_balance")}</div>
                        <div className={classes["header__dropdown-money"]}>
                          {`${getSymbolFromCurrency(currencyCode)} ${balance?.promoBalance?.toLocaleString()}`}
                        </div>
                      </div>
                    </li>
                  )}
                  {balance?.promoSnrBalance > 0 && (
                    <li className={classes["header__dropdown-theme"]}>
                      <div className={classes["header__dropdown-box"]}>
                        <div className={classes["header__dropdown-promo"]}>{t("balance.promo_snr_balance")}</div>
                        <div className={classes["header__dropdown-money"]}>
                          {`${getSymbolFromCurrency(currencyCode)} ${balance?.promoSnrBalance?.toLocaleString()}`}
                        </div>
                      </div>
                    </li>
                  )}
                  {balance?.creditLimit > 0 && (
                    <li className={classes["header__dropdown-theme"]}>
                      <div className={classes["header__dropdown-box"]}>
                        <div className={classes["header__dropdown-promo"]}>{t("balance.credit")}</div>
                        <div className={classes["header__dropdown-money"]}>
                          {`${getSymbolFromCurrency(currencyCode)} ${balance?.creditLimit?.toLocaleString()}`}
                        </div>
                      </div>
                    </li>
                  )}
                  {balance?.tempCreditLimit > 0 && (
                    <li className={classes["header__dropdown-theme"]}>
                      <div className={classes["header__dropdown-box"]}>
                        <div className={classes["header__dropdown-promo"]}>{t("balance.temp_credit")}</div>
                        <div className={classes["header__dropdown-money"]}>
                          {`${getSymbolFromCurrency(currencyCode)} ${balance?.tempCreditLimit?.toLocaleString()}`}
                        </div>
                      </div>
                    </li>
                  )}
                  {balance?.agentCreditLimit > 0 && (
                    <li className={classes["header__dropdown-theme"]}>
                      <div className={classes["header__dropdown-box"]}>
                        <div className={classes["header__dropdown-promo"]}>{t("balance.agent_credit")}</div>
                        <div className={classes["header__dropdown-money"]}>
                          {`${getSymbolFromCurrency(currencyCode)} ${balance?.agentCreditLimit?.toLocaleString()}`}
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className={classes["header__cash-icon"]} onClick={refreshBalance}>
              {balanceIsLoading ? (
                <FontAwesomeIcon className="fa-spin" icon={faCircleNotch} />
              ) : (
                <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <g>
                      <path
                        d="M13.65 2.35A7.958 7.958 0 0 0 8 0a8 8 0 1 0 0 16c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0z"
                        fillOpacity=".87"
                      />
                    </g>
                  </g>
                </svg>
              )}
            </div>
          </>
        )}
      </div>
      {isLoginPopupOpened && <LoginPopup isOpened={!isLoggedIn && isLoginPopupOpened} onClose={closeLoginPopup} />}
    </header>
  );
};

export default React.memo(Header);

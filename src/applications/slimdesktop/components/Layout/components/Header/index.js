import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ThemeSwitcher from "react-css-vars-soyuz";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { logout, setAuthDesktopTheme, setAuthDesktopView } from "../../../../../../redux/actions/auth-actions";
import { getCachedAssets } from "../../../../../../redux/reselect/assets-selectors";
import {
  getAuthAccountId,
  getAuthDesktopView,
  getAuthLoading,
  getAuthLoggedIn,
  getAuthSelector,
  getAuthUsername,
} from "../../../../../../redux/reselect/auth-selector";
import { getBalance } from "../../../../../../redux/reselect/balance-selector";
import {
  getCmsConfigAppearance,
  getCmsConfigBetting,
  getCmsConfigBrandDetails,
  getCmsConfigBrandLogos,
  getCmsConfigIframeMode,
} from "../../../../../../redux/reselect/cms-selector";
import { login, setAuthLanguage, setAuthPriceFormat } from "../../../../../../redux/slices/authSlice";
import { loadBalance, loadSingleWalletBalance } from "../../../../../../redux/slices/balanceSlice";
import { isNotEmpty } from "../../../../../../utils/lodash";
import {
  getPatternAccountCreate,
  getPatternAccountEdit,
  getPatternAccountSecurityEdit,
  getPatternMyBets,
  getPatternMyStatements,
} from "../../../../../../utils/route-patterns";
import {
  getAccountOptions,
  getIFrameAccountOptions,
  LANGUAGE_OPTIONS,
  PRICE_FORMAT_OPTIONS,
} from "../../../../../vanilladesktop/components/Header/components/constants";
import classes from "../../../../scss/slimdesktop.module.scss";
import { UsernameContext } from "../../../../SlimDesktopApp";
import themes from "../../../../themes";
import { THEMES_OPTIONS } from "../../constants";

import HeaderDropdownMenu from "./components/HeaderDropdownMenu";

const Header = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const usernameInput = React.useContext(UsernameContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const cmsConfigBetting = useSelector(getCmsConfigBetting);
  const cmsConfigAppearance = useSelector(getCmsConfigAppearance);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);
  const view = useSelector(getAuthDesktopView);
  const authUsername = useSelector(getAuthUsername);

  const accountId = useSelector(getAuthAccountId);
  const isLoggedIn = useSelector(getAuthLoggedIn);
  const isAuthLoading = useSelector(getAuthLoading);

  const currencyCode = useSelector((state) => state.auth?.currencyCode);
  const balance = useSelector(getBalance);
  const balanceIsLoading = useSelector((state) => state.balance?.loading);
  const { brandLogoAssetId } = useSelector(getCmsConfigBrandLogos);
  const assets = useSelector(getCachedAssets);

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

  const slimThemes = useMemo(() => {
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

  const onThemeChange = useCallback(
    (desktopTheme) => {
      dispatch(setAuthDesktopTheme({ desktopTheme }));
    },
    [dispatch],
  );

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

  useEffect(() => {
    if (!slimThemes.some((theme) => theme.value === desktopTheme)) {
      dispatch(
        setAuthDesktopTheme({
          desktopTheme: slimThemes[0].value,
        }),
      );
    }
  }, [dispatch, desktopTheme, slimThemes]);

  useEffect(() => {
    if (isLoggedIn && (username?.length > 0 || password?.length > 0)) {
      setUsername("");
      setPassword("");
    }
  }, [isLoggedIn, username, password]);

  const refreshBetslip = () => {
    if (accountId && cmsConfigBrandDetails && isLoggedIn) {
      if (cmsConfigBrandDetails.data.singleWalletMode) {
        dispatch(loadSingleWalletBalance({ accountId }));
      } else {
        dispatch(loadBalance({ accountId }));
      }
    }
  };

  const onLoginHandler = () => {
    dispatch(
      login({
        password,
        rememberMe: false,
        username,
      }),
    );
  };

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

  return (
    <header className={classes["header"]}>
      <ThemeSwitcher theme={themes[desktopTheme]} />
      {!isApplicationEmbedded && (
        <Link className={classes["header__logo"]} to="/">
          {assets[brandLogoAssetId] && <img alt="logo" src={assets[brandLogoAssetId]} />}
        </Link>
      )}
      <div className={cx(classes["header__controls"], classes["header-controls"])}>
        {!process.env.REACT_APP_12BET_SETTING_MODE_ON && languages.length > 1 && (
          <HeaderDropdownMenu
            options={LANGUAGE_OPTIONS.filter((l) => languages?.includes(l.value))}
            value={authLanguage}
            onChange={onLanguageChange}
          />
        )}

        {slimThemes.length > 1 && (
          <HeaderDropdownMenu
            options={slimThemes}
            renderDropdownIcon={() => <i className={classes["qicon-brush"]} />}
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
            renderDropdownIcon={() => <i className={classes["qicon-remove_red_eye"]} />}
            value={authDesktopView}
            onChange={onDesktopViewChange}
          />
        )}
      </div>
      {!isLoggedIn && !isApplicationEmbedded && (
        <form action="" className={cx(classes["header__form"], classes["header-form"])} method="get">
          <input
            required
            className={cx(classes["header-form__inp"], classes["header-form__item"])}
            id="userName"
            name="userName"
            placeholder={t("forms.username")}
            ref={usernameInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            required
            className={cx(classes["header-form__inp"], classes["header-form__item"])}
            id="userPassword"
            name="userPassword"
            placeholder={t("forms.password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className={cx(classes["header-form__btn"], classes["header-form__btn-login"], classes["header-form__item"])}
            disabled={username.length === 0 || password.length === 0}
            type="button"
            onClick={onLoginHandler}
          >
            {isAuthLoading ? (
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
            ) : (
              t("login")
            )}
          </button>
          <Link
            className={cx(
              classes["header-form__btn"],
              classes["header-form__btn-register"],
              classes["header-form__item"],
            )}
            to={getPatternAccountCreate()}
          >
            {t("create_account")}
          </Link>
        </form>
      )}
      {isLoggedIn && (
        <div className={cx(classes["header__hidden"], classes["active"])}>
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
          <div className={classes["header__cash"]}>
            <div className={classes["header__cash-text"]}>
              {" "}
              {!balance && balanceIsLoading ? (
                <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
              ) : (
                `${getSymbolFromCurrency(currencyCode)} ${balance?.availableBalance?.toLocaleString()}`
              )}
            </div>
            <div className={classes["header__cash-icon"]} onClick={refreshBetslip}>
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default React.memo(Header);

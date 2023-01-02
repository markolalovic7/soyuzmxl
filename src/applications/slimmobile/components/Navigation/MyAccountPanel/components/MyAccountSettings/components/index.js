import ItemDropdown from "applications/slimmobile/common/components/ItemDropdown";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import themes from "applications/slimmobile/themes";
import { LANGUAGES } from "constants/languages";
import { useCallback, useEffect, useMemo } from "react";
import ThemeSwitcher from "react-css-vars-soyuz";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setAuthMobileTheme, setAuthMobileView } from "redux/actions/auth-actions";
import { getAuthMobileView, getAuthSelector } from "redux/reselect/auth-selector";
import { getCmsConfigAppearance, getCmsConfigBetting, getCmsConfigBrandDetails } from "redux/reselect/cms-selector";
import { setAuthLanguage, setAuthPriceFormat } from "redux/slices/authSlice";
import { isNotEmpty } from "utils/lodash";

// must be received from cms
export const slimThemes = [
  "LUCKY_RED_THEME",
  "DARK_NIGHT_THEME",
  "INDIGO_HORIZON_THEME",
  "KOREAN_THEME",
  "LIGHT_AIRY_THEME",
  "LIME_CHARCOAL_THEME",
  "MOSS_ROCK_THEME",
  "ORANGE_LAGOON_THEME",
  "YELLOW_GREEN_THEME",
  "COFFEE_BLONDE_THEME",
  "ONETWO_DARK_THEME",
  "ONETWO_LUCKYRED_THEME",
];

const MyAccountSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const view = useSelector(getAuthMobileView);
  const cmsConfigBetting = useSelector(getCmsConfigBetting);
  const cmsConfigAppearance = useSelector(getCmsConfigAppearance);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const {
    data: { priceFormats },
  } = cmsConfigBetting || { data: {} };

  const {
    data: { mobileEnabledThemes, mobileViews },
  } = cmsConfigAppearance || { data: {} };

  const {
    data: { languages },
  } = cmsConfigBrandDetails || { data: {} };

  const {
    language: authLanguage,
    mobileTheme: authMobileTheme,
    mobileView: authMobileView,
    priceFormat: authPriceFormat,
  } = useSelector(getAuthSelector);

  const availableThemes = useMemo(() => {
    const enabledThemeList =
      isNotEmpty(mobileEnabledThemes) && isNotEmpty(mobileEnabledThemes[view]) ? mobileEnabledThemes[view] : slimThemes; // if no config, we allow all

    return slimThemes.filter((slimTheme) => enabledThemeList.includes(slimTheme));
  }, [t, mobileEnabledThemes, view]);

  useEffect(() => {
    if (!availableThemes.some((theme) => theme === authMobileTheme)) {
      dispatch(
        setAuthMobileTheme({
          mobileTheme: availableThemes[0],
        }),
      );
    }
  }, [dispatch, authMobileTheme, availableThemes]);

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

  const onMobileViewChange = useCallback(
    (mobileView) => {
      if (authMobileView !== mobileView) {
        dispatch(
          setAuthMobileView({
            mobileView,
          }),
        );
      }
    },
    [authMobileView, dispatch],
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

  const onThemeChange = useCallback(
    (mobileTheme) => {
      dispatch(
        setAuthMobileTheme({
          mobileTheme,
        }),
      );
    },
    [dispatch],
  );

  const renderIconPriceFormat = useCallback(
    () => (
      <span className={classes["settings__icon"]}>
        <i className={classes["qicon-money"]} />
      </span>
    ),
    [],
  );

  const renderIconTheme = useCallback(() => <i className={classes["qicon-paint-board"]} />, []);

  const renderIconMobileView = useCallback(
    () => (
      <span className={classes["settings__icon"]}>
        <i className={classes["qicon-mobile"]} />
      </span>
    ),
    [],
  );

  return (
    <div className={classes["login__wrapper"]}>
      <ThemeSwitcher theme={themes[authMobileTheme]} />
      <div className={classes["login__bottom"]}>
        <div className={classes["settings"]}>
          <div className={classes["settings__title"]}>{t("settings")}</div>
          <ul className={classes["settings__list"]}>
            {!process.env.REACT_APP_12BET_SETTING_MODE_ON && languages?.length > 1 && (
              <ItemDropdown
                items={LANGUAGES.filter((language) => languages?.includes(language.languageCode))}
                value={authLanguage}
                onChange={onLanguageChange}
              />
            )}
            {priceFormats?.length > 1 && (
              <ItemDropdown
                items={priceFormats.map((priceFormat) => ({
                  label: t(`price_formats.${priceFormat}`),
                  value: priceFormat,
                }))}
                renderIcon={renderIconPriceFormat}
                value={authPriceFormat}
                onChange={onPriceFormatChange}
              />
            )}
            {availableThemes?.length > 1 && (
              <ItemDropdown
                items={availableThemes.map((theme) => ({
                  label: t(`mobile_themes.${theme}`),
                  value: theme,
                }))}
                renderIcon={renderIconTheme}
                value={authMobileTheme}
                onChange={onThemeChange}
              />
            )}
            {isNotEmpty(mobileViews) && Object.values(mobileViews).length > 1 && (
              <ItemDropdown
                items={
                  isNotEmpty(mobileViews)
                    ? Object.values(mobileViews).map(({ mobileView }) => ({
                        label: t(`mobile_views.${mobileView}`),
                        value: mobileView,
                      }))
                    : []
                }
                renderIcon={renderIconMobileView}
                value={authMobileView}
                onChange={onMobileViewChange}
              />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyAccountSettings;

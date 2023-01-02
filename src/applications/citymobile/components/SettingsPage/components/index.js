import ArrowDownSVG from "applications/citymobile/img/icons/arrow-down.svg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuthLanguage,
  getAuthMobileView,
  getAuthPriceFormat,
  getAuthTimezoneOffset,
} from "redux/reselect/auth-selector";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";
import { setAuthMobileView } from "../../../../../redux/actions/auth-actions";
import { getCmsConfigAppearance } from "../../../../../redux/reselect/cms-selector";
import { setAuthLanguage, setAuthPriceFormat, setTimezoneOffset } from "../../../../../redux/slices/authSlice";
import { isNotEmpty } from "../../../../../utils/lodash";
import classes from "../../../scss/citymobile.module.scss";
import PagePath from "../../Navigation/PagePath/components";

const SettingsPage = () => {
  const { t } = useTranslation();
  const language = useSelector(getAuthLanguage);
  const currentPriceFormat = useSelector(getAuthPriceFormat);
  const currentTimezoneOffset = useSelector(getAuthTimezoneOffset);
  const currentMobileView = useSelector(getAuthMobileView);

  const cmsConfigAppearance = useSelector(getCmsConfigAppearance);

  const {
    data: { mobileViews },
  } = cmsConfigAppearance || { data: {} };

  const mobileViewList = isNotEmpty(mobileViews)
    ? Object.values(mobileViews).map(({ mobileView }) => ({
        label: t(`mobile_views.${mobileView}`),
        value: mobileView,
      }))
    : [];

  const dispatch = useDispatch();

  useGAPageView("Settings");

  const changeLanguageHandler = (event) => {
    event.stopPropagation();
    const updatedLanguage = event.target.value;
    if (updatedLanguage !== language) {
      dispatch(setAuthLanguage({ language: updatedLanguage }));
    }
  };

  const changePriceFormatHandler = (event) => {
    event.stopPropagation();
    const updatedPriceFormat = event.target.value;
    if (updatedPriceFormat !== currentPriceFormat) {
      dispatch(setAuthPriceFormat({ priceFormat: updatedPriceFormat }));
    }
  };

  const changeTimezoneOffsetHandler = (event) => {
    event.stopPropagation();
    const updatedTimezoneOffset = event.target.value;
    if (currentTimezoneOffset !== updatedTimezoneOffset) {
      dispatch(
        setTimezoneOffset({
          timezoneOffset: updatedTimezoneOffset,
        }),
      );
    }
  };

  const changeViewHandler = (event) => {
    event.stopPropagation();
    const updatedMobileView = event.target.value;
    if (currentMobileView !== updatedMobileView) {
      dispatch(
        setAuthMobileView({
          mobileView: updatedMobileView,
        }),
      );
    }
  };

  return (
    <>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          { description: t("settings") },
        ]}
      />

      <div className={classes["sport"]}>
        <div className={classes["sport__settings"]}>
          <div className={classes["settings"]}>
            <h3 className={classes["settings__label"]}>Language / 언어</h3>
            <div className={classes["settings__item"]}>
              <select value={language} onChange={changeLanguageHandler}>
                <option value="en">English</option>
                <option value="ko">한국어</option>
              </select>
              <div className={classes["settings__arrow"]}>
                <img alt="" src={ArrowDownSVG} />
              </div>
            </div>
          </div>
          <div className={classes["settings"]}>
            <h3 className={classes["settings__label"]}>{t("odds")}</h3>
            <div className={classes["settings__item"]}>
              <select value={currentPriceFormat} onChange={changePriceFormatHandler}>
                <option value="EURO">{`${t("decimal_odds")}: (1.8)`}</option>
                <option value="UK">{`${t("fractional_odds")}: (1/2)`}</option>
                <option value="US">{`${t("american_odds")}: (-125)`}</option>
              </select>
              <div className={classes["settings__arrow"]}>
                <img alt="" src={ArrowDownSVG} />
              </div>
            </div>
          </div>
          <div className={classes["settings"]}>
            <h3 className={classes["settings__label"]}>{t("timezone")}</h3>
            <div className={classes["settings__item"]}>
              <select value={currentTimezoneOffset} onChange={changeTimezoneOffsetHandler}>
                <option value={-11}>GMT -11</option>
                <option value={-10}>GMT -10</option>
                <option value={-9}>GMT -9</option>
                <option value={-8}>GMT -8</option>
                <option value={-7}>GMT -7</option>
                <option value={-6}>GMT -6</option>
                <option value={-5}>GMT -5</option>
                <option value={-4}>GMT -4</option>
                <option value={-3}>GMT -3</option>
                <option value={-2}>GMT -2</option>
                <option value={-1}>GMT -1</option>
                <option value={0}>GMT</option>
                <option value={1}>GMT +1</option>
                <option value={2}>GMT +2</option>
                <option value={3}>GMT +3</option>
                <option value={4}>GMT +4</option>
                <option value={5}>GMT +5</option>
                <option value={6}>GMT +6</option>
                <option value={7}>GMT +7</option>
                <option value={8}>GMT +8</option>
                <option value={9}>GMT +9</option>
                <option value={10}>GMT +10</option>
                <option value={11}>GMT +11</option>
                <option value={12}>GMT +12</option>
              </select>
              <div className={classes["settings__arrow"]}>
                <img alt="" src={ArrowDownSVG} />
              </div>
            </div>
          </div>

          {mobileViewList?.length > 1 && (
            <div className={classes["settings"]}>
              <h3 className={classes["settings__label"]}>View</h3>
              <div className={classes["settings__item"]}>
                <select value={currentMobileView.value} onChange={changeViewHandler}>
                  {mobileViewList.map((mobileView) => (
                    <option key={mobileView.value} value={mobileView.value}>
                      {mobileView.label}
                    </option>
                  ))}
                </select>
                <div className={classes["settings__arrow"]}>
                  <img alt="" src={ArrowDownSVG} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;

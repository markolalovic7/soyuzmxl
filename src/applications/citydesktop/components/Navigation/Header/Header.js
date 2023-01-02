import ArrowDownPNG from "applications/citydesktop/img/icons/arrow-down.png";
import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import dayjs from "dayjs";
import { useOnClickOutside } from "hooks/utils-hooks";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import {
  getAuthDesktopView,
  getAuthLanguage,
  getAuthPriceFormat,
  getAuthTimezoneOffset,
} from "redux/reselect/auth-selector";
import { setAuthLanguage, setAuthPriceFormat, setTimezoneOffset } from "redux/slices/authSlice";
import { getLocaleShortDateWeekdayMonthDayNumberYearFormat } from "utils/date-format";

import { setAuthDesktopView } from "../../../../../redux/actions/auth-actions";
import { getCmsConfigAppearance } from "../../../../../redux/reselect/cms-selector";
import { getSportsTree } from "../../../../../redux/slices/sportsTreeSlice";
import { isNotEmpty } from "../../../../../utils/lodash";

const LANGUAGE_LIST = [
  { description: "English", lang: "en" },
  { description: "한국어", lang: "ko" },
];

const TIMEZONE_OFFSETS = [-11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const SIX_HOUR_CACHE_KEY = "6_HOUR";

const Header = () => {
  const language = useSelector(getAuthLanguage);
  const dateFormat = getLocaleShortDateWeekdayMonthDayNumberYearFormat(language);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);
  const hasLive = useMemo(() => !!sportsTreeData?.ept?.find((sport) => sport.criterias.live), [sportsTreeData]);

  useEffect(() => {
    dispatch(getSportsTree({ standard: true }));
    const endDate = `${dayjs()
      .add(6, "hour")
      .set("minute", 59)
      .set("second", 59)
      .set("millisecond", 999)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;
    dispatch(getSportsTree({ cacheKey: SIX_HOUR_CACHE_KEY, standard: true, toDate: endDate }));

    const interval = setInterval(() => {
      // Refresh periodically
      dispatch(getSportsTree({ standard: true }));
      dispatch(getSportsTree({ cacheKey: SIX_HOUR_CACHE_KEY, standard: true, toDate: endDate }));
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, language]);

  const cmsConfigAppearance = useSelector(getCmsConfigAppearance);

  const {
    data: { desktopViews },
  } = cmsConfigAppearance || { data: {} };

  const desktopViewList = isNotEmpty(desktopViews)
    ? Object.values(desktopViews).map(({ desktopView }) => ({
        label: t(`desktop_views.${desktopView}`),
        value: desktopView,
      }))
    : [];

  const [openPriceFormatDropdown, setOpenPriceFormatDropdown] = useState(false);
  const [openTimezoneDropdown, setOpenTimezoneDropdown] = useState(false);
  const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false);
  const [openDesktopViewDropdown, setOpenDesktopViewDropdown] = useState(false);

  const currentTimezoneOffset = useSelector(getAuthTimezoneOffset);
  const currentPriceFormat = useSelector(getAuthPriceFormat);
  const currentLanguage = useSelector(getAuthLanguage);
  const currentDesktopView = useSelector(getAuthDesktopView);

  const refPriceFormat = useRef();
  const refTimezone = useRef();
  const refLanguage = useRef();
  const refDesktopView = useRef();

  useOnClickOutside(refPriceFormat, () => setOpenPriceFormatDropdown(false));
  useOnClickOutside(refTimezone, () => setOpenTimezoneDropdown(false));
  useOnClickOutside(refLanguage, () => setOpenLanguageDropdown(false));
  useOnClickOutside(refDesktopView, () => setOpenDesktopViewDropdown(false));

  const changeLanguageHandler = (event, language) => {
    event.stopPropagation();
    if (currentLanguage !== language) {
      dispatch(setAuthLanguage({ language }));
    }
    setOpenLanguageDropdown(false);
  };

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const changeTimezoneOffsetHandler = (event, offsetHours) => {
    event.stopPropagation();
    if (currentTimezoneOffset !== offsetHours) {
      dispatch(
        setTimezoneOffset({
          timezoneOffset: offsetHours,
        }),
      );
    }
    setOpenTimezoneDropdown(false);
  };

  const changePriceFormatHandler = (event, newPriceFormat) => {
    event.stopPropagation();
    if (currentPriceFormat !== newPriceFormat) {
      dispatch(
        setAuthPriceFormat({
          priceFormat: newPriceFormat,
        }),
      );
    }
    setOpenPriceFormatDropdown(false);
  };

  const changeDesktopViewHandler = (event, newDesktopView) => {
    event.stopPropagation();
    if (currentDesktopView !== newDesktopView) {
      dispatch(
        setAuthDesktopView({
          desktopView: newDesktopView,
        }),
      );
    }
    setOpenDesktopViewDropdown(false);
  };

  const currentLanguageDescription = currentLanguage
    ? LANGUAGE_LIST.find((lang) => lang.lang === currentLanguage)?.description
    : "";

  // TODO - due to late change of designs - to be resolved if this becomes a long maintenance branch

  let livePage = false;
  let liveOverviewPage = false;
  let liveEventDetailPage = false;
  let liveSchedulePage = false;
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname.includes("/live")) {
    livePage = true;
    if (pathname.includes("/live-schedule")) {
      liveSchedulePage = true;
    } else if (pathname.includes("/events/live/")) {
      liveEventDetailPage = true;
    } else {
      liveOverviewPage = true;
    }
  }

  const onOpenPriceFormatDropdown = (event) => {
    event.preventDefault();
    setOpenPriceFormatDropdown(true);
  };

  const onOpenTimezoneDropdown = (event) => {
    event.preventDefault();
    setOpenTimezoneDropdown(true);
  };

  const onOpenLanguageDropdown = (event) => {
    event.preventDefault();
    setOpenLanguageDropdown(true);
  };

  const onOpenDesktopViewDropdown = (event) => {
    event.preventDefault();
    setOpenDesktopViewDropdown(true);
  };

  // end TODO
  return (
    <header className={classes["header"]}>
      {/* <a href="#" className={classes['header__logo']}> */}
      {/*    <img src={Logo} alt="logo"/> */}
      {/* </a> */}
      <nav className={classes["header-menu"]} style={{ paddingLeft: "12px" }}>
        {!livePage ? (
          <nav className={classes["header-menu"]} style={{ paddingLeft: "12px" }}>
            <ul className={classes["header-menu__list"]}>
              <li className={classes["header-menu__item"]}>
                <Link to="/today">{t("todays_events")}</Link>
              </li>
              <li className={classes["header-menu__item"]}>
                <Link to="/live">{t("live_betting")}</Link>
              </li>
              <li className={classes["header-menu__item"]}>
                <a
                  href={process.env.REACT_APP_HITBET_PROMOTIONS_URL ? process.env.REACT_APP_HITBET_PROMOTIONS_URL : "#"}
                  target="_top"
                >
                  {t("hb.promos")}
                </a>
              </li>
              <li className={classes["header-menu__item"]}>
                <Link to="/results">{t("results")}</Link>
              </li>
              <li className={classes["header-menu__item"]}>
                <a
                  href={process.env.REACT_APP_HITBET_CONTACT_US_URL ? process.env.REACT_APP_HITBET_CONTACT_US_URL : "#"}
                  target="_top"
                >
                  {t("contact_us")}
                </a>
              </li>
            </ul>
          </nav>
        ) : (
          <div className={`${classes["header__links"]} ${classes["header__links_overview"]}`}>
            <Link
              className={`${classes["header__link"]} ${liveOverviewPage ? classes["header__link_active"] : ""}`}
              style={{ fontSize: "14px", margin: "0 46px 0 0" }}
              to="/live"
            >
              {t("overview")}
            </Link>
            <Link
              className={`${classes["header__link"]} ${liveEventDetailPage ? classes["header__link_active"] : ""}`}
              style={{ fontSize: "14px", margin: "0 46px 0 0" }}
              to="/events/live/"
            >
              {t("event_view")}
            </Link>
            <Link
              className={`${classes["header__link"]} ${liveSchedulePage ? classes["header__link_active"] : ""}`}
              style={{ fontSize: "14px", margin: "0 46px 0 0" }}
              to="/live-schedule"
            >
              {t("live_schedule")}
            </Link>
          </div>
        )}
      </nav>

      <div className={classes["header-dropdowns"]}>
        <div className={classes["header-dropdowns__item"]} onClick={onOpenPriceFormatDropdown}>
          <div className={classes["header-dropdown"]}>
            <h3 className={classes["header-dropdown__title"]}>
              {currentPriceFormat === "EURO"
                ? t("decimal_odds")
                : currentPriceFormat === "UK"
                ? t("fractional_odds")
                : currentPriceFormat === "US"
                ? t("american_odds")
                : ""}
            </h3>
            <ul
              className={`${classes["header-dropdown__list"]} ${openPriceFormatDropdown ? classes["open"] : ""}`}
              ref={refPriceFormat}
            >
              <li
                className={`${classes["header-dropdown__li"]} ${
                  currentPriceFormat === "EURO" ? classes["header-dropdown__li_active"] : ""
                }`}
                onClick={(event) => changePriceFormatHandler(event, "EURO")}
              >
                <div className={`${classes["header-dropdown__li__text"]} ${classes["header-dropdown__li__links"]}`}>
                  <span>{t("decimal_odds")}</span>
                </div>
              </li>
              <li
                className={`${classes["header-dropdown__li"]} ${
                  currentPriceFormat === "UK" ? classes["header-dropdown__li_active"] : ""
                }`}
                onClick={(event) => changePriceFormatHandler(event, "UK")}
              >
                <div className={`${classes["header-dropdown__li__text"]} ${classes["header-dropdown__li__links"]}`}>
                  <span>{t("fractional_odds")}</span>
                </div>
              </li>
              <li
                className={`${classes["header-dropdown__li"]} ${
                  currentPriceFormat === "US" ? classes["header-dropdown__li_active"] : ""
                }`}
                onClick={(event) => changePriceFormatHandler(event, "US")}
              >
                <div className={`${classes["header-dropdown__li__text"]} ${classes["header-dropdown__li__links"]}`}>
                  <span>{t("american_odds")}</span>
                </div>
              </li>
            </ul>
            <span className={classes["header-dropdown__arrow"]}>
              <img alt="arrow" src={ArrowDownPNG} />
            </span>
          </div>
          <span className={classes["header-dropdowns__border"]} />
        </div>
        <div className={classes["header-dropdowns__item"]} onClick={onOpenTimezoneDropdown}>
          <div className={classes["header-dropdown"]}>
            <h3 className={classes["header-dropdown__title"]}>
              {`${dayjs().utcOffset(currentTimezoneOffset).format("HH:mm:ss")}
               (GMT${currentTimezoneOffset >= 0 ? `+` : ""}${currentTimezoneOffset})`}
            </h3>
            <ul
              className={`${classes["header-dropdown__list"]} ${openTimezoneDropdown ? classes["open"] : ""}`}
              ref={refTimezone}
            >
              {TIMEZONE_OFFSETS.map((offset) => {
                const formattedOffset = offset >= 0 ? `+${offset}` : `${offset}`;
                const active = currentTimezoneOffset === offset;

                return (
                  <li
                    className={`${classes["header-dropdown__li"]} ${
                      active ? classes["header-dropdown__li_active"] : ""
                    }`}
                    key={offset}
                    onClick={(event) => changeTimezoneOffsetHandler(event, offset)}
                  >
                    <div className={`${classes["header-dropdown__li__text"]} ${classes["header-dropdown__li__links"]}`}>
                      <span>{`${dayjs().utcOffset(offset).format("HH:mm:ss")} (GMT${formattedOffset})`}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <span className={classes["header-dropdown__arrow"]}>
              <img alt="arrow" src={ArrowDownPNG} />
            </span>
          </div>
          <span className={classes["header-dropdowns__border"]} />
        </div>
        <div className={classes["header-dropdowns__item"]}>
          <span className={`${classes["header-dropdowns__text"]} ${classes["header-dropdowns__text_solo"]}`}>
            {dayjs().utcOffset(currentTimezoneOffset).format(dateFormat)}
          </span>
          <span className={classes["header-dropdowns__border"]} />
        </div>
        <div className={classes["header-dropdowns__item"]} onClick={onOpenLanguageDropdown}>
          <div className={classes["header-dropdown"]}>
            <h3 className={classes["header-dropdown__title"]}>{currentLanguageDescription}</h3>
            <ul
              className={`${classes["header-dropdown__list"]} ${openLanguageDropdown ? classes["open"] : ""}`}
              ref={refLanguage}
            >
              {LANGUAGE_LIST.map((language) => {
                const active = currentLanguage === language.lang;

                return (
                  <li
                    className={`${classes["header-dropdown__li"]} ${
                      active ? classes["header-dropdown__li_active"] : ""
                    }`}
                    key={language.lang}
                    onClick={(event) => changeLanguageHandler(event, language.lang)}
                  >
                    <div className={`${classes["header-dropdown__li__text"]} ${classes["header-dropdown__li__links"]}`}>
                      <span>{language.description}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <span className={classes["header-dropdown__arrow"]}>
              <img alt="arrow" src={ArrowDownPNG} />
            </span>
          </div>
        </div>

        {desktopViewList && desktopViewList.length > 1 && (
          <div className={classes["header-dropdowns__item"]} onClick={onOpenDesktopViewDropdown}>
            <div className={classes["header-dropdown"]}>
              <h3 className={classes["header-dropdown__title"]} style={{ minWidth: "80px" }}>
                {t(`desktop_views.${currentDesktopView}`)}
              </h3>
              <ul
                className={`${classes["header-dropdown__list"]} ${openDesktopViewDropdown ? classes["open"] : ""}`}
                ref={refDesktopView}
              >
                {desktopViewList.map((desktopView) => {
                  const active = currentDesktopView === desktopView.value;

                  return (
                    <li
                      className={`${classes["header-dropdown__li"]} ${
                        active ? classes["header-dropdown__li_active"] : ""
                      }`}
                      key={desktopView.value}
                      onClick={(event) => changeDesktopViewHandler(event, desktopView.value)}
                    >
                      <div
                        className={`${classes["header-dropdown__li__text"]} ${classes["header-dropdown__li__links"]}`}
                      >
                        <span>{desktopView.label}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <span className={classes["header-dropdown__arrow"]}>
                <img alt="arrow" src={ArrowDownPNG} />
              </span>
            </div>
            <span className={classes["header-dropdowns__border"]} />
          </div>
        )}
      </div>
      {/* <div className={classes['header-buttons']}> */}
      {/*    <a href="#" className={classes['header-button']}>{t('login')}</a> */}
      {/*    <a href="#" */}
      {/*       className={`${classes['header-button']} ${classes['header-button_special']}`}>{t('join_now')}</a> */}
      {/* </div> */}
    </header>
  );
};

export default React.memo(Header);

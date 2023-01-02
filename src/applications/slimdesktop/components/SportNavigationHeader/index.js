import cx from "classnames";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { matchPath, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { getAuthIsSplitModePreferred } from "../../../../redux/reselect/auth-selector";
import { setAuthIsSplitModePreferred } from "../../../../redux/slices/authSlice";
import {
  getPatternLive,
  getPatternLiveCalendar,
  getPatternLiveEvent,
  getPatternLiveEventDetail,
  getPatternLiveEventPathAndEventDetail,
  getPatternLiveEventPathDetail,
  getPatternLiveMultiview,
  getPatternLiveSportDetail,
  getPatternPrematch,
  getPatternPrematchEvent,
  getPatternPrematchEventDetail,
  getPatternPrematchMain,
  getPatternResults,
  getPatternSearch,
  getPatternSearchResults,
} from "../../../../utils/route-patterns";
import classes from "../../scss/slimdesktop.module.scss";

const SportNavigationHeader = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const isSplitModePreferred = useSelector(getAuthIsSplitModePreferred);

  return (
    <div className={classes["content__menu"]}>
      <nav className={classes["content__menu-items"]}>
        <Link
          className={cx(classes["content__menu-link"], {
            [classes["content__menu-link_active"]]:
              [
                getPatternPrematch(),
                getPatternPrematchMain(),
                getPatternPrematchEvent(),
                getPatternPrematchEventDetail(),
                getPatternSearchResults(),
                getPatternSearch(),
              ].findIndex((pattern) => matchPath(location.pathname, { exact: true, path: pattern })) > -1,
          })}
          to={getPatternPrematch()}
        >
          {t("sports")}
        </Link>
        <Link
          className={cx(classes["content__menu-link"], {
            [classes["content__menu-link_active"]]:
              [
                getPatternLiveSportDetail(),
                getPatternLive(),
                getPatternLiveEvent(),
                getPatternLiveEventDetail(),
                getPatternLiveEventPathDetail(),
                getPatternLiveEventPathAndEventDetail(),
                getPatternLiveMultiview(),
              ].findIndex((pattern) => matchPath(location.pathname, { exact: true, path: pattern })) > -1,
          })}
          to={getPatternLive()}
        >
          {t("live")}
        </Link>
        <Link
          className={cx(classes["content__menu-link"], {
            [classes["content__menu-link_active"]]: getPatternLiveCalendar() === location.pathname,
          })}
          to={getPatternLiveCalendar()}
        >
          {t("live_calendar")}
        </Link>
        <Link
          className={cx(classes["content__menu-link"], {
            [classes["content__menu-link_active"]]: getPatternResults() === location.pathname,
          })}
          to={getPatternResults()}
        >
          {t("results")}
        </Link>
      </nav>
      {location.pathname !== getPatternResults() && (
        <div className={classes["content__menu-controls"]}>
          <div className={classes["content__menu-mode"]}>
            <div className={classes["content__menu-mode-label"]}>{t("split_mode")}</div>
            <div className={classes["switch"]}>
              <input
                checked={isSplitModePreferred}
                className={classes["switch__inp"]}
                id="switch0"
                name="switch1"
                type="checkbox"
                onChange={() => {
                  dispatch(setAuthIsSplitModePreferred({ isSplitModePreferred: !isSplitModePreferred }));
                }}
              />
              <label className={classes["switch__label"]} data-off="off" data-on="on" htmlFor="switch0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SportNavigationHeader;

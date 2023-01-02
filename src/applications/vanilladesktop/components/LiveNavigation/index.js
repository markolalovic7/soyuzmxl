import cx from "classnames";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";

import classes from "../../scss/vanilladesktop.module.scss";

const LiveNavigation = () => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className={classes["view-tabs"]}>
      <div
        className={cx(classes["view-tabs__item"], {
          [classes["active"]]: location.pathname === "/live",
        })}
        onClick={() => history.push("/live")}
      >
        {t("overview")}
      </div>
      <div
        className={cx(classes["view-tabs__item"], {
          [classes["active"]]: location.pathname.startsWith("/live/event"),
        })}
        onClick={() => history.push("/live/event")}
      >
        {t("event_view")}
      </div>
      <div
        className={cx(classes["view-tabs__item"], {
          [classes["active"]]: location.pathname === "/live/multiview",
        })}
        onClick={() => history.push("/live/multiview")}
      >
        {t("multiview")}
      </div>
    </div>
  );
};
export default LiveNavigation;

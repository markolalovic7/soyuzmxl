import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import { SIDEBAR_LIVE_MODE, SIDEBAR_SPORT_MODE } from "../constants";

const SideBarExpandingSport = ({ sideBarMode }) => {
  // const [sideBarMode, setSideBarMode] = useState(SIDEBAR_SPORT_MODE);

  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className={classes["left__column-buttons"]}>
      <button
        className={cx({ [classes["active"]]: sideBarMode === SIDEBAR_SPORT_MODE })}
        style={{ pointerEvents: sideBarMode === SIDEBAR_SPORT_MODE ? "none" : "auto" }}
        type="button"
        onClick={() => history.push("/prematch")}
      >
        {t("sports").toUpperCase()}
      </button>
      <button
        className={cx({ [classes["active"]]: sideBarMode === SIDEBAR_LIVE_MODE })}
        style={{ pointerEvents: sideBarMode === SIDEBAR_LIVE_MODE ? "none" : "auto" }}
        type="button"
        onClick={() => history.push("/live")}
      >
        {t("live").toUpperCase()}
      </button>
    </div>
  );
};

export default SideBarExpandingSport;

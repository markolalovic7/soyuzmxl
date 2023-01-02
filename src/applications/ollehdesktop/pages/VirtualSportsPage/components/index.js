import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BetSlipColumn from "applications/ollehdesktop/components/BetSlipColumn";
import SportsIcon from "applications/ollehdesktop/img/icons/sports.svg";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

import { getCmsConfigBetradarVirtual } from "../../../../../redux/reselect/cms-selector";
import {
  getBetradarVirtualSportList,
  getSportCode,
  isLiveBetradarVirtualSports,
  isResponsiveIntegration,
  isWidgetTypeIntegration,
} from "../../../../../utils/betradar-virtual-utils";
import {
  getPatternBetradarVirtual,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternPrematch,
} from "../../../../../utils/route-patterns";
import ResponsiveBetradarVirtualSportsFrame from "../../../../common/components/BetradarVirtualSports/ResponsiveBetradarVirtualSportsFrame";
import WidgetBetradarVirtualSportsFrame from "../../../../common/components/BetradarVirtualSports/WidgetBetradarVirtualSportsFrame";

import VirtualCoupon from "./VirtualCoupon";

const VirtualSportsPage = () => {
  const { feedCode } = useParams();

  const history = useHistory();
  const { t } = useTranslation();

  const cmsConfigBetradarVirtual = useSelector(getCmsConfigBetradarVirtual);

  const {
    data: { feedCodes },
  } = cmsConfigBetradarVirtual || { data: {} };

  const [currentCodes, setCurrentCodes] = useState([]);

  useEffect(() => {
    if (!feedCode && feedCodes?.length > 0) {
      history.push(`/brvirtual/${feedCodes[0]}`);
    }
  }, [feedCode]);

  return (
    <main className={classes["main"]}>
      <div className={classes["left__column"]}>
        <div className={classes["left__column-header"]}>
          <span>VIRT.</span>
        </div>
        {getBetradarVirtualSportList(t)
          .filter((sport) => feedCodes.includes(sport.code))
          .map((sport) => (
            <div
              className={`${classes["column-item"]} ${classes[`virtual-${getSportCode(sport.code).toLowerCase()}`]}`}
              key={sport.code}
              onClick={() => history.push(`/brvirtual/${sport.code}`)}
            >
              <div>
                <h3>{sport.label}</h3>
                <p>{sport.code === feedCode ? t("vanilladesktop.watching_now") : t("vanilladesktop.starting_now")}</p>
              </div>
            </div>
          ))}
        <div className={classes["left__column-footer"]}>
          <img alt="" src={SportsIcon} />
          <span>Virtual Sports Guide</span>
        </div>
      </div>
      <div className={classes["main__column"]} style={{ minWidth: "620px" }}>
        <div className={classes["main__column-top"]}>
          <div className={classes["top__nav"]}>
            <div className={classes["top__nav-icon"]}>
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </div>
            <ul className={classes["top__nav-left"]}>
              <li>
                <Link to={getPatternPrematch()}>{t("sports")}</Link>
              </li>
              <li>
                <Link to={getPatternLive()}>{t("in_play_page")}</Link>
              </li>
            </ul>
          </div>
          <div className={classes["top__nav"]}>
            <ul className={classes["top__nav-right"]}>
              <li>
                <Link className={classes["active"]} to={getPatternBetradarVirtual()}>
                  {t("virtual_sports")}
                </Link>
              </li>
              <li>
                <Link to={getPatternLiveCalendar()}>{t("live_calendar")}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={classes["main__column-virtual"]}>
          <div className={classes["main__column-virtual-video"]}>
            {/* <div className={classes["main__column-virtual-wrapper"]}> */}
            {feedCode && isResponsiveIntegration(feedCode) && (
              <ResponsiveBetradarVirtualSportsFrame feedCode={feedCode} setCurrentCodes={setCurrentCodes} />
            )}
            {feedCode && isWidgetTypeIntegration(feedCode) && (
              <WidgetBetradarVirtualSportsFrame feedCode={feedCode} setCurrentCodes={setCurrentCodes} />
            )}
            {/* </div> */}
          </div>
        </div>

        {feedCode && currentCodes?.length > 0 && (
          <VirtualCoupon
            code={currentCodes.join(",")}
            feedCode={feedCode}
            live={isLiveBetradarVirtualSports(feedCode)}
          />
        )}
      </div>
      <BetSlipColumn />
    </main>
  );
};

export default VirtualSportsPage;

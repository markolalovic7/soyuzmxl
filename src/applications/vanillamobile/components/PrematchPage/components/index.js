import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { PREMATCH_EVENT_TYPE_GAME, PREMATCH_EVENT_TYPE_RANK } from "../constants";

import PrematchContainer from "applications/vanillamobile/common/components/PrematchContainer";
import SectionLoader from "applications/vanillamobile/common/components/SectionLoader";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

// TODO: Refactor in future.
const PrematchSection = () => {
  const { eventPathId } = useParams();
  const { eventId } = useParams();

  const { t } = useTranslation();

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  const [gameOddsTabEnabled, setGameOddsTabEnabled] = useState(false);
  const [outrightTabEnabled, setOutrightTabEnabled] = useState(false);
  const [eventType, setEventType] = useState(null); // GAME, RANK
  const [sportCode, setSportCode] = useState(null);

  useEffect(() => {
    if (sportsTreeData) {
      const recursiveItemSearch = (obj, pathId, sportCode) => {
        let match = null;
        if (obj) {
          const childMatch = obj.find((item) => parseInt(item.id, 10) === pathId);
          if (childMatch) {
            match = { ...childMatch, code: sportCode || childMatch.code };
          } else {
            for (let i = 0; i < obj.length; i += 1) {
              const result = recursiveItemSearch(obj[i].path, pathId, sportCode || obj[i].code);
              if (result) {
                match = result;
                break;
              }
            }
          }
        }

        return match;
      };

      const match = recursiveItemSearch(sportsTreeData.ept, parseInt(eventPathId, 10), undefined);

      if (match) {
        let gameOddsEnabledAux = false;
        let rankOddsEnabledAux = false;

        if (Object.keys(match.criterias).findIndex((criteria) => criteria.startsWith("d")) > -1) {
          gameOddsEnabledAux = true;
        }
        if (Object.keys(match.criterias).findIndex((criteria) => criteria.startsWith("oc")) > -1) {
          rankOddsEnabledAux = true;
        }

        setGameOddsTabEnabled(gameOddsEnabledAux);
        setOutrightTabEnabled(rankOddsEnabledAux);

        if (!eventType) {
          if (gameOddsEnabledAux) {
            setEventType(PREMATCH_EVENT_TYPE_GAME);
          } else if (rankOddsEnabledAux) {
            setEventType(PREMATCH_EVENT_TYPE_RANK);
          }
        } else if (gameOddsEnabledAux && !rankOddsEnabledAux) {
          setEventType(PREMATCH_EVENT_TYPE_GAME);
        } else if (rankOddsEnabledAux && !gameOddsEnabledAux) {
          setEventType(PREMATCH_EVENT_TYPE_RANK);
        }

        setSportCode(match.code);
      }
    }
  }, [sportsTreeData, eventPathId, eventType]);

  return (
    <>
      {gameOddsTabEnabled && outrightTabEnabled && (
        <nav className={classes["navigation"]}>
          <div className={classes["navigation__buttons"]}>
            <button
              className={`${classes["navigation__button"]} ${classes["navigation__button_dark"]} ${
                eventType === PREMATCH_EVENT_TYPE_GAME ? classes["navigation__button_dark-active"] : ""
              }`}
              type="button"
              onClick={() => setEventType(PREMATCH_EVENT_TYPE_GAME)}
            >
              {t("matches")}
            </button>
            <button
              className={`${classes["navigation__button"]} ${classes["navigation__button_dark"]} ${
                eventType === PREMATCH_EVENT_TYPE_RANK ? classes["navigation__button_dark-active"] : ""
              }`}
              type="button"
              onClick={() => setEventType(PREMATCH_EVENT_TYPE_RANK)}
            >
              {t("outright")}
            </button>
          </div>
        </nav>
      )}
      {eventType ? (
        <main className={classes["main"]}>
          <div className={classes["bets"]}>
            <PrematchContainer
              eventType={eventType}
              filterEventId={eventId ? parseInt(eventId, 10) : null}
              searchCode={eventPathId ? `p${eventPathId}` : null}
              sportCode={sportCode}
              virtual={false}
            />
          </div>
        </main>
      ) : (
        <SectionLoader />
      )}
    </>
  );
};

export default PrematchSection;

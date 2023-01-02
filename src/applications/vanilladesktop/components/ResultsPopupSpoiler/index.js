import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import axios from "axios";
import cx from "classnames";
import dayjs from "dayjs";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { getVirtualKironResult } from "../../../../redux/actions/virtual-kiron-actions";
import { formatDateMonthLongDayHourMinutes } from "../../../../utils/dayjs-format";
import FontIcon from "../../../slimmobile/common/components/FontIcon";
import { getWinPlaceOdds } from "../../../vanillamobile/components/KironVirtualSportModal/components/ItemSportResultExpanded/utils";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const propTypes = {
  eventId: PropTypes.number.isRequired,

  label: PropTypes.string.isRequired,

  startTime: PropTypes.string.isRequired,
};

export function getNumberWithOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;

  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const getIcon = (finishPlace) =>
  ({
    1: <IconTrophy color="#f8c81e" />,
    2: <IconTrophy color="#99ab13" />,
    3: <IconTrophy color="#ca781d" />,
  }[finishPlace] ?? null);

const ResultsPopupSpoiler = ({ eventId, label, startTime }) => {
  const { t } = useTranslation();
  const [isOpened, setIsOpened] = useState(false);

  const [resultIsFetching, setResultIsFetching] = useState(true);
  const [result, setResult] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpened) return undefined;

    const source = axios.CancelToken.source();

    const fetchGetVirtualKironResult = async () => {
      const action = await dispatch(
        getVirtualKironResult({
          eventId,
        }),
      );
      if (getVirtualKironResult.fulfilled.match(action)) {
        setResultIsFetching(false);
        setResult(action.payload.results);

        return;
      }
      setResultIsFetching(false);
      setResult([]);
    };

    fetchGetVirtualKironResult();

    return () => {
      source.cancel();
    };
  }, [dispatch, eventId, isOpened]);

  const { AbstractEvent = {} } = result;

  // Note: API for each `feedCode` returns different object.
  // The object has only one field.
  const [event] = Object.keys(AbstractEvent);

  const {
    Distance: distance,
    Entry: entry,
    EventStatus: eventStatus,
    EventTime: eventTime,
    FinishTime: finishTime,
    Market: market,
  } = AbstractEvent[event] || {};

  return (
    <div className={classes["vs-popup__spoiler"]}>
      <div
        className={cx(classes["vs-popup__result"], {
          [classes["active"]]: isOpened,
        })}
        onClick={() => setIsOpened((isOpened) => !isOpened)}
      >
        <span
          className={cx(classes["vs-popup__arrow"], {
            [classes["active"]]: isOpened,
          })}
        />
        <span className={classes["vs-popup__label"]}>{label}</span>
        <span className={classes["vs-popup__match-date"]}>{startTime}</span>
      </div>
      {!isEmpty(result) && !isEmpty(AbstractEvent[event]) ? (
        <div
          className={cx(classes["vs-popup__info"], {
            [classes["open"]]: isOpened,
          })}
        >
          <div className={classes["vs-popup__paragraphs"]}>
            <p className={classes["vs-popup__p"]}>
              <span style={{ paddingRight: "5px" }}>
                {t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_start_time")}
              </span>
              <span>{startTime}</span>
            </p>
            <p className={classes["vs-popup__p"]}>
              <span style={{ paddingRight: "5px" }}>
                {t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_distance")}
              </span>
              <span>{distance}</span>
            </p>
            <p className={classes["vs-popup__p"]}>
              <span style={{ paddingRight: "5px" }}>
                {t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_end_time")}
              </span>
              <span>{formatDateMonthLongDayHourMinutes(dayjs(finishTime))}</span>
            </p>
            <p className={classes["vs-popup__p"]}>
              <span style={{ paddingRight: "5px" }}>
                {t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_status")}
              </span>
              <span>{eventStatus}</span>
            </p>
          </div>
          <div className={classes["vs-popup__cards"]}>
            {market.map((forecast, index) => {
              // locate the winning selection
              const winningSelectionIds = forecast.WinningSelectionIDs?.split(",");
              const winningSelections = winningSelectionIds
                ? forecast.Selection.filter((selection) => winningSelectionIds.includes(selection.ID))
                : [forecast.Selection[0]];

              return (
                <div className={classes["vs-popup__card"]} key={index}>
                  <div className={classes["vs-popup__heading"]}>{forecast.ID}</div>
                  <div className={classes["vs-popup__numbers"]}>
                    <div className={cx(classes["vs-popup__number"], classes["vs-popup__number_bigger"])}>
                      {winningSelections.map((selection) => (
                        <span key={selection.ID}>{selection.Odds}</span>
                      ))}
                    </div>
                    <div className={cx(classes["vs-popup__number"], classes["vs-popup__number_bigger"])}>
                      {winningSelections.map((selection) => (
                        <span key={selection.ID}>{selection.ID}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {entry && (
            <>
              <div className={classes["vs-popup__score"]}>
                <span>{t("vanillamobile.pages.kiron_virtual_sport.title_win")}</span>
                <span>{t("vanillamobile.pages.kiron_virtual_sport.title_place")}</span>
                <span>{t("vanillamobile.pages.kiron_virtual_sport.title_finish")}</span>
              </div>
              <div className={classes["vs-popup__cards"]}>
                {entry.map((result, index) => {
                  const { Draw: draw, Finish: finish, ID: id, Name: name } = result;

                  const { placeOdd, winOdd } = getWinPlaceOdds(market, draw);

                  return (
                    <div className={classes["vs-popup__card"]} key={index}>
                      <div className={classes["vs-popup__heading"]}>{`#${draw} ${name}`}</div>
                      <div className={classes["vs-popup__numbers"]}>
                        <div className={classes["vs-popup__number"]}>{winOdd}</div>
                        <div className={classes["vs-popup__number"]}>{placeOdd}</div>
                      </div>
                      <div
                        className={cx(classes["vs-popup__place"], {
                          [classes["vs-popup__place_first"]]: finish === 1,
                          [classes["vs-popup__place_second"]]: finish === 2,
                          [classes["vs-popup__place_third"]]: finish === 3,
                        })}
                      >
                        <span>{getNumberWithOrdinal(finish)}</span>
                        <FontIcon icon={faTrophy} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        isOpened && <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      )}
    </div>
  );
};

ResultsPopupSpoiler.propTypes = propTypes;

export default ResultsPopupSpoiler;

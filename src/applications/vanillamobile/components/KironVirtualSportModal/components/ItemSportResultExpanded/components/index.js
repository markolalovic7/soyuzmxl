import axios from "axios";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { formatSportResultTime } from "../../../utils";
import IconTrophy from "../../IconTrophy";
import classes from "../styles/index.module.scss";
import { formatResultTitle, getNumberWithOrdinal, getWinPlaceOdds } from "../utils";
import SectionNoData from "applications/vanillamobile/common/components/SectionNoData";
import { getVirtualKironResult } from "redux/actions/virtual-kiron-actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const defaultProps = {};

const propTypes = {
  eventId: PropTypes.number.isRequired,
};

const ItemSportResult = ({ eventId }) => {
  const { t } = useTranslation();
  const [resultIsFetching, setResultIsFetching] = useState(true);
  const [result, setResult] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
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
  }, [dispatch, eventId]);

  if (resultIsFetching) {
    return (
      <div className={classes["item-sport-result-expanded-wrapper"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );
  }

  const { AbstractEvent = {} } = result;

  // Note: API for each `feedCode` returns different object.
  // The object has only one field.
  const [event] = Object.keys(AbstractEvent);

  if (isEmpty(result) || isEmpty(AbstractEvent[event])) {
    return (
      <div className={classes["item-sport-result-expanded-wrapper"]}>
        <SectionNoData title={t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_empty")} />
      </div>
    );
  }

  const renderHeaderInfo = ({ distance, endTime, eventStatus, startTime }) => (
    <div className={classes["item-sport-result-expanded-paragraphs"]}>
      <p>
        <span>{t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_start_time")}</span>
        <span className={classes["text-bold"]}>{startTime}</span>
      </p>
      <p>
        <span>{t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_status")}</span>
        <span className={classes["text-bold"]}>{eventStatus}</span>
      </p>
      <p>
        <span>{t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_end_time")}</span>
        <span className={classes["text-bold"]}>{endTime}</span>
      </p>
      {distance && (
        <p>
          <span>{t("vanillamobile.pages.kiron_virtual_sport.kiron_virtual_sport_distance")}</span>
          <span className={classes["text-bold"]}>{distance}</span>
        </p>
      )}
    </div>
  );

  const renderBodyCard = ({ ID: id, Selection, WinningSelectionIDs }) => {
    // locate the winning selection
    const winningSelectionIds = WinningSelectionIDs?.split(",");
    const winningSelections = winningSelectionIds
      ? Selection.filter((selection) => winningSelectionIds.includes(selection.ID))
      : [Selection[0]];

    return (
      <div className={classes["card-wrapper"]} key={id}>
        <div className={classes["card-title"]}>
          {/* {t(`vanillamobile.pages.kiron_virtual_sport.result_${id.toLowerCase()}`)} */}
          {id}
        </div>
        <div className={classes["card-numbers"]}>
          <div className={classes["card-number"]}>
            {winningSelections.map((sel) => (
              <span key={sel.ID}>{sel.Odds}</span>
            ))}
          </div>
          <div className={classes["card-number"]}>
            {winningSelections.map((sel) => (
              <span key={sel.ID}>{sel.ID}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBodyResult = ({ finish, icon, id, placeOdd, title, winOdd }) => (
    <div className={classes["card-wrapper"]} key={id}>
      <div className={classes["card-title"]}>{title}</div>
      <div className={classes["card-numbers"]}>
        <div className={classes["card-number"]}>{winOdd ?? "-"}</div>
        <div className={classes["card-number"]}>{placeOdd ?? "-"}</div>
        <div className={classes["card-place"]}>
          {finish}
          {icon}
        </div>
      </div>
    </div>
  );

  const getIcon = (finishPlace) =>
    ({
      1: <IconTrophy color="#f8c81e" />,
      2: <IconTrophy color="#99ab13" />,
      3: <IconTrophy color="#ca781d" />,
    }[finishPlace] ?? null);

  const {
    Distance: distance,
    Entry: entry,
    EventStatus: eventStatus,
    EventTime: eventTime,
    FinishTime: finishTime,
    Market: market,
  } = AbstractEvent[event];

  return (
    <div className={classes["item-sport-result-expanded-wrapper"]}>
      {renderHeaderInfo({
        distance,
        endTime: formatSportResultTime(finishTime),
        eventStatus,
        startTime: formatSportResultTime(eventTime),
      })}
      <div className={classes["item-sport-result-expanded-cards"]}>
        {market.map((result) => renderBodyCard(result))}
      </div>
      {entry && (
        <div className={classes["item-sport-result-expanded-score"]}>
          <span className={classes["text-bold"]}>{t("vanillamobile.pages.kiron_virtual_sport.title_win")}</span>
          <span className={classes["text-bold"]}>{t("vanillamobile.pages.kiron_virtual_sport.title_place")}</span>
          <span className={classes["text-bold"]}>{t("vanillamobile.pages.kiron_virtual_sport.title_finish")}</span>
        </div>
      )}
      {entry && (
        <div className={classes["item-sport-result-expanded-cards"]}>
          {entry.map((result) => {
            const { Draw: draw, Finish: finish, ID: id, Name: name } = result;

            const { placeOdd, winOdd } = getWinPlaceOdds(market, draw);

            return renderBodyResult({
              finish: getNumberWithOrdinal(finish),
              icon: getIcon(finish),
              id,
              placeOdd,
              title: formatResultTitle(draw, name),
              winOdd,
            });
          })}
        </div>
      )}
    </div>
  );
};

ItemSportResult.defaultProps = defaultProps;
ItemSportResult.propTypes = propTypes;

export default ItemSportResult;

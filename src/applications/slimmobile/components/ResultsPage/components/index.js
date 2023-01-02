import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getMainBook, getMainBookDetailedEvent } from "redux/slices/resultSlice";
import { getLocaleDateDayNumberMonthTimeFormat } from "utils/date-format";

import { RESULTS_DATE_TABS } from "../constants";
import { getFromDate, getToDate, mapMainBookResults } from "../utils";

import SportsGroup from "./SportsGroup";

const propTypes = {};
const defaultProps = {};

const ResultsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const locale = useSelector(getAuthLanguage);
  const language = useSelector(getAuthLanguage);

  const [currentDateOffset, setCurrentDateOffset] = useState(0);
  const [expandedMatchId, setExpandedMatchId] = useState(null);

  const { detailedEvent, isDetailedLoading, loading, mainBookResults } = useSelector((state) => state.result);

  const dateFormat = useMemo(() => getLocaleDateDayNumberMonthTimeFormat(locale), [locale]);
  const mapped = useMemo(() => mapMainBookResults(mainBookResults, dateFormat), [dateFormat, mainBookResults]);

  const handleMatchExpand = useCallback(
    (id) => () => {
      setExpandedMatchId((expandedMatchId) => (expandedMatchId !== id ? id : null));
    },
    [],
  );

  useEffect(() => {
    const dateFrom = getFromDate(currentDateOffset);
    const dateTo = getToDate(currentDateOffset);

    dispatch(getMainBook({ dateFrom, dateTo }));
  }, [currentDateOffset, dispatch, language]);

  useEffect(() => {
    if (expandedMatchId) dispatch(getMainBookDetailedEvent({ eventId: expandedMatchId }));
  }, [dispatch, expandedMatchId, language]);

  return (
    <div className={classes["calendar"]}>
      <div className={classes["calendar__content"]}>
        <ul className={classes["calendar__headings"]}>
          {RESULTS_DATE_TABS.map((date) => (
            <li
              className={`${classes["calendar__heading"]} ${
                currentDateOffset === date.offset ? classes["calendar__heading_special"] : "none"
              }`}
              key={date.label}
              onClick={() => {
                setCurrentDateOffset(date.offset);
              }}
            >
              {t(date.label)}
            </li>
          ))}
        </ul>
        {loading ? (
          <div className={`${classes.loader}`} />
        ) : (
          mapped?.map((result) => (
            <SportsGroup
              events={result.events}
              expandedDetails={detailedEvent}
              expandedMatchId={expandedMatchId}
              handleMatchExpand={handleMatchExpand}
              heading={result.heading}
              isDetailedLoading={isDetailedLoading}
              key={result.id}
              sportCode={result.sportCode}
            />
          ))
        )}
      </div>
    </div>
  );
};

ResultsPage.propTypes = propTypes;
ResultsPage.defaultProps = defaultProps;

export default ResultsPage;

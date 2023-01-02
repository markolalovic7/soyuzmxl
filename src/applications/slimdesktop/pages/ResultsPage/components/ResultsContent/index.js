import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getAuthLanguage } from "../../../../../../redux/reselect/auth-selector";
import { getMainBook, getMainBookDetailedEvent } from "../../../../../../redux/slices/resultSlice";
import { getLocaleDateDayNumberMonthTimeFormat } from "../../../../../../utils/date-format";
import { getFromDate, getToDate, mapMainBookResults } from "../../../../../slimmobile/components/ResultsPage/utils";

import { RESULTS_DATE_TABS } from "./components/constants";
import SportsGroup from "./components/SportGroup";

const ResultsContent = () => {
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
    <div className={classes["content__cols"]}>
      <div className={cx(classes["content-col"], classes["content-col--full"])}>
        <div
          className={cx(
            classes["content-tabs__controls"],
            classes["content-tabs-controls"],
            classes["content-tabs_modified"],
          )}
        >
          {RESULTS_DATE_TABS.map((date) => (
            <a
              className={cx(classes["content-tabs__controls-link"], classes["content-tabs-controls__link"], {
                [classes["content-tabs-controls__link_active"]]: currentDateOffset === date.offset,
              })}
              key={date.label}
              onClick={() => {
                setCurrentDateOffset(date.offset);
              }}
            >
              {t(date.label)}
            </a>
          ))}
        </div>

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

export default React.memo(ResultsContent);

import { createSelector } from "@reduxjs/toolkit";

export function makeGetLiveCalendarDataInRange() {
  return createSelector(
    (state) => state.liveCalendar?.liveCalendarData,
    (state) => state.sport?.sports,
    (_, props) => props.dateStart,
    (_, props) => props.dateEnd,
    (liveCalendarData, sports, dateStart, dateEnd) =>
      liveCalendarData
        ? liveCalendarData
            .filter((calendarData) => calendarData.epoch >= dateStart && calendarData.epoch <= dateEnd)
            .map((calendarData) => {
              const sportDescription =
                sports && sports[calendarData.sportCode] ? sports[calendarData.sportCode].description : undefined;

              return {
                ...calendarData,
                sportDescription,
              };
            })
        : [],
  );
}

export const getLiveCalendarData = () =>
  createSelector(
    (state) => state.liveCalendar?.liveCalendarData,
    (liveCalendarData) => liveCalendarData,
  );

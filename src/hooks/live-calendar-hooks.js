import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { makeGetLiveCalendarDataInRange } from "redux/reselect/live-calendar-selector";
import { loadLiveCalendarData } from "redux/slices/liveCalendarSlice";

function useGetLiveCalendarData() {
  const languages = useSelector(getAuthLanguage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadLiveCalendarData());
  }, [dispatch, languages]);
}

export const useLiveCalendarData = () => {
  const liveCalendarData = useSelector((state) => state.liveCalendar?.liveCalendarData);
  useGetLiveCalendarData();

  return liveCalendarData;
};

export const useGetLiveCalendarDataInRange = ({ dateEnd, dateStart }) => {
  // Memoize selector to get correct data.
  const getLiveCalendarDataInRange = useMemo(() => makeGetLiveCalendarDataInRange(), []);
  const liveCalendarDataInRange = useSelector((state) => getLiveCalendarDataInRange(state, { dateEnd, dateStart }));
  const liveCalendarDataIsLoading = useSelector((state) => state.liveCalendar?.loading);
  useGetLiveCalendarData();

  return [liveCalendarDataInRange, liveCalendarDataIsLoading];
};

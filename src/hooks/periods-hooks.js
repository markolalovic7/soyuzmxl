import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";

import { getPeriods, getPeriodsBySport } from "../redux/slices/periodSlice";

export function useGetPeriods(dispatch) {
  const periods = useSelector((state) => state.period.periods);
  const language = useSelector(getAuthLanguage);

  useEffect(() => {
    if (!periods) {
      dispatch(getPeriods());
    }
  }, [dispatch, language]);

  return periods;
}

export function useGetPeriodsBySport(dispatch, sportCode) {
  const loading = useSelector((state) => state.period.loading);
  const periods = useSelector((state) => state.period.periodsBySport);
  const language = useSelector(getAuthLanguage);

  useEffect(() => {
    if (isEmpty(periods) && !loading) {
      dispatch(getPeriodsBySport());
    }
  }, [dispatch, language, loading]);

  return periods && periods[sportCode] ? periods[sportCode] : [];
}

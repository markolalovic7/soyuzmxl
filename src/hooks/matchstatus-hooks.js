import { useEffect } from "react";
import { useSelector } from "react-redux";

import { getMatchStatuses } from "../redux/slices/matchStatusSlice";

import { getAuthLanguage } from "redux/reselect/auth-selector";

export function useGetMatchStatuses(dispatch) {
  const loading = useSelector((state) => state.matchStatus.loading);
  const matchstatuses = useSelector((state) => state.matchStatus.matchStatuses);
  const language = useSelector(getAuthLanguage);

  useEffect(() => {
    if (!matchstatuses && !loading) {
      dispatch(getMatchStatuses());
    }
  }, [dispatch, language]);

  return matchstatuses;
}

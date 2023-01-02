import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getJackpotData, getJackpotIsLoading } from "redux/reselect/jackpot-selector";
import { getJackpots } from "redux/slices/jackpotSlice";

export const useGetJackpots = (dispatch) => {
  const jackpots = useSelector(getJackpotData);
  const loading = useSelector(getJackpotIsLoading);

  useEffect(() => {
    dispatch(getJackpots());
  }, [dispatch]);

  return [jackpots, loading];
};

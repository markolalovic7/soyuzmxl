import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getCmsBrandDetailsCurrencies } from "redux/reselect/cms-selector";
import { getCurrencies } from "redux/slices/currencySlice";

export function useGetCurrencies(dispatch) {
  const cmsBrandDetailsCurrencies = useSelector(getCmsBrandDetailsCurrencies);
  const language = useSelector(getAuthLanguage);

  useEffect(() => {
    dispatch(getCurrencies());
  }, [dispatch, language]);

  return cmsBrandDetailsCurrencies;
}

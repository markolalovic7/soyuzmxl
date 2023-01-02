import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getCmsBrandDetailsCountries } from "redux/reselect/cms-selector";
import { getCountries } from "redux/slices/countrySlice";

export const useGetCountries = (dispatch) => {
  const language = useSelector(getAuthLanguage);
  const cmsBrandDetailsCountries = useSelector(getCmsBrandDetailsCountries);

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch, language]);

  return cmsBrandDetailsCountries;
};

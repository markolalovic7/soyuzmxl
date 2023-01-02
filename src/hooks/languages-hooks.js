import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getCmsBrandDetailsLanguages } from "redux/reselect/cms-selector";
import { getLanguages } from "redux/slices/languageSlice";

export function useGetIsLanguageChanged() {
  const language = useSelector(getAuthLanguage);
  const prevLanguage = useRef(language);
  useEffect(() => {
    prevLanguage.current = language;
  }, [language]);

  return prevLanguage.current !== language;
}

export function useGetLanguages(dispatch) {
  const cmsBrandDetailsLanguages = useSelector(getCmsBrandDetailsLanguages);
  const language = useSelector(getAuthLanguage);

  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch, language]);

  return cmsBrandDetailsLanguages;
}

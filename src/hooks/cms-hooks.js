import axios from "axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getCmsConfigSelector } from "redux/reselect/cms-selector";
import { getCmsConfig } from "redux/slices/cmsSlice";
import i18n from "services/i18n";

const getISOLanguage = (lang) => {
  if (lang === "in") return "id"; // cover for the usual mess with Indonesian

  return lang;
};

export function useCmsConfig(dispatch, originId, lineId) {
  const cmsConfig = useSelector(getCmsConfigSelector);
  const language = useSelector(getAuthLanguage);

  useEffect(() => {
    async function fetchGetCmsConfig({ lineId, originId, source }) {
      await dispatch(
        getCmsConfig({
          cancelToken: source.token,
          lineId,
          originId,
        }),
      );
    }

    const source = axios.CancelToken.source();
    // if no config, or app type changed...

    fetchGetCmsConfig({ lineId, originId, source });

    if (i18n.language !== getISOLanguage(language)) {
      const isoLanguage = getISOLanguage(language);
      i18n.changeLanguage(isoLanguage); // For React static text translation purposes
      dayjs.locale(isoLanguage);
    }

    return () => {
      source.cancel();
    };
  }, [dispatch, originId, lineId, language]); // if the language or device changes, get all CMS data

  return cmsConfig;
}

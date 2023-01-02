import { useTranslation } from "react-i18next";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";
import PagePath from "../../Navigation/PagePath/components";

import TodayPageSportsContent from "./TodayPageSportsContent";

const TodayPage = () => {
  const { t } = useTranslation();

  useGAPageView("Today's Events");

  return (
    <>
      <PagePath
        noBottomMargin
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          {
            description: t("todays_events"),
          },
        ]}
      />

      <TodayPageSportsContent />
    </>
  );
};

export default TodayPage;

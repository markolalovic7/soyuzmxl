import { useTranslation } from "react-i18next";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";
import PagePath from "../../Navigation/PagePath/components";
import SportsContainer from "../../SportsContainer";

const LiveBetting = () => {
  const { t } = useTranslation();

  useGAPageView("Live Overview");

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
            description: t("live_betting"),
          },
        ]}
      />
      <SportsContainer liveModeOn sportSelectorModeOn prematchModeOn={false} />
    </>
  );
};

export default LiveBetting;

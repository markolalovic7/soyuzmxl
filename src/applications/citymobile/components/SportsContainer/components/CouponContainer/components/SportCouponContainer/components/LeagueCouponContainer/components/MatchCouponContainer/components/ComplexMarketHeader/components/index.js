import { useTranslation } from "react-i18next";

import classes from "../../../../../../../../../../../../../scss/citymobile.module.scss";

const ComplexMarketHeader = () => {
  const { t } = useTranslation();

  return (
    <div className={classes["sports-spoiler__factors-box"]}>
      <div className={classes["sports-spoiler__team"]}>
        <span />
      </div>
      <div className={classes["sports-spoiler__headings"]}>
        <span className={classes["sports-spoiler__heading"]}>{t("city.sport_labels.spread")}</span>
        <span className={classes["sports-spoiler__heading"]}>{t("city.sport_labels.money_line")}</span>
        <span className={classes["sports-spoiler__heading"]}>{t("city.sport_labels.total_points")}</span>
      </div>
    </div>
  );
};

export default ComplexMarketHeader;

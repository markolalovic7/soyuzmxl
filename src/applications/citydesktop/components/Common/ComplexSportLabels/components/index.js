import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import { useTranslation } from "react-i18next";

const ComplexSportLabels = ({ enabled }) => {
  const { t } = useTranslation();

  return enabled ? (
    <div className={classes["sports-labels"]}>
      <span className={classes["sports-label"]}>{t("city.sport_labels.spread")}</span>
      <span className={classes["sports-label"]}>{t("city.sport_labels.money_line")}</span>
      <span className={classes["sports-label"]}>{t("city.sport_labels.total_points")}</span>
    </div>
  ) : null;
};

export default ComplexSportLabels;

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";
import { getCitySportIcon } from "../../../../../utils/city/sporticon-utils";
import classes from "../../../scss/citymobile.module.scss";
import PagePath from "../../Navigation/PagePath";

// Group elements in rows of 3 elements (tops)
const getRows = (children) => {
  const arrays = [];
  if (children) {
    const size = 3;
    for (let i = 0; i < children.length; i += size) {
      arrays.push(children.slice(i, i + size));
    }
  }

  return arrays;
};

const AZSportsPage = () => {
  const { t } = useTranslation();

  useGAPageView("AZ Sports Page");

  const sports = useSelector((state) => state.sport.sports);
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData); // Initialised in CityMobileApp.

  const groups = sportsTreeData && sportsTreeData.ept ? getRows(sportsTreeData.ept) : [];

  return (
    <>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          { description: t("az_sports") },
        ]}
      />

      <div className={classes["sports-list"]}>
        <div className={classes["sports-list__container"]}>
          {groups.map((group, index) => (
            <div className={classes["sports-list__row"]} key={index}>
              {group.map((sport) => {
                const image = getCitySportIcon(sport.code);

                return (
                  <Link className={classes["sports-list__item"]} to={`/sports/${sport.code.toUpperCase()}`}>
                    <span className={classes["sports-list__icon"]}>
                      {sport.criterias?.live ? <span className={classes["sports-list__live"]}>{t("live")}</span> : null}
                      <img alt={sports ? sports[sport.code].description : ""} src={image} />
                    </span>
                    <span className={classes["sports-list__text"]}>{sports ? sports[sport.code].description : ""}</span>
                  </Link>
                );
              })}
              {group.length < 3 &&
                Array(3 - group.length)
                  .fill(0)
                  .map((placeholder) => <div className={classes["sports-list__item"]} />)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AZSportsPage;

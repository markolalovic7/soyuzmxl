import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { useGAPageView } from "../../../../../hooks/google-analytics-hooks";
import classes from "../../../scss/citymobile.module.scss";
import PagePath from "../../Navigation/PagePath/components";

import CouponMatchesContainer from "./CouponMatchesContainer";

const getLeagues = (countries, eventPaths) => {
  const children = [];
  countries.forEach((country) => {
    const countryDescription = country.desc;

    country.path.forEach((league) => {
      if (eventPaths.includes(league.id)) {
        const leagueDescription = league.desc;
        children.push({
          desc: `${countryDescription} - ${leagueDescription}`,
          id: league.id,
          live: league.criterias.live,
        });
      }
    });
  });

  return children;
};

const CouponPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { eventPathIds, sportCode } = useParams();

  const eventPaths = eventPathIds.split(",").map((e) => parseInt(e, 10));

  useGAPageView("Coupon Page");

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData); // Initialised in CityMobileApp.
  const sports = useSelector((state) => state.sport.sports);

  const countries =
    sportsTreeData && sportsTreeData.ept
      ? Object.values(sportsTreeData.ept).find((sport) => sport.code === sportCode).path
      : [];

  const leagues = getLeagues(countries, eventPaths);

  return (
    <>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          {
            description: sports ? sports[sportCode].description : "",
            target: `/sports/${sportCode}`,
          },
          {
            description: t("custom_coupon_page"),
          },
        ]}
      />

      <div className={classes["sport"]}>
        <h3 className={classes["sports-title"]}>{t("city.pages.coupon.coupon_leagues")}</h3>
        <div className={`${classes["flags"]} ${classes["flags_special"]}`}>
          {leagues.map((l) => (
            <div
              className={`${classes["flag"]} ${l.live ? classes["flag_live"] : ""}`}
              key={l.id}
              onClick={() => history.push(`/leagues/${sportCode}/${l.id}`)}
            >
              <span className={classes["flag__text"]}>{l.desc}</span>
              {l.live ? <span className={classes["flag__live"]}>{t("live")}</span> : null}
            </div>
          ))}
        </div>

        <CouponMatchesContainer eventPaths={eventPaths} sportCode={sportCode} />
      </div>
    </>
  );
};

export default CouponPage;

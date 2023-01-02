import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import classes from "../../../../scss/citywebstyle.module.scss";
import PagePath from "../../../Navigation/PagePath/PagePath";
import SportpageNavigation from "../SportpageDailyMatchListCentralContent/SportpageDailyMatchListNavigation/SportpageDailyMatchListNavigation";

const SportpageAllLeaguesCentralContent = (props) => {
  const { t } = useTranslation();

  const history = useHistory();

  const [activeDateTab, setActiveDateTab] = useState(0); // Numeric - 0 for today, 1 for tomorrow, etc

  const sports = useSelector((state) => state.sport.sports);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  let rows = [];
  const getRows = (path) => {
    const arrays = [];
    if (path) {
      const children = [];
      path.forEach((country) => {
        const countryDescription = country.desc;

        country.path.forEach((league) => {
          const leagueDescription = league.desc;
          children.push({
            desc: `${countryDescription} - ${leagueDescription}`,
            id: league.id,
            live: league.criterias.live,
          });
        });
      });

      const size = 3;

      for (let i = 0; i < children.length; i += size) {
        arrays.push(children.slice(i, i + size));
      }
    }

    return arrays;
  };
  rows =
    sportsTreeData && sportsTreeData.ept
      ? getRows(Object.values(sportsTreeData.ept).find((sport) => sport.code === props.activeCarouselSport).path)
      : [];

  const [checkedLeagues, setCheckedLeagues] = useState([]);

  const checkedLeagueToggleHandler = (e, id) => {
    if (checkedLeagues.includes(id)) {
      setCheckedLeagues(checkedLeagues.filter((index) => id !== index));
    } else {
      setCheckedLeagues([...checkedLeagues, id]);
    }
  };

  const onNavigateToLeague = (e, leagueId) => {
    if (e.target === e.currentTarget) {
      history.push(`/leagues/${props.activeCarouselSport}/${leagueId}`);
    }
  };

  const onNavigateToCouponPageHandler = () => {
    history.push(`/coupons/${props.activeCarouselSport}/${checkedLeagues.join(",")}`);
  };

  return (
    <>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          { description: props.activeCarouselSport && sports ? sports[props.activeCarouselSport].description : "" },
        ]}
      />
      <div className={classes["content__container"]}>
        <SportpageNavigation
          activeCarouselSport={props.activeCarouselSport}
          activeCentralContentTab={props.activeCentralContentTab}
          activeDateTab={activeDateTab}
          setActiveCentralContentTab={props.setActiveCentralContentTab}
          setActiveDateTab={setActiveDateTab}
        />

        <h3 className={`${classes["sports-title"]} ${classes["sports-title_with-button"]}`} style={{ height: "49px" }}>
          <span>{t("all_leagues_page")}</span>
          {checkedLeagues.length > 0 ? (
            <button className={classes["sports-title__coupon"]} onClick={onNavigateToCouponPageHandler}>
              {t("city.pages.sport.create_coupon", { number: checkedLeagues.length })}
            </button>
          ) : null}
        </h3>
        <div className={classes["flags"]}>
          {rows.map((row, index) => (
            <div className={classes["flags__row"]} key={index}>
              {row.map((league, subindex) => {
                const checked = checkedLeagues.includes(league.id);

                return (
                  <div
                    className={`${classes["flag"]} ${league.live ? classes["flag_live"] : ""}`}
                    key={league.id}
                    onClick={(e) => onNavigateToLeague(e, league.id)}
                  >
                    <div className={classes["flag__checkbox"]}>
                      <input
                        checked={checked}
                        id={`flag__checkbox-${index}-${subindex}`}
                        type="checkbox"
                        value={`flag__checkbox-${index}-${subindex}`}
                        onChange={(e) => checkedLeagueToggleHandler(e, league.id)}
                      />
                      <label htmlFor={`flag__checkbox-${index}-${subindex}`}>
                        <FontAwesomeIcon icon={faCheck} />
                      </label>
                    </div>
                    <span className={classes["flag__text"]} onClick={(e) => onNavigateToLeague(e, league.id)}>
                      {league.desc}
                    </span>
                    {league.live ? <span className={classes["flag__live"]}>live</span> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default React.memo(SportpageAllLeaguesCentralContent);

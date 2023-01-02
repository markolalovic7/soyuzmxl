import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import classes from "../../../../../../../scss/citymobile.module.scss";

const getLeagues = (countries) => {
  const children = [];
  countries.forEach((country) => {
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

  return children;
};

const AllLeaguesSection = ({ sportCode }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  const countries =
    sportsTreeData && sportsTreeData.ept
      ? Object.values(sportsTreeData.ept).find((sport) => sport.code === sportCode).path
      : [];

  const leagues = getLeagues(countries);

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
      history.push(`/leagues/${sportCode}/${leagueId}`);
    }
  };

  const onNavigateToCouponPageHandler = () => {
    history.push(`/coupons/${sportCode}/${checkedLeagues.join(",")}`);
  };

  return (
    <>
      <h3 className={classes["sports-title"]}>
        {t("all_leagues_page")}
        {checkedLeagues.length > 0 ? (
          <button className={classes["sports-title__button"]} onClick={onNavigateToCouponPageHandler}>
            {t("city.pages.sport.create_coupon", {
              number: checkedLeagues.length,
            })}
          </button>
        ) : null}
      </h3>
      <div className={classes["flags"]}>
        {leagues.map((league, index) => {
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
                  id={`flag__checkbox-${index}`}
                  type="checkbox"
                  value={`flag__checkbox-${index}`}
                  onChange={(e) => checkedLeagueToggleHandler(e, league.id)}
                />
                <label htmlFor={`flag__checkbox-${index}`}>
                  <FontAwesomeIcon icon={faCheck} />
                </label>
              </div>
              <span className={classes["flag__text"]} onClick={(e) => onNavigateToLeague(e, league.id)}>
                {league.desc}
              </span>
              {league.live ? <span className={classes["flag__live"]}>{t("live")}</span> : null}
            </div>
          );
        })}
      </div>
    </>
  );
};

const propTypes = {
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {};

AllLeaguesSection.propTypes = propTypes;
AllLeaguesSection.defaultProps = defaultProps;

export default AllLeaguesSection;

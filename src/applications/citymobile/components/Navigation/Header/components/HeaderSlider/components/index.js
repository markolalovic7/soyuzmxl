import AllIcon from "assets/img/sports/city/SportIcons/all.png";
import BaseballIcon from "assets/img/sports/city/SportIcons/base.png";
import BasketballIcon from "assets/img/sports/city/SportIcons/bask.png";
import FootballIcon from "assets/img/sports/city/SportIcons/foot.png";
import IceHockeyIcon from "assets/img/sports/city/SportIcons/iceh.png";
import VolleyballIcon from "assets/img/sports/city/SportIcons/voll.png";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CasinoIcon from "../../../../../../img/icons/casino.svg";
import GameIcon from "../../../../../../img/icons/game.svg";
import GiftIcon from "../../../../../../img/icons/gift.svg";
import GameGraphIcon from "../../../../../../img/icons/graph_game_icon.svg";
import LiveCasinoIcon from "../../../../../../img/icons/live-casino.svg";
import MenuIcon from "../../../../../../img/icons/menu.png";
import LiveIcon from "../../../../../../img/icons/sports-icons/live_betting.svg";
import classes from "../../../../../../scss/citymobile.module.scss";

const HeaderSlider = ({ setNavigationTreeOpen }) => {
  const { t } = useTranslation();

  const sports = useSelector((state) => state.sport.sports);

  return (
    <div className={classes["sports-slider"]}>
      <div
        className={`${classes["sports-slider__item"]} ${classes["sports-slider__item_menu"]} ${classes["menuToggle"]}`}
        onClick={() => setNavigationTreeOpen(true)}
      >
        <span className={classes["sports-slider__icon"]}>
          <img alt="menu" src={MenuIcon} />
        </span>
        <span className={classes["sports-slider__text"]}>{t("city.mob_navigation.menu")}</span>
      </div>

      <div className={classes["sports-slider__body"]}>
        <Link className={`${classes["sports-slider__item"]} ${classes["sports-slider__item_search"]}`} to="/search">
          <span className={classes["sports-slider__icon"]}>
            <i className={classes["qicon-search"]} />
          </span>
          <span className={classes["sports-slider__text"]}>{t("bet_search")}</span>
        </Link>
        <Link className={`${classes["sports-slider__item"]} ${classes["sports-slider__item_live"]}`} to="/live">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-football" src={LiveIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{t("in_play_page")}</span>
        </Link>
        <a className={classes["sports-slider__item"]} href={process.env.REACT_APP_HITBET_LIVE_CASINO_URL} target="_top">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-casino" src={LiveCasinoIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{t("live_casino")}</span>
        </a>
        <a className={classes["sports-slider__item"]} href={process.env.REACT_APP_HITBET_GAME_URL} target="_top">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-game" src={GameIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{t("game")}</span>
        </a>
        <a className={classes["sports-slider__item"]} href={process.env.REACT_APP_HITBET_GRAPH_GAME_URL} target="_top">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-graph-game" src={GameGraphIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{t("graph_game")}</span>
        </a>
        <a className={classes["sports-slider__item"]} href={process.env.REACT_APP_HITBET_CASINO_URL} target="_top">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-casino" src={CasinoIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{t("casino")}</span>
        </a>
        <a className={classes["sports-slider__item"]} href={process.env.REACT_APP_HITBET_PROMOTIONS_URL} target="_top">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-promos" src={GiftIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{t("hb.promos")}</span>
        </a>
        <Link className={classes["sports-slider__item"]} to="/sports/FOOT">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-football" src={FootballIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{sports ? sports["FOOT"].description : "..."}</span>
        </Link>
        <Link className={classes["sports-slider__item"]} to="/sports/BASE">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-baseball" src={BaseballIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{t("baseball")}</span>
        </Link>
        <Link className={classes["sports-slider__item"]} to="/sports/BASK">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-basketball" src={BasketballIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{sports ? sports["BASK"].description : "..."}</span>
        </Link>
        <Link className={classes["sports-slider__item"]} to="/sports/VOLL">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-volleyball" src={VolleyballIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{sports ? sports["VOLL"].description : "..."}</span>
        </Link>
        <Link className={classes["sports-slider__item"]} to="/sports/ICEH">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-hockey" src={IceHockeyIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{sports ? sports["ICEH"].description : "..."}</span>
        </Link>
        <Link className={classes["sports-slider__item"]} to="/az">
          <span className={classes["sports-slider__icon"]}>
            <img alt="sports-sports" src={AllIcon} />
          </span>
          <span className={classes["sports-slider__text"]}>{t("all_sports")}</span>
        </Link>
      </div>
    </div>
  );
};

const propTypes = {
  setNavigationTreeOpen: PropTypes.func.isRequired,
};

const defaultProps = {};

HeaderSlider.propTypes = propTypes;
HeaderSlider.defaultProps = defaultProps;

export default HeaderSlider;

import { faSyncAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AmericanFootballImg from "applications/betpoint/img/AmericanFootball.jpg";
import AustralianRulesImg from "applications/betpoint/img/AustralianRules.jpg";
import BadmintonImg from "applications/betpoint/img/Badminton.jpg";
import BaseballImg from "applications/betpoint/img/Baseball.jpg";
import BasketballImg from "applications/betpoint/img/Basketball.jpg";
import BeachVolleyballImg from "applications/betpoint/img/BeachVolleyball.jpg";
import BoxingImg from "applications/betpoint/img/Boxing.jpg";
import CricketImg from "applications/betpoint/img/Cricket.jpg";
import CyclingImg from "applications/betpoint/img/Cycling.jpg";
import DartsImg from "applications/betpoint/img/Darts.jpg";
import LogoWhite from "applications/betpoint/img/demobet-white.png";
import FutsalImg from "applications/betpoint/img/Futsal.jpg";
import GolfImg from "applications/betpoint/img/Golf.jpg";
import HandballImg from "applications/betpoint/img/Handball.jpg";
import IceHockeyImg from "applications/betpoint/img/IceHockey.jpg";
import JackpotImg from "applications/betpoint/img/Jackpot.jpg";
import LiveImg from "applications/betpoint/img/Live.jpg";
import MotorSportsImg from "applications/betpoint/img/MotorSports.jpg";
import OlympicImg from "applications/betpoint/img/Olympics.jpg";
import PromoPeelImg from "applications/betpoint/img/promos-peel-both.png";
import RugbyImg from "applications/betpoint/img/RugbyUnion.jpg";
import SnookerImg from "applications/betpoint/img/Snooker.jpg";
import SoccerImg from "applications/betpoint/img/Soccer.jpg";
import TableTennisImg from "applications/betpoint/img/TableTennis.jpg";
import TennisImg from "applications/betpoint/img/Tennis.jpg";
import VirtualImg from "applications/betpoint/img/virtuals.jpg";
import VolleyballImg from "applications/betpoint/img/Volleyball.jpg";
import WinterGamesImg from "applications/betpoint/img/WinterGames.jpg";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { logout } from "../../../../../redux/actions/auth-actions";
import { getBalance } from "../../../../../redux/reselect/balance-selector";
import { getSportsTreeSelector } from "../../../../../redux/reselect/sport-tree-selector";
import { format12DateHoursMinutes, formatDateWeekDayMonthLong } from "../../../../../utils/dayjs-format";
import { getPatternMyBets } from "../../../../../utils/route-patterns";
import classes from "../../../scss/betpoint.module.scss";

const getSportIconImg = (sportCode) => {
  switch (sportCode) {
    case "AMFB":
      return AmericanFootballImg;
    case "AURL":
      return AustralianRulesImg;
    case "BADM":
      return BadmintonImg;
    case "BASE":
      return BaseballImg;
    case "BASK":
      return BasketballImg;
    case "BEVO":
      return BeachVolleyballImg;
    case "BOXI":
      return BoxingImg;
    case "CRIC":
      return CricketImg;
    case "CYCL":
      return CyclingImg;
    case "DART":
      return DartsImg;
    case "FUTS":
      return FutsalImg;
    case "GOLF":
      return GolfImg;
    case "HAND":
      return HandballImg;
    case "ICEH":
      return IceHockeyImg;
    case "MOSP":
      return MotorSportsImg;
    case "OLYM":
      return OlympicImg;
    case "RUGB":
      return RugbyImg;
    case "SNOO":
      return SnookerImg;
    case "FOOT":
      return SoccerImg;
    case "TABL":
      return TableTennisImg;
    case "TENN":
      return TennisImg;
    case "VOLL":
      return VolleyballImg;
    case "WINT":
      return WinterGamesImg;
    default:
      return MotorSportsImg;
  }
};

const Homepage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sportsTreeData = useSelector(getSportsTreeSelector);
  const availablePromotions = useSelector((state) => state.bonus.availablePromotions);
  const balance = useSelector(getBalance);
  const currencyCode = useSelector((state) => state.auth?.currencyCode);
  const username = useSelector((state) => state.auth?.username);

  const [acknowledgedPromotions, setAcknowledgedPromotions] = useState(false);

  const [date, setDate] = useState(formatDateWeekDayMonthLong(dayjs()));
  const [time, setTime] = useState(format12DateHoursMinutes(dayjs()));

  useEffect(() => {
    const id = setInterval(() => {
      setDate(formatDateWeekDayMonthLong(dayjs()));
      setTime(format12DateHoursMinutes(dayjs()));
    }, 1000);

    return () => clearInterval(id);
  });

  return (
    <div className={classes["homepage"]}>
      <div className={classes["homepage__top"]}>
        <div className={classes["homepage__date"]}>
          <div className={classes["homepage__time"]}>{time}</div>
          <div className={classes["homepage__day"]}>{date}</div>
        </div>
        <div className={classes["homepage__logo"]}>
          <img alt="logo" src={LogoWhite} />
        </div>
        <div className={classes["homepage__information"]}>
          <div className={classes["homepage__user"]}>
            <div className={classes["homepage__greetings"]}>{`Hi, ${username}`}</div>
            <div className={classes["homepage__link"]} style={{ cursor: "pointer" }} onClick={() => dispatch(logout())}>
              Logout
            </div>
          </div>
          <div className={classes["homepage__balance"]}>
            <div className={classes["homepage__icon"]}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
            {balance && (
              <div className={classes["homepage__label"]}>
                {`Balance: ${getSymbolFromCurrency(currencyCode)} ${balance.availableBalance.toLocaleString()}`}
              </div>
            )}
            <div className={classes["homepage__icon"]}>
              <FontAwesomeIcon icon={faSyncAlt} />
            </div>
          </div>
          <div className={classes["homepage__buttons"]}>
            <div className={classes["homepage__button"]} onClick={() => history.push("/promotions")}>
              Promotions
            </div>
            <div className={classes["homepage__button"]} onClick={() => history.push(getPatternMyBets())}>
              History
            </div>
          </div>
        </div>
      </div>
      <div className={classes["homepage__content"]}>
        <div
          className={cx(classes["homepage__sports"], {
            [classes["homepage__sports_promotion"]]: availablePromotions?.length > 0 && !acknowledgedPromotions,
          })}
        >
          <div className={classes["homepage__sport"]} onClick={() => history.push("/live")}>
            <div className={classes["homepage__name"]}>Live In-Play</div>
            <div className={classes["homepage__item"]}>
              <div className={classes["homepage__image"]}>
                <img alt="sport" src={LiveImg} />
              </div>
            </div>
          </div>
          <div className={classes["homepage__sport"]} onClick={() => history.push("/virtual")}>
            <div className={classes["homepage__name"]}>Virtual Sports</div>
            <div className={classes["homepage__item"]}>
              <div className={classes["homepage__image"]}>
                <img alt="sport" src={VirtualImg} />
              </div>
            </div>
          </div>
          <div className={classes["homepage__sport"]}>
            <div className={classes["homepage__name"]}>Jackpot Bets</div>
            <div className={classes["homepage__item"]}>
              <div className={classes["homepage__image"]}>
                <img alt="sport" src={JackpotImg} />
              </div>
            </div>
          </div>

          {sportsTreeData.map((item) => (
            <div
              className={classes["homepage__sport"]}
              key={item.code}
              onClick={() => history.push(`/prematch/sport/${item.code}`)}
            >
              <div className={classes["homepage__name"]}>{item.desc}</div>
              <div className={classes["homepage__item"]}>
                <div className={classes["homepage__image"]}>
                  <img alt="sport" src={getSportIconImg(item.code)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {availablePromotions?.length > 0 && !acknowledgedPromotions && (
        <div className={classes["homepage-banner"]}>
          <div className={classes["homepage-banner__cross"]} onClick={() => setAcknowledgedPromotions(true)}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className={classes["homepage-banner__container"]}>
            <div className={classes["homepage-banner__background"]}>
              <img alt="" src={PromoPeelImg} />
            </div>
            <div className={classes["homepage-banner__box"]}>
              <div className={classes["homepage-banner__offer"]}>SPECIAL OFFER</div>
              <div className={classes["homepage-banner__title"]}>{availablePromotions[0].description}</div>
              {/* <div className={classes["homepage-banner__date"]}>Until December 31, 2021 only!</div> */}
              <div className={classes["homepage-banner__button"]} onClick={() => history.push("/promotions")}>
                View Details
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;

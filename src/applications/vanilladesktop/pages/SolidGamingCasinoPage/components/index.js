import Slider from "applications/common/components/Slider/Slider.js";
import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Animate } from "react-simple-animate";

import { getSolidGamingGameUrl } from "../../../../../redux/actions/solid-gaming-actions";
import { getAuthLoggedIn } from "../../../../../redux/reselect/auth-selector";
import { getSolidGamingGameList } from "../../../../../redux/slices/solidGamingSlice";
import LoginPopup from "../../../components/LoginPopup";
import WildScarabs from "../../../img/toDelete/brands/wild-scarabs.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const setFallbackImage = (e) => {
  e.target.src = WildScarabs;
};

const getCasinoAssetImage = (gameStudio, gameCode) =>
  `https://demosite888.com/static/media/solidgaming/assets/${gameStudio}/${gameCode}.png`;

const SolidGamingCasinoPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const location = useLocation();
  const pathname = location.pathname;

  const [gameIsOpening, setGameIsOpening] = useState(false);
  const [clickedGameCode, setClickedGameCode] = useState();
  const [gameUrl, setGameUrl] = useState();
  const [newPage, setNewPage] = useState();

  const isLoggedIn = useSelector(getAuthLoggedIn);
  const [isLoginPopupOpened, setIsLoginPopupOpened] = useState(false);

  const gameList = useSelector((state) => state.solidGaming.gameList);
  const loading = useSelector((state) => state.solidGaming.loading);

  useEffect(() => {
    if (!gameList) dispatch(getSolidGamingGameList());
  }, [dispatch, gameList]);

  useEffect(() => {
    if (!gameIsOpening) return undefined;

    const source = axios.CancelToken.source();

    const fetchGameUrl = async () => {
      const action = await dispatch(
        getSolidGamingGameUrl({
          gameCode: clickedGameCode,
        }),
      );

      if (getSolidGamingGameUrl.fulfilled.match(action)) {
        setGameUrl(action.payload.events);
      }
    };

    fetchGameUrl();

    return () => {
      source.cancel();
    };
  }, [dispatch, gameIsOpening, clickedGameCode]);

  useEffect(() => {
    if (gameUrl && newPage) {
      newPage.location = gameUrl;
      newPage.focus();
      setNewPage(undefined);
      setGameUrl(undefined);
      setGameIsOpening(undefined);
      setClickedGameCode(undefined);
    }
  }, [gameUrl]);

  useEffect(() => {
    setIsLoginPopupOpened(false);
  }, [pathname]);

  const closeLoginPopup = () => setIsLoginPopupOpened(false);

  const gameGroups = useMemo(() => {
    if (!gameList) return [];

    const hash = {};
    gameList.forEach((game) => {
      if (!hash[game.gameStudio]) {
        hash[game.gameStudio] = [];
      }
      hash[game.gameStudio] = [...hash[game.gameStudio], game];
    });

    const arrays = Object.entries(hash).map((gameStudioEntry) => ({
      description: gameStudioEntry[0],
      games: gameStudioEntry[1],
    }));

    return arrays;
  }, [gameList]);

  const openGameHandler = (gameCode) => {
    const popup = window.open("", "_blank", "toolbar=0,location=0,menubar=0,width=1000,height=800");
    setNewPage(popup);
    setGameIsOpening(true);
    setClickedGameCode(gameCode);
  };

  if (loading) {
    return (
      <main className={classes["main"]}>
        <NewsBanner />
        <div className={classes["casino"]}>
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        </div>
      </main>
    );
  }

  return (
    <main className={classes["main"]}>
      <NewsBanner />
      <div className={classes["casino"]}>
        {gameGroups.map((gameGroup) => (
          <div className={classes["casino__row"]} key={gameGroup.description}>
            <div className={classes["casino__title"]}>{gameGroup.description}</div>
            <Animate play end={{ opacity: 1 }} start={{ opacity: 0 }}>
              <div>
                <Slider
                  options={{
                    adaptiveHeight: false,
                    cellAlign: "left",
                    contain: true,
                    fullscreen: false,
                    pageDots: false,
                    prevNextButtons: true,
                  }}
                >
                  {gameGroup.games.map((game, index) => (
                    <div
                      className={classes["casino__item"]}
                      key={index}
                      style={{ height: "190px", marginRight: "10px", width: "300px" }}
                      onClick={() => (isLoggedIn ? openGameHandler(game.gameCode) : setIsLoginPopupOpened(true))}
                    >
                      <div className={classes["casino__img"]}>
                        <img
                          alt={game.gameDescription}
                          src={getCasinoAssetImage(game.gameStudio, game.gameCode)}
                          onError={setFallbackImage}
                        />
                      </div>
                      <div className={classes["casino__text"]}>
                        {game.gameDescription.length > 18
                          ? `${game.gameDescription.slice(0, 15)}...`
                          : game.gameDescription}
                      </div>
                      <div className={classes["casino__button"]}>{isLoggedIn ? t("play_now") : t("login")}</div>
                    </div>
                  ))}
                </Slider>
              </div>
            </Animate>
          </div>
        ))}
      </div>
      {isLoginPopupOpened && <LoginPopup isOpened={!isLoggedIn && isLoginPopupOpened} onClose={closeLoginPopup} />}
    </main>
  );
};

export default SolidGamingCasinoPage;

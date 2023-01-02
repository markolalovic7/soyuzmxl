import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getSolidGamingGameUrl } from "../../../../../redux/actions/solid-gaming-actions";
import { getAuthLoggedIn } from "../../../../../redux/reselect/auth-selector";
import { getSolidGamingGameList } from "../../../../../redux/slices/solidGamingSlice";
import WildScarabs from "../../../../vanilladesktop/img/toDelete/brands/wild-scarabs.png";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
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

  const [gameIsOpening, setGameIsOpening] = useState(false);
  const [clickedGameCode, setClickedGameCode] = useState();
  const [gameUrl, setGameUrl] = useState();
  const [newPage, setNewPage] = useState();

  const isLoggedIn = useSelector(getAuthLoggedIn);

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
        <div className={classes["casino"]}>
          <div className={classes["spinner-container"]}>
            <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={classes["main"]}>
      <div className={classes["casino"]}>
        {gameGroups.map((gameGroup) => (
          <div className={classes["casino__container"]} key={gameGroup.description}>
            <div className={classes["casino__title"]}>{gameGroup.description}</div>
            <div className={classes["casino__slider"]}>
              {gameGroup.games.map((game, index) => (
                <div
                  className={classes["casino__item"]}
                  key={index}
                  onClick={() => (isLoggedIn ? openGameHandler(game.gameCode) : alert(t("login_into_account")))}
                >
                  <div className={classes["casino__img"]}>
                    <img
                      alt={game.gameDescription}
                      src={getCasinoAssetImage(game.gameStudio, game.gameCode)}
                      onError={setFallbackImage}
                    />
                  </div>
                  <div className={classes["casino__text"]}>{game.gameDescription}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default SolidGamingCasinoPage;

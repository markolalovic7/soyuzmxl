import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import trim from "lodash.trim";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Animate } from "react-simple-animate";

import {
  APPLICATION_TYPE_COMPACT_DESKTOP,
  APPLICATION_TYPE_EUROPEAN_DESKTOP,
} from "../../../../../constants/application-types";
import { getAuthDesktopView } from "../../../../../redux/reselect/auth-selector";
import { getHrefSearchResults } from "../../../../../utils/route-href";

const NewsBanner = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [activeNewIndex, setActiveNewIndex] = useState();
  const [news, setNews] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const view = useSelector(getAuthDesktopView);
  const [newsAnimationPlay, setNewsAnimationPlay] = useState(1);

  const searchHandler = (event) => {
    event.preventDefault();
    if (trim(searchPhrase).length > 2) {
      history.push(getHrefSearchResults(searchPhrase));
    }
  };

  const handleKeypress = (e) => {
    // it triggers by pressing the enter key
    if (e.key === "Enter") {
      searchHandler(e);
    }
  };

  useEffect(() => {
    if (news.length === 0) {
      // use a site to parse rss as a stepping stone. besides requiring no library to parse the rss, we avoid CORS restrictions this way
      fetch("https://api.rss2json.com/v1/api.json?rss_url=https://sports.yahoo.com/soccer/rss.xml")
        .then((response) => response.json())
        .then((responseJson) => {
          const filteredNews = responseJson
            ? responseJson.items.map((item) => item.description).filter((item) => !item.includes("SUBSCRIBERS"))
            : [];
          setNews(filteredNews);
          setActiveNewIndex(filteredNews.length > 0 ? filteredNews.length - 1 : undefined);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [news]);

  useEffect(() => {
    let intervalId = null;
    if (news.length > 0) {
      intervalId = setInterval(() => {
        if (activeNewIndex !== undefined) {
          setNewsAnimationPlay(false);
          setActiveNewIndex((activeNewIndex + 1) % (news.length - 1));
          setNewsAnimationPlay(Math.random());
        }
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeNewIndex, news]);

  return (
    <div className={classes["main__news"]}>
      <div className={classes["news"]}>
        <div className={classes["news__icon"]}>
          <svg height="17" viewBox="0 0 19 17" width="19" xmlns="http://www.w3.org/2000/svg">
            <g>
              <g>
                <path d="M16.41 4.355v7.53a4.149 4.149 0 0 0 2.414-3.766c0-1.6-.937-3.058-2.414-3.764zm-14.48 0C.865 4.355 0 5.197 0 6.237v3.765c0 1.04.864 1.882 1.93 1.882h.966v3.765c0 .52.432.941.965.941h1.93a.953.953 0 0 0 .966-.941v-3.765h2.896l4.827 3.765V.59L9.653 4.355z" />
              </g>
            </g>
          </svg>
          <span>{t("vanilladesktop.news!")}</span>
        </div>
        <div className={classes["news__message"]}>
          {newsAnimationPlay && (
            <Animate play duration={1.5} end={{ opacity: 1 }} start={{ opacity: 0 }}>
              <span className={classes["news__title"]} key={newsAnimationPlay}>
                {activeNewIndex ? news[activeNewIndex] : ""}
              </span>
            </Animate>
          )}
        </div>
      </div>
      {[APPLICATION_TYPE_COMPACT_DESKTOP, APPLICATION_TYPE_EUROPEAN_DESKTOP].includes(view) && (
        <div className={classes["main__search"]}>
          <span className={classes["qicon-search"]} onClick={searchHandler} />
          <input
            placeholder={t("vanilla_search.type_event_name")}
            type="text"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
            onKeyPress={handleKeypress}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(NewsBanner);

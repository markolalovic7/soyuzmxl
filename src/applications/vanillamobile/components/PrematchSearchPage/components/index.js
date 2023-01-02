import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import trim from "lodash.trim";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import SearchResultContainer from "./SearchResultContainer";
import SearchWallpaper from "./SearchWallpaper";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const Search = () => {
  const { t } = useTranslation();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [submittedSearchPhrase, setSubmittedSearchPhrase] = useState("");

  const searchHandler = (event) => {
    event.preventDefault();
    if (trim(searchPhrase).length > 2) {
      setSubmittedSearchPhrase(searchPhrase);
    }
  };

  const onClearSearch = () => {
    setSearchPhrase("");
    setSubmittedSearchPhrase("");
  };

  return (
    <main className={classes["main"]}>
      <div className={classes["search"]}>
        <form onSubmit={searchHandler}>
          <div className={classes["search__input"]}>
            <input
              id="search-input"
              placeholder={t("vanilla_search.type_event_name")}
              type="text"
              value={searchPhrase}
              onChange={(e) => setSearchPhrase(e.target.value)}
            />
            <span
              className={classes["search__close"]}
              style={{ display: searchPhrase.length > 0 ? "inline" : "display" }}
              onClick={onClearSearch}
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </span>
          </div>
        </form>
        {submittedSearchPhrase.length === 0 ? (
          <SearchWallpaper />
        ) : (
          <SearchResultContainer searchPhrase={submittedSearchPhrase} />
        )}
      </div>
    </main>
  );
};

export default Search;

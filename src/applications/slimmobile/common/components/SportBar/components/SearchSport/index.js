import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import trim from "lodash.trim";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { getHrefSearchResults } from "../../../../../../../utils/route-href";

const propTypes = {};

const defaultProps = {};

const SearchSport = () => {
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);

  const history = useHistory();

  const searchInputHandler = (event) => {
    event.preventDefault();
    setSearchKeyword(event.target.value);
  };

  // todo: Here
  const searchHandler = (event) => {
    event.preventDefault();
    if (trim(searchKeyword).length > 2) {
      history.push(getHrefSearchResults(searchKeyword)); // navigate to the new route...
    }
  };

  const onSearchFocusHandler = () => {
    setSearchFocus(true);
  };

  const onSearchBlurHandler = () => {
    setSearchFocus(false);
  };

  return (
    <div className={classes["navigation__form"]} style={{ paddingTop: "0px" }}>
      <form onSubmit={searchHandler}>
        <div className={classes["navigation__search"]}>
          <input
            className={classes["search"]}
            id="main-search"
            name="search"
            placeholder={t("search")}
            type="search"
            value={searchKeyword}
            onBlur={onSearchBlurHandler}
            onChange={searchInputHandler}
            onFocus={onSearchFocusHandler}
          />
          <span
            className={`${classes["qicon-search"]} ${classes["search-icon"]} ${searchFocus ? classes["active"] : ""}`}
            id="search-qicon"
          />
        </div>
      </form>
    </div>
  );
};

SearchSport.propTypes = propTypes;
SearchSport.defaultProps = defaultProps;

export default SearchSport;

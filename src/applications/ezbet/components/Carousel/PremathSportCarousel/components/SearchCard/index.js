import cx from "classnames";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";

import { getHrefSearch } from "../../../../../../../utils/route-href";
import classes from "../../../../../scss/ezbet.module.scss";

const SearchCard = () => {
  const location = useLocation();
  const history = useHistory();

  return (
    <div className={cx(classes["search-container"])}>
      <label
        className={classes["search-button"]}
        onClick={() => history.push(`${getHrefSearch()}?returnPath=${location.pathname}`)}
      >
        <div className={classes["search-wrapper"]}>
          <span className={classes["icon-search-light"]} />
          <small>검색</small>
        </div>
      </label>
    </div>
  );
};

export default SearchCard;

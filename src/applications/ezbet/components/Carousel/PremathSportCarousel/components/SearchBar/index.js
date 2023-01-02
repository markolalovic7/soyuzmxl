import cx from "classnames";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { useHistory, useParams } from "react-router-dom";
import { useCurrentBreakpointName } from "react-socks";

import { clearSearchResults } from "../../../../../../../redux/slices/couponSlice";
import { isNotEmpty } from "../../../../../../../utils/lodash";
import { getHrefSearchResults } from "../../../../../../../utils/route-href";
import classes from "../../../../../scss/ezbet.module.scss";

const SearchBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { searchPhrase } = useParams();

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const returnPath = query.get("returnPath") ?? undefined;

  const [searchValue, setSearchValue] = useState(searchPhrase ? decodeURIComponent(searchPhrase) : "");

  const onEditAmountKeyDownHandler = (e) => {
    if (e.key === "Enter" && isNotEmpty(searchValue.trim())) {
      dispatch(clearSearchResults());
      history.push(`${getHrefSearchResults(encodeURIComponent(searchValue.trim()))}?returnPath=${returnPath}`);
    }
  };
  const breakpoint = useCurrentBreakpointName();

  return (
    <div className={cx(classes["search-container"], classes["search-opened"])}>
      <input
        className={classes["search"]}
        id="searchLeft"
        name="searchLeft"
        placeholder={`${breakpoint === "small" ? "검색" : "키워드를 입력해 주세요."}`}
        type="text"
        value={searchValue}
        onChange={(e) => {
          // regex to match alphanumerics, spaces, brackets
          const regex =
            /^[a-zA-Z0-9\/!@#$^&_=<>+\-\s\(\)\[\]{}[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]]*$/;

          if (isEmpty(e.target.value) || e.target.value.match(regex)) setSearchValue(e.target.value);
        }}
        onKeyDown={onEditAmountKeyDownHandler}
      />
      {isEmpty(searchValue) ? (
        <button
          className={classes["absolute"]}
          disabled={isEmpty(searchValue.trim())}
          type="button"
          // onClick={() => history.push(`${getHrefSearchResults(searchValue.trim())}?returnPath=${returnPath}`)}
        >
          <span className="search-icon-2">
            <svg height="16" viewBox="0 0 20 16" width="20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath>
                  <path d="M0 16V0h20v16z" fill="#fff" />
                </clipPath>
                <clipPath id="2s4gb">
                  <path d="M0 16V0h20v16z" />
                </clipPath>
              </defs>
              <g clipPath="url(#2s4gb)">
                <path
                  d="M13.737 9.768a7.063 7.063 0 01-2.12 2.122l3.67 3.67a1.5 1.5 0 102.121-2.12zM7.847 2.5c-1.929 0-3.5 1.57-3.5 3.5h1c0-1.378 1.122-2.5 2.5-2.5zm0-1c2.482 0 4.5 2.019 4.5 4.5s-2.018 4.5-4.5 4.5a4.505 4.505 0 01-4.5-4.5c0-2.481 2.02-4.5 4.5-4.5zm0-1.5a6 6 0 10.003 12 6 6 0 00-.002-12z"
                  fill="#959595"
                />
              </g>
            </svg>
          </span>
        </button>
      ) : (
        <button className={classes["absolute"]} type="button" onClick={() => setSearchValue("")}>
          <span className={classes["icon-grey-close"]} />
        </button>
      )}

      <label className={classes["search-button"]} htmlFor="searchLeft">
        <span
          className={classes["icon-back"]}
          onClick={() => {
            history.push(returnPath);
          }}
        />
      </label>
    </div>
  );
};

export default SearchBar;

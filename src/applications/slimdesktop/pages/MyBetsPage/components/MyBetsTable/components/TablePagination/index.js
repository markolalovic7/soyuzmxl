import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

const getPages = (pageCount, selectedPage) => {
  // if there are many pages, we want to return 5 pages (the current one, and the 2 before and after).
  // If we are in the initial pages (1,2), display additional subsequent x to fill 5
  // If we are in the final pages (length -1 or -2), display additional previous x to fill 5
  // if there are less than 5 pages, show all we have.

  if (pageCount <= 5) {
    return [0, 1, 2, 3, 4].slice(0, pageCount);
  }

  if (selectedPage < 2) {
    return [0, 1, 2, 3, 4];
  }

  if (selectedPage > pageCount - 3) {
    return [pageCount - 5, pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1];
  }

  return [selectedPage - 2, selectedPage - 1, selectedPage, selectedPage + 1, selectedPage + 2];
};

const TablePagination = ({ pageCount, selectedPage, setSelectedPage }) => (
  <div className={classes["pager"]}>
    <ul className={classes["pager__list"]}>
      {pageCount > 0 && (
        <>
          <li className={classes["pager__item"]}>
            <button
              className={cx(classes["pager__link"], { [classes["disabled"]]: selectedPage === 0 })}
              type="button"
              onClick={() => setSelectedPage(0)}
            >
              First
            </button>
          </li>

          <li className={classes["pager__item"]}>
            <button
              className={cx(classes["pager__link"], { [classes["disabled"]]: selectedPage === 0 })}
              type="button"
              onClick={() => setSelectedPage(selectedPage - 1)}
            >
              <svg height="12" viewBox="0 0 8 12" width="8" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path d="M7.41 10.58L2.83 6l4.58-4.59L6 0 0 6l6 6z" />
                  </g>
                </g>
              </svg>
            </button>
          </li>
        </>
      )}

      {getPages(pageCount, selectedPage).map((p) => (
        <li className={classes["pager__item"]} key={p}>
          <button
            className={cx(classes["pager__link"], { [classes["active"]]: selectedPage === p })}
            type="button"
            onClick={() => setSelectedPage(p)}
          >
            {p + 1}
          </button>
        </li>
      ))}
      {pageCount > 0 && (
        <>
          <li className={classes["pager__item"]}>
            <button
              className={cx(classes["pager__link"], { [classes["disabled"]]: selectedPage === pageCount - 1 })}
              type="button"
              onClick={() => setSelectedPage(selectedPage + 1)}
            >
              <svg height="12" viewBox="0 0 8 12" width="8" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path d="M0 10.58L4.58 6 0 1.41 1.41 0l6 6-6 6z" />
                  </g>
                </g>
              </svg>
            </button>
          </li>
          <li className={classes["pager__item"]}>
            <button
              className={cx(classes["pager__link"], { [classes["disabled"]]: selectedPage === pageCount - 1 })}
              type="button"
              onClick={() => setSelectedPage(pageCount - 1)}
            >
              Last
            </button>
          </li>
        </>
      )}
    </ul>
  </div>
);

TablePagination.propTypes = {
  pageCount: PropTypes.number.isRequired,
  selectedPage: PropTypes.number.isRequired,
  setSelectedPage: PropTypes.func.isRequired,
};

export default React.memo(TablePagination);

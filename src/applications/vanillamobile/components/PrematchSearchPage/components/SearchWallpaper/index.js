import { useTranslation } from "react-i18next";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const SearchWallpaper = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={classes["search__wrapper"]}>
        <div className={classes["search__icons"]}>
          <div className={classes["search__row-1"]}>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-cric"]} />
            </span>
          </div>
          <div className={classes["search__row-2"]}>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-base"]} />
            </span>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-badm"]} />
            </span>
          </div>
          <div className={classes["search__row-3"]}>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-coun"]} />
            </span>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-iceh"]} />
            </span>
          </div>
          <div className={classes["search__row-4"]}>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-bevo"]} />
            </span>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-dart"]} />
            </span>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-futs"]} />
            </span>
          </div>
          <div className={classes["search__row-5"]}>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-cycl"]} />
            </span>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-floo"]} />
            </span>
          </div>
          <div className={classes["search__row-6"]}>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-boxi"]} />
            </span>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-bask"]} />
            </span>
          </div>
          <div className={classes["search__row-7"]}>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-aurl"]} />
            </span>
          </div>
        </div>
      </div>
      <h1 className={classes["search__title"]}>{t("vanilla_search.start_searching")}</h1>
      <h4 className={classes["search__subtitle"]}>{t("vanilla_search.find_your_events")}</h4>
    </>
  );
};

export default SearchWallpaper;

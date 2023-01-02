import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const NoResultSearchWallpaper = () => (
  <>
    <div className={classes["search__wrapper"]}>
      <div className={classes["search__container"]}>
        <div className={classes["search__box-left"]}>
          <div className={classes["search__item-left-1"]}>
            <span className={`${classes["search__icon"]} ${classes["search__icon_transparent"]}`}>
              <i className={classes["qicon-bask"]} />
            </span>
            <span className={`${classes["search__icon"]} ${classes["search__icon_translucent"]}`}>
              <i className={classes["qicon-cric"]} />
            </span>
          </div>
          <div className={classes["search__item-left-2"]}>
            <span className={`${classes["search__icon"]} ${classes["search__icon_transparent"]}`}>
              <i className={classes["qicon-foot"]} />
            </span>
            <span className={`${classes["search__icon"]} ${classes["search__icon_translucent"]}`}>
              <i className={classes["qicon-iceh"]} />
            </span>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-base"]} />
            </span>
          </div>
          <div className={classes["search__item-left-3"]}>
            <span className={`${classes["search__icon"]} ${classes["search__icon_transparent"]}`}>
              <i className={classes["qicon-coun"]} />
            </span>
            <span className={`${classes["search__icon"]} ${classes["search__icon_translucent"]}`}>
              <i className={classes["qicon-squa"]} />
            </span>
          </div>
        </div>
        <div className={classes["search__loupe"]}>
          <i className={classes["qicon-search"]} />
          <span className={classes["search__icon_red"]}>
            <i className={classes["qicon-cric"]} />
          </span>
        </div>
        <div className={classes["search__box-right"]}>
          <div className={classes["search__item-right-1"]}>
            <span className={`${classes["search__icon"]} ${classes["search__icon_translucent"]}`}>
              <i className={classes["qicon-rugb"]} />
            </span>
            <span className={`${classes["search__icon"]} ${classes["search__icon_transparent"]}`}>
              <i className={classes["qicon-bevo"]} />
            </span>
          </div>
          <div className={classes["search__item-right-2"]}>
            <span className={classes["search__icon"]}>
              <i className={classes["qicon-badm"]} />
            </span>
            <span className={`${classes["search__icon"]} ${classes["search__icon_translucent"]}`}>
              <i className={classes["qicon-futs"]} />
            </span>
            <span className={`${classes["search__icon"]} ${classes["search__icon_transparent"]}`}>
              <i className={classes["qicon-mosp"]} />
            </span>
          </div>
          <div className={classes["search__item-right-3"]}>
            <span className={`${classes["search__icon"]} ${classes["search__icon_translucent"]}`}>
              <i className={classes["qicon-boxi"]} />
            </span>
            <span className={`${classes["search__icon"]} ${classes["search__icon_transparent"]}`}>
              <i className={classes["qicon-cycl"]} />
            </span>
          </div>
        </div>
      </div>
    </div>
    <h1 className={classes["search__title"]}>No results found</h1>
    <h4 className={classes["search__subtitle"]}>
      <p> No event was found.</p>
      <p> Please check your spelling or search for another event.</p>
    </h4>
  </>
);

export default NoResultSearchWallpaper;

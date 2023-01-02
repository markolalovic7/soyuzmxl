import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import cx from "classnames";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const ScrollToTopButton = () => {
  const { t } = useTranslation();

  const [isScrollButtonShown, setIsScrollButtonShow] = useState(false);
  const onClickHandler = () => {
    setIsScrollButtonShow(false);
    window.scrollTo({ top: 0 });
  };

  useScrollPosition(
    ({ currPos }) => {
      setIsScrollButtonShow(window.innerHeight + currPos.y <= 0);
    },
    [],
    undefined,
    false,
    400,
  );

  return (
    <div className={cx(classes["up"], { [classes["active"]]: isScrollButtonShown })} onClick={onClickHandler}>
      <span className={classes["up__arrow"]} />
      <span className={classes["up__text"]} style={{ fontSize: t("go_to_top").length < 5 ? "14px" : "10px" }}>
        {t("go_to_top")}
      </span>
      <span className={classes["up__bottom"]}>{t("go_to_top")}</span>
    </div>
  );
};
export default React.memo(ScrollToTopButton);

import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import ArrowTopImg from "assets/img/icons/arrow-top.svg";
import cx from "classnames";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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
    <div className={cx(classes["top"], { [classes["active"]]: isScrollButtonShown })} onClick={onClickHandler}>
      <span className={classes["top__arrow"]}>
        <img alt="arrow-top" src={ArrowTopImg} />
      </span>
      <span className={classes["top__text"]}>{t("go_to_top")}</span>
    </div>
  );
};
export default React.memo(ScrollToTopButton);

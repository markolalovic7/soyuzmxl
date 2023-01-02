import React from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../scss/citywebstyle.module.scss";
import PagePath from "../../../Navigation/PagePath/PagePath";

import CouponpageContainer from "./CouponpageContainer/CouponpageContainer";

const CouponPageContent = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <PagePath paths={[{ description: t("home_page"), target: "/" }, { description: t("custom_coupon_page") }]} />
      <div className={classes["content__container"]}>
        <CouponpageContainer eventPathIds={props.eventPathIds} sportCode={props.sportCode} />
      </div>
    </>
  );
};

export default React.memo(CouponPageContent);

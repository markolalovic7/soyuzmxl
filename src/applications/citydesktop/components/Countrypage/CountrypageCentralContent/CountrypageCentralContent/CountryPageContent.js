import React from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../scss/citywebstyle.module.scss";
import PagePath from "../../../Navigation/PagePath/PagePath";

import CountrypageContainer from "./CountrypageContainer/CountrypageContainer";

const CountryPageContent = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <PagePath paths={[{ description: t("home_page"), target: "/" }, { description: t("all_leagues_page") }]} />
      <div className={classes["content__container"]}>
        <CountrypageContainer code={`p${props.activeEventPathId}`} sportCode={props.sportCode} />
      </div>
    </>
  );
};

export default React.memo(CountryPageContent);

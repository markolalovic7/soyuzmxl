import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import classes from "../../../../scss/citywebstyle.module.scss";

const LeftNavigationHelpSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <span className={classes["left-panel__border"]} />
      <h2 className={`${classes["accordion-title"]} ${classes["accordion-title_blue"]}`}>{t("help")}</h2>
      <div className={classes["dropdowns"]}>
        <a
          className={classes["dropdown"]}
          href={process.env.REACT_APP_HITBET_PROMOTIONS_URL ? process.env.REACT_APP_HITBET_PROMOTIONS_URL : "#"}
          target="_top"
        >
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("hb.promos")}</h4>
            </div>
          </div>
        </a>
        <a
          className={classes["dropdown"]}
          href={process.env.REACT_APP_HITBET_DEPOSITORS_URL ? process.env.REACT_APP_HITBET_DEPOSITORS_URL : "#"}
          target="_top"
        >
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("depositors")}</h4>
            </div>
          </div>
        </a>
        <Link className={classes["dropdown"]} to="/results">
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("results")}</h4>
            </div>
          </div>
        </Link>
        <div
          className={classes["dropdown"]}
          style={{ cursor: "pointer" }}
          onClick={() =>
            window.open(
              process.env.REACT_APP_HITBET_LIVE_RESULTS_URL,
              "_blank",
              "toolbar=0,location=0,menubar=0,width=1000,height=800",
            )
          }
        >
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("live_results")}</h4>
            </div>
          </div>
        </div>
        <a
          className={classes["dropdown"]}
          style={{ cursor: "pointer" }}
          target="_top"
          onClick={() =>
            window.open(
              process.env.REACT_APP_HITBET_STATISTICS_URL,
              "_blank",
              "toolbar=0,location=0,menubar=0,width=1000,height=800",
            )
          }
        >
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("statistics")}</h4>
            </div>
          </div>
        </a>
        <div className={classes["dropdown"]} onClick={() => window.parent.openContactForm(1)}>
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("bet_types")}</h4>
            </div>
          </div>
        </div>
        <div className={classes["dropdown"]} onClick={() => window.parent.openContactForm(2)}>
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("betting_rules")}</h4>
            </div>
          </div>
        </div>
        <div className={classes["dropdown"]} onClick={() => window.parent.openContactForm(3)}>
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("casino_rules")}</h4>
            </div>
          </div>
        </div>
        <div className={classes["dropdown"]} onClick={() => window.parent.openContactForm(4)}>
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("contact_us")}</h4>
            </div>
          </div>
        </div>
        <div className={classes["dropdown"]} onClick={() => window.parent.openContactForm(5)}>
          <div className={classes["dropdown__body"]}>
            <div className={classes["dropdown__text"]}>
              <h4 className={classes["dropdown__title"]}>{t("terms_and_conditions")}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftNavigationHelpSection;

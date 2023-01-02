import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import CentralColumnWidgets from "../../../../components/CentralColumnWidgets";

const CentralColumn = () => {
  const { t } = useTranslation();
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const availablePromotions = useSelector((state) => state.bonus.availablePromotions);

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["central-section__content"]}>
        <CentralColumnWidgets />

        <div className={classes["page-content"]}>
          <div className={classes["page-content-title"]}>{t("promotions")}</div>

          {availablePromotions?.map((promotion, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h1>{promotion.description}</h1>
              <p>{promotion.notes}</p>
              {promotion.bannerUrl && (
                <img
                  alt="promotion"
                  src={promotion.bannerUrl}
                  style={{
                    height: "100%",
                    maxHeight: "315px",
                    objectFit: "cover",
                    verticalAlign: "middle",
                    width: "1260px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CentralColumn;

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import ContentCarousel from "../../ContentPage/components/ContentCarousel";
import classes from "../../ContentPage/styles/index.module.scss";

const PromotionPage = () => {
  const { t } = useTranslation();
  const availablePromotions = useSelector((state) => state.bonus.availablePromotions);

  return (
    <div className={classes["wrapper"]}>
      <ContentCarousel />
      <div className={classes["page-content-wrapper"]}>
        <h1 className={classes["main__title"]}>{t("promotions")}</h1>
        {availablePromotions?.map((promotion, index) => (
          <div
            className={classes["content"]}
            key={index}
            style={{ borderBottom: "1px solid #d2d7da", marginBottom: "10px", paddingBottom: "20px" }}
          >
            <h1>{promotion.description}</h1>
            <p>{promotion.notes}</p>
            {promotion.bannerUrl && (
              <img
                alt="promotion"
                src={promotion.bannerUrl}
                style={{
                  height: "140px",
                  objectFit: "cover",
                  verticalAlign: "top",
                  width: "100%",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionPage;

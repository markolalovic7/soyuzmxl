import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import Header from "../../../components/Header";
import classes from "../../../scss/betpoint.module.scss";

const PromotionPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const availablePromotions = useSelector((state) => state.bonus.availablePromotions);

  return (
    <div className={classes["betpoint-body"]}>
      <div className={classes["wrapper"]}>
        <Header />
        <div className={classes["main"]}>
          <div className={classes["promotions"]}>
            <div className={classes["promotions__header"]}>
              <div className={classes["promotions__title"]}>Promotions</div>
              <div className={classes["promotions__icon"]}>
                <FontAwesomeIcon icon={faSyncAlt} />
              </div>
            </div>

            {availablePromotions?.map((promotion, index) => (
              <div className={classes["promotions__body"]} key={index}>
                <div className={classes["promotions__content"]}>
                  <div className={classes["promotions__heading"]}>
                    <div className={classes["promotions__label"]}>{promotion.description}</div>
                    {/* <div className={classes["promotions__duration"]}>Until December 31, 2021 only!</div> */}
                  </div>
                  <div className={classes["promotions__info"]}>{promotion.notes}</div>
                  <div className={classes["promotions__docs"]}>
                    <div className={classes["promotions__doc"]}>Terms and Conditions:</div>
                    <ul className={classes["promotions__list"]}>
                      <li className={classes["promotions__li"]}>{promotion.tc}</li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <div className={classes["promotions__controls"]}>
              <div className={classes["promotions__control"]} onClick={() => history.push("/home")}>
                Back
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionPage;

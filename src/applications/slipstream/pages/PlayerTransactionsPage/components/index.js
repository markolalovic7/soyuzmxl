import classes from "applications/slipstream/scss/slipstream.module.scss";

import Footer from "../../../components/Footer/components";
import ToolboxHeader from "../../../components/ToolboxHeader/components";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";

const PlayerTransactionsPage = () => (
  <div className={classes["slipstream-body"]}>
    <div className={classes["wrapper"]}>
      <ToolboxHeader />

      <div className={classes["main"]}>
        <div className={classes["main__container"]}>
          <div className={classes["telebet"]}>
            <div className={classes["main__title"]}>
              <span className={classes["main__title-text"]}>Telebet Transactions</span>
            </div>
            <div className={classes["telebet__body"]}>
              <div className={classes["telebet__wrapper"]}>
                <div className={classes["telebet__box"]}>
                  <div className={classes["telebet__item"]}>
                    <div className={classes["telebet__label"]}>Username</div>
                    <div className={classes["telebet__input"]}>
                      <input disabled type="text" value="JCTEST33" />
                    </div>
                  </div>
                  <div className={classes["telebet__item"]}>
                    <div className={classes["telebet__label"]}>Name</div>
                    <div className={classes["telebet__input"]}>
                      <input disabled type="text" value="Jc Catalan" />
                    </div>
                  </div>
                  <div className={classes["telebet__item"]}>
                    <div className={classes["telebet__label"]}>Transaction Type</div>
                    <div className={classes["telebet__radios"]}>
                      <div className={classes["telebet__radio"]}>
                        <input id="cashIn" style={{ display: "block" }} type="radio" />
                        <label htmlFor="cashIn">Cash In</label>
                      </div>
                      <div className={classes["telebet__radio"]}>
                        <input id="cashOut" style={{ display: "block" }} type="radio" />
                        <label htmlFor="cashOut">Cash Out</label>
                      </div>
                    </div>
                  </div>
                  <div className={classes["telebet__item"]}>
                    <div className={classes["telebet__label"]}>Amount</div>
                    <div className={classes["telebet__input"]}>
                      <input type="text" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes["main__buttons"]}>
                <div className={classes["main__button"]}>Cancel</div>
                <div className={classes["main__button"]}>Submit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
);

export default withNfcRedirection(withBarcodeReader(PlayerTransactionsPage));

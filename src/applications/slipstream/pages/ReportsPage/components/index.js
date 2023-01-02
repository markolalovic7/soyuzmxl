import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";

import Footer from "../../../components/Footer/components";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";
import LogoPNG from "../../../img/logo.png";

const ReportsPage = () => (
  <div className={classes["slipstream-body"]}>
    <div className={classes["wrapper"]}>
      <header className={classes["header"]}>
        <div className={classes["header__container"]}>
          <div className={classes["header__logo"]}>
            <img alt="" src={LogoPNG} />
          </div>

          <div className={classes["header__links"]}>
            <a className={cx(classes["header__link"], classes["link"])} href="#">
              <span className={classes["link__icon"]}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
              <span className={classes["link__text"]}>Back</span>
            </a>
          </div>
        </div>
      </header>
      <div className={classes["main"]}>
        <div className={classes["main__container"]}>
          <div className={classes["reports"]}>
            <div className={classes["available-reports"]}>
              <div className={classes["main__title"]}>
                <div className={classes["main__title-text"]}>Available Reports</div>
              </div>
              <div className={classes["available-reports__body"]}>
                <div className={classes["available-reports"]}>
                  <ul className={classes["available-reports__list"]}>
                    {[1, 2, 3].map((report, index) => (
                      <li className={classes["available-reports__item"]} key={index}>
                        <div
                          className={cx(
                            classes["available-reports__item-content"],
                            classes["accordion"],
                            classes["active"],
                          )}
                        >
                          <span className={classes["available-reports__arrow"]} />
                          <h4 className={classes["available-reports__title"]}>Report Group</h4>
                        </div>
                        <ul className={classes["available-reports__sublist"]}>
                          <li className={classes["available-reports__subitem"]}>
                            <a
                              className={cx(
                                classes["available-reports__subitem-content"],
                                classes["accordion"],
                                classes["open"],
                              )}
                              href="#"
                            >
                              <h5 className={classes["available-reports__title"]}>Account Activity</h5>
                            </a>
                          </li>
                        </ul>
                        <ul className={classes["available-reports__sublist"]}>
                          <li className={classes["available-reports__subitem"]}>
                            <a
                              className={cx(
                                classes["available-reports__subitem-content"],
                                classes["accordion"],
                                classes["open"],
                              )}
                              href="#"
                            >
                              <h5 className={classes["available-reports__title"]}>Accounts Opened</h5>
                            </a>
                          </li>
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className={classes["report-parameters"]}>
              <div className={classes["main__title"]}>
                <div className={classes["main__title-text"]}>Report parameters</div>
              </div>
              <form action="#" className={classes["report-parameters__form"]}>
                <div className={classes["report-parameters__body"]}>
                  <div className={classes["report-parameters__row"]}>
                    <div className={classes["report-parameters__label"]}>Report name:</div>
                    <div className={classes["report-parameters__item"]}>Account Activity</div>
                  </div>
                  <div className={classes["report-parameters__row"]}>
                    <div className={classes["report-parameters__label"]}>Report description:</div>
                    <div className={classes["report-parameters__item"]} />
                  </div>
                  <div className={classes["report-parameters__row"]}>
                    <div className={classes["report-parameters__label"]}>Report comment:</div>
                    <div className={classes["report-parameters__item"]} />
                  </div>
                  <div className={classes["report-parameters__row"]}>
                    <div className={classes["report-parameters__item"]}>
                      <div className={classes["report-parameters__label"]}>Report parameters:</div>
                      <div className={classes["report-parameters__inputs"]}>
                        <div className={classes["report-parameters__input"]}>
                          <div className={classes["report-parameters__text"]}>Date from:</div>
                          <input type="text" />
                        </div>
                        <div className={classes["report-parameters__input"]}>
                          <div className={classes["report-parameters__text"]}>Date to:</div>
                          <input type="text" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classes["report-parameters__bottom"]}>
                  <div className={classes["report-parameters__format"]}>
                    <div className={classes["report-parameters__heading"]}>Report format:</div>
                    <div className={classes["report-parameters__radios"]}>
                      <div className={classes["report-parameters__radio"]}>
                        <input id="rhtml" name="report-type" style={{ display: "block" }} type="radio" />
                        <label htmlFor="rhtml">Html</label>
                      </div>
                      <div className={classes["report-parameters__radio"]}>
                        <input id="rcsv" name="report-type" style={{ display: "block" }} type="radio" />
                        <label htmlFor="rcsv">Csv</label>
                      </div>
                      <div className={classes["report-parameters__radio"]}>
                        <input id="rpdf" name="report-type" style={{ display: "block" }} type="radio" />
                        <label htmlFor="rpdf">Pdf</label>
                      </div>
                      <div className={classes["report-parameters__radio"]}>
                        <input id="rxls" name="report-type" style={{ display: "block" }} type="radio" />
                        <label htmlFor="rxls">Xls</label>
                      </div>
                    </div>
                  </div>
                  <button className={classes["report-parameters__button"]} type="submit">
                    Run Reports
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
);

export default withNfcRedirection(withBarcodeReader(ReportsPage));

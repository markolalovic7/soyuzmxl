import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import axios from "axios";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { getAuthLoggedIn } from "../../../../../redux/reselect/auth-selector";
import { getRetailSelectedPlayerAccountId } from "../../../../../redux/reselect/retail-selector";
import {
  loadRetailNfc,
  setRetailPlayerAccountId,
  updateRetailPlayerAccountNfc,
} from "../../../../../redux/slices/retailAccountSlice";
import { isNotEmpty } from "../../../../../utils/lodash";
import Footer from "../../../components/Footer/components";
import SlipstreamPopup from "../../../components/SlipstreamPopup/SlipstreamPopup";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import LogoPNG from "../../../img/logo.png";

const AssignNFCPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { accountId: accountIdStr } = useParams();
  const accountId = accountIdStr ? Number(accountIdStr) : undefined;

  const [openPopUp, setOpenPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState(false);

  const savingNfc = useSelector((state) => state.retailAccount?.savingNfc);

  const selectedPlayerId = useSelector(getRetailSelectedPlayerAccountId);
  const loggedIn = useSelector(getAuthLoggedIn);

  useEffect(() => {
    // if the page is reloaded, re-populate the current player account ID off the URL.
    if (!selectedPlayerId) {
      dispatch(setRetailPlayerAccountId({ accountId }));
    }
  }, [selectedPlayerId]);

  const updateNfc = async ({ nfc }) => {
    const action = await dispatch(updateRetailPlayerAccountNfc({ accountId: selectedPlayerId, nfc }));

    if (updateRetailPlayerAccountNfc.fulfilled.match(action)) {
      setPopUpMessage("Nfc successfully mapped to this player account");
      setOpenPopUp(true);
    } else if (updateRetailPlayerAccountNfc.rejected.match(action)) {
      setPopUpMessage(`Unable to update NFC Tag [${action.error.message}]`);
      setOpenPopUp(true);
    }
  };

  useEffect(() => {
    if (!loggedIn) return undefined;

    const intervalId = setInterval(() => {
      if (savingNfc) return undefined;

      const source = axios.CancelToken.source();

      const fetchNfcUpdates = async () => {
        const action = await dispatch(loadRetailNfc());

        if (loadRetailNfc.fulfilled.match(action)) {
          const nfc = action.payload.nfc;
          if (isNotEmpty(nfc)) {
            await updateNfc({ nfc });
          }
        }
      };

      fetchNfcUpdates();

      return () => {
        source.cancel();
      };
    }, 100);

    return () => clearInterval(intervalId);
  }, [savingNfc]);

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <header className={classes["header"]}>
          <div className={classes["header__container"]}>
            <div className={classes["header__logo"]} onClick={() => history.push("/")}>
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
            <div className={classes["update-page"]}>
              <div className={classes["main__title"]}>
                <div className={classes["main__title-text"]}> Update NFC</div>
              </div>
              <div className={classes["update-page__body"]}>
                <div className={classes["update-page__nfs"]}>
                  <div className={classes["update-page__nfs-title"]}>Please insert or tap your NFC card</div>
                  <div className={classes["update-page__nfs-card"]}>
                    <div className={classes["nfc-card-box"]}>
                      <div className={cx(classes["nfc-card"], classes["c5"])}>
                        <div className={cx(classes["nfc-card"], classes["c4"])}>
                          <div className={cx(classes["nfc-card"], classes["c3"])}>
                            <div className={cx(classes["nfc-card"], classes["c2"])}>
                              <div className={cx(classes["nfc-card"], classes["c1"])}>NFC</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={classes["main__buttons"]}>
                <div className={classes["main__button"]}>cancel</div>
                <div className={classes["main__button disabled"]}>remove</div>
                <div className={classes["main__button disabled"]}>update</div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {openPopUp && (
        <SlipstreamPopup
          headerText="NFC"
          text={popUpMessage}
          onClose={() => {
            setOpenPopUp(false);
            history.push(`/accountview/${selectedPlayerId}?origin=DIRECT`);
          }}
        />
      )}
    </div>
  );
};

export default withBarcodeReader(AssignNFCPage);

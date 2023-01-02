import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";

import { getAuthTill } from "../../../../../redux/reselect/auth-selector";
import { getRetailSelectedPlayerAccountId } from "../../../../../redux/reselect/retail-selector";
import {
  getRetailPlayerAccountPhoto,
  setRetailPlayerAccountId,
  updateRetailPlayerAccountPhoto,
} from "../../../../../redux/slices/retailAccountSlice";
import Footer from "../../../components/Footer/components";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import LogoPNG from "../../../img/logo.png";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const _base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }

  return bytes.buffer;
};

function makeblob(dataURL) {
  const BASE64_MARKER = ";base64,";
  const parts = dataURL.split(BASE64_MARKER);
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

const AssignPhotoPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { accountId: accountIdStr } = useParams();
  const accountId = accountIdStr ? Number(accountIdStr) : undefined;

  const tillAuth = useSelector(getAuthTill);
  const selectedPlayerId = useSelector(getRetailSelectedPlayerAccountId);
  const photoUploadError = useSelector((state) => state.retailAccount.photoUploadError);
  const savingPhoto = useSelector((state) => state.retailAccount.savingPhoto);
  const existingImgSrc = useSelector((state) => state.retailAccount.playerAccountPhoto);

  useEffect(() => {
    // if the page is reloaded, re-populate the current player account ID off the URL.
    if (!selectedPlayerId) {
      dispatch(setRetailPlayerAccountId({ accountId }));
    }
  }, [selectedPlayerId]);

  useEffect(() => {
    // if the page is reloaded, re-populate the current player account ID off the URL.
    if (selectedPlayerId && tillAuth) {
      dispatch(getRetailPlayerAccountPhoto({ accountId: selectedPlayerId }));
    }
  }, [selectedPlayerId, tillAuth]);

  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const onUploadPhoto = () => {
    if (imgSrc) {
      // console.log(imgSrc);
      // const base64Image = imgSrc.substr(imgSrc.indexOf(",") + 1);
      // console.log(base64Image);

      // const byteArray = _base64ToArrayBuffer(base64Image);

      const blob = makeblob(imgSrc);

      console.log(blob);

      dispatch(
        updateRetailPlayerAccountPhoto({
          accountId: selectedPlayerId,
          fileObject: blob,
        }),
      );
      setImgSrc(undefined);
    }
  };

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <header className={classes["header"]}>
          <div className={classes["header__container"]}>
            <div className={classes["header__logo"]} onClick={() => history.push("/")}>
              <img alt="" src={LogoPNG} />
            </div>

            <div className={classes["header__links"]}>
              <Link
                className={cx(classes["header__link"], classes["link"])}
                to={`/accountview/${accountId}?origin=DIRECT`}
              >
                <span className={classes["link__icon"]}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </span>
                <span className={classes["link__text"]}>Back</span>
              </Link>
            </div>
          </div>
        </header>
        <div className={classes["main"]}>
          <div className={classes["main__container"]}>
            <div className={classes["update-page"]}>
              <div className={classes["main__title"]}>
                <div className={classes["main__title-text"]}> Update photo</div>
              </div>
              <div className={classes["update-page__body"]}>
                <div className={classes["update-page__items"]}>
                  <div className={classes["update-page__item"]}>
                    <div className={classes["update-page__label"]}>Current Photo</div>
                    <div className={classes["update-page__photo"]}>
                      {existingImgSrc && <img alt="old pic" src={existingImgSrc} />}
                    </div>
                  </div>
                  <div className={classes["update-page__item"]}>
                    <div className={classes["update-page__label"]}>Camera</div>
                    <div className={classes["update-page__photo"]}>
                      <Webcam
                        audio={false}
                        height="240px"
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="320px"
                      />
                    </div>
                  </div>
                  <div className={classes["update-page__item"]}>
                    <div className={classes["update-page__label"]}>New Photo</div>
                    <div className={classes["update-page__photo"]}>{imgSrc && <img alt="new pic" src={imgSrc} />}</div>
                  </div>
                </div>
                <div className={classes["update-page__buttons"]}>
                  <div className={cx(classes["update-page__button"], classes["main__button"])} onClick={capture}>
                    take photo
                  </div>
                </div>
              </div>

              <div className={classes["main__buttons"]}>
                <div
                  className={classes["main__button"]}
                  onClick={() => history.push(`/accountview/${accountId}?origin=DIRECT`)}
                >
                  cancel
                </div>
                <div
                  className={cx(classes["main__button"], { [classes["disabled"]]: !imgSrc })}
                  onClick={onUploadPhoto}
                >
                  {savingPhoto ? (
                    <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                  ) : (
                    "update"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default withBarcodeReader(AssignPhotoPage);

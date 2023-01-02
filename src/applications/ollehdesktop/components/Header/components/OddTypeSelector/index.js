import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import { useOnClickOutside } from "hooks/utils-hooks";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getAuthSelector } from "../../../../../../redux/reselect/auth-selector";
import { getCmsConfigBetting } from "../../../../../../redux/reselect/cms-selector";
import { setAuthPriceFormat } from "../../../../../../redux/slices/authSlice";

// Draft. Handling dropdown opening
// TODO: add odd type change logic, consider creating special select component for this app
const OddTypeSelector = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isOpened, setIsOpened] = useState(false);
  const oddTypeRef = useRef();

  const cmsConfigBetting = useSelector(getCmsConfigBetting);

  const {
    data: { priceFormats },
  } = cmsConfigBetting || { data: {} };

  const { priceFormat: authPriceFormat } = useSelector(getAuthSelector);

  useOnClickOutside(oddTypeRef, () => setIsOpened(false));

  const onPriceFormatChange = useCallback(
    (priceFormat) => {
      if (authPriceFormat !== priceFormat) {
        dispatch(
          setAuthPriceFormat({
            priceFormat,
          }),
        );
      }
    },
    [authPriceFormat, dispatch],
  );

  return (
    <div
      className={`${classes["header__navigation-numbers"]} ${isOpened ? classes["active"] : ""}`}
      ref={oddTypeRef}
      onClick={() => setIsOpened((value) => !value)}
    >
      <ul className={classes["default-option"]}>
        <li>
          <div className={classes["option"]}>
            <span>Odd:&nbsp;</span>
            {t(`price_formats.${authPriceFormat}`)}
          </div>
        </li>
      </ul>
      <ul className={classes["dropdown"]}>
        {priceFormats.map((priceFormat) => (
          <li key={priceFormat} onClick={() => onPriceFormatChange(priceFormat)}>
            <div className={`${classes["option"]}`}>
              <span>Odd:&nbsp;</span>
              {t(`price_formats.${priceFormat}`)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default OddTypeSelector;

import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import { LANGUAGES } from "constants/languages";
import { useOnClickOutside } from "hooks/utils-hooks";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthSelector } from "redux/reselect/auth-selector";
import { getCmsConfigBrandDetails } from "redux/reselect/cms-selector";
import { setAuthLanguage } from "redux/slices/authSlice";

// Draft. Handling dropdown opening
// TODO: add language change logic, consider creating special select component for this app
const LanguageSelector = () => {
  const dispatch = useDispatch();

  const [isOpened, setIsOpened] = useState(false);
  const languageSelectorRef = useRef();

  const { language: authLanguage } = useSelector(getAuthSelector);

  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const {
    data: { languages },
  } = cmsConfigBrandDetails || { data: {} };

  useOnClickOutside(languageSelectorRef, () => setIsOpened(false));

  const onLanguageChange = useCallback(
    (language) => {
      if (authLanguage !== language) {
        dispatch(
          setAuthLanguage({
            language,
          }),
        );
      }
    },
    [authLanguage, dispatch],
  );

  const currentLanguageDetails = LANGUAGES.find((l) => l.value === authLanguage);

  return (
    <div
      className={`${classes["header__navigation-select"]} ${isOpened ? classes["active"] : ""}`}
      ref={languageSelectorRef}
      onClick={() => setIsOpened((isOpened) => !isOpened)}
    >
      <ul className={classes["default-option"]}>
        <li>
          <div className={`${classes["option"]}`}>
            {currentLanguageDetails && (
              <>
                <img
                  alt={currentLanguageDetails.img.alt}
                  className={classes["header__navigation-flag"]}
                  src={currentLanguageDetails.img.src}
                />
                {currentLanguageDetails.label}
              </>
            )}
          </div>
        </li>
      </ul>
      <ul className={classes["dropdown"]}>
        {LANGUAGES.filter((l) => languages?.includes(l.value)).map((l) => (
          <li key={l.value} onClick={() => onLanguageChange(l.value)}>
            <div className={`${classes["option"]}}`}>
              <img alt={l.img.alt} className={classes["header__navigation-flag"]} src={l.img.src} />
              {l.label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default LanguageSelector;

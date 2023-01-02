import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import { useOnClickOutside } from "hooks/utils-hooks";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { setAuthDesktopView } from "../../../../../../redux/actions/auth-actions";
import { getAuthSelector } from "../../../../../../redux/reselect/auth-selector";
import { getCmsConfigAppearance } from "../../../../../../redux/reselect/cms-selector";
import { isNotEmpty } from "../../../../../../utils/lodash";

const ViewTypeSelector = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isOpened, setIsOpened] = useState(false);
  const viewTypeRef = useRef();

  const cmsConfigAppearance = useSelector(getCmsConfigAppearance);

  const {
    data: { desktopViews },
  } = cmsConfigAppearance || { data: {} };

  const desktopViewList = isNotEmpty(desktopViews)
    ? Object.values(desktopViews).map(({ desktopView }) => ({
        label: t(`desktop_views.${desktopView}`),
        value: desktopView,
      }))
    : [];

  const { desktopView: authDesktopView } = useSelector(getAuthSelector);

  useOnClickOutside(viewTypeRef, () => setIsOpened(false));

  const onDesktopViewChange = useCallback(
    (desktopView) => {
      if (authDesktopView !== desktopView) {
        dispatch(
          setAuthDesktopView({
            desktopView,
          }),
        );
      }
    },
    [authDesktopView, dispatch],
  );

  const currentViewDetails = desktopViewList.find((v) => v.value === authDesktopView);

  if (!(desktopViewList?.length > 1)) return null;

  return (
    <div
      className={`${classes["header__navigation-numbers"]} ${isOpened ? classes["active"] : ""}`}
      ref={viewTypeRef}
      onClick={() => setIsOpened((value) => !value)}
    >
      <ul className={classes["default-option"]}>
        {currentViewDetails && (
          <li>
            <div className={classes["option"]}>
              <span>View:&nbsp;</span>
              {currentViewDetails.label}
            </div>
          </li>
        )}
      </ul>
      <ul className={classes["dropdown"]}>
        {desktopViewList.map((view) => (
          <li key={view.value} onClick={() => onDesktopViewChange(view.value)}>
            <div className={`${classes["option"]} ${classes["decimal"]}`}>{view.label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ViewTypeSelector;

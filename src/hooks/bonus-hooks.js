import { useEffect } from "react";
import { useSelector } from "react-redux";

import { getAuthAccountId, getAuthLanguage } from "../redux/reselect/auth-selector";
import { getAvailablePromotions } from "../redux/slices/bonusSlice";

export function useAvailablePromotions(dispatch) {
  const language = useSelector(getAuthLanguage);
  // const loggedIn = useSelector(getAuthLoggedIn);
  const accountId = useSelector(getAuthAccountId);

  useEffect(() => {
    dispatch(getAvailablePromotions());

    return undefined;
  }, [accountId, dispatch, language]);
}

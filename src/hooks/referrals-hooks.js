import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getReferralReferrals } from "redux/reselect/referrals-selector";
import { getReferrals } from "redux/slices/referralSlice";

export const useGetReferrals = (dispatch) => {
  const language = useSelector(getAuthLanguage);
  const referrals = useSelector(getReferralReferrals);

  useEffect(() => {
    dispatch(getReferrals());
  }, [dispatch, language]);

  return referrals;
};

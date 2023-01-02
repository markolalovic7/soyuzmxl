import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getSecurityQuestions } from "redux/reselect/security-questions-selector";
import { getSecurityQuestion } from "redux/slices/securityQuestionSlice";

export const useGetSecurityQuestion = (dispatch) => {
  const language = useSelector(getAuthLanguage);
  const securityQuestions = useSelector(getSecurityQuestions);

  useEffect(() => {
    dispatch(getSecurityQuestion());
  }, [dispatch, language]);

  return securityQuestions;
};

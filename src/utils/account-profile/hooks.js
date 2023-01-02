import { useEffect, useState } from "react";

export const useFocusOnError = ({ errors, isValid, submitCount }) => {
  const [count, setCount] = useState(submitCount);
  useEffect(() => {
    if (!isValid && submitCount > count) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey && window.document.getElementsByName(firstErrorKey).length) {
        window.document.getElementsByName(firstErrorKey)[0].focus();
      }
      setCount(submitCount);
    }
  }, [submitCount, isValid, errors, count]);
};

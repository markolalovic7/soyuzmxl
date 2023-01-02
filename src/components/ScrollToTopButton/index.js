import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import PropTypes from "prop-types";
import { useState } from "react";

const propTypes = {
  ButtonComponent: PropTypes.func.isRequired,
};

const ScrollToTopButton = ({ ButtonComponent }) => {
  const [isScrollButtonShown, setIsScrollButtonShow] = useState(false);
  const hideScrollButton = () => setIsScrollButtonShow(false);

  useScrollPosition(
    ({ currPos }) => {
      setIsScrollButtonShow(window.innerHeight + currPos.y <= 0);
    },
    [],
    undefined,
    false,
    400,
  );

  return <ButtonComponent isButtonShown={isScrollButtonShown} onClick={hideScrollButton} />;
};

ScrollToTopButton.propTypes = propTypes;

export default ScrollToTopButton;

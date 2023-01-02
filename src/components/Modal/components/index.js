import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import Portal from "utils/portal";

import classes from "../styles/index.module.scss";

const propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const defaultProps = {
  open: false,
};

const Modal = ({ children, onClose, open }) => {
  const backdrop = useRef(null);

  useEffect(() => {
    const { current } = backdrop;

    const clickHandler = (e) => e.target === current && onClose();

    if (current) {
      current.addEventListener("click", clickHandler);
    }

    if (open) {
      window.setTimeout(() => {
        document.activeElement.blur();
        document.body.style.overflow = "hidden";
        document.querySelector("#root").setAttribute("inert", "true");
      }, 10);
    }

    return () => {
      if (current) {
        current.removeEventListener("click", clickHandler);
      }

      document.body.style.overflow = "unset";
      document.querySelector("#root").removeAttribute("inert");
    };
  }, [open, onClose]);

  return (
    open && (
      <Portal>
        <div className={classes["modal-container"]} ref={backdrop}>
          <div className={classes["modal-overlay"]}>
            <div className={classes["modal-content"]}>{children}</div>
          </div>
        </div>
      </Portal>
    )
  );
};

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;

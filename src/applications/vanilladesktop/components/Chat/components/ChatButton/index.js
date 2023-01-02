import PropTypes from "prop-types";

import classes from "../../../../scss/vanilladesktop.module.scss";

const propTypes = {
  onClick: PropTypes.func.isRequired,
};

const ChatButton = ({ onClick }) => (
  <div className={classes["chat"]} onClick={onClick}>
    <div className={classes["chat__icon"]}>
      <svg height="23" viewBox="0 0 25 23" width="25" xmlns="http://www.w3.org/2000/svg">
        <g>
          <g>
            <path d="M6.25 11.25v-2.5h2.5v2.5zm7.5 0h-2.5v-2.5h2.5zm5 0h-2.5v-2.5h2.5zM12.5 0C5.625 0 0 4.475 0 10c0 2.663 1.313 5.088 3.438 6.875-.063.75-.526 2.712-3.438 5.625 0 0 4.438 0 8.088-3.125 1.375.4 2.862.625 4.412.625C19.375 20 25 15.525 25 10S19.375 0 12.5 0z" />
          </g>
        </g>
      </svg>
    </div>
  </div>
);

ChatButton.propTypes = propTypes;

export default ChatButton;

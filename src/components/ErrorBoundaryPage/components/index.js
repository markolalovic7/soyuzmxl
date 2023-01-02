import PropTypes from "prop-types";
import React from "react";

import "./styles/index.css";

const propTypes = {
  children: PropTypes.node.isRequired,
  onActionTap: PropTypes.func,
};

const defaultProps = {
  onActionTap: () => {},
};

class ErrorBoundaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  render() {
    const { children, onActionTap } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return (
        <div className="error-boundary-wrapper">
          <div className="error-boundary-title">Oh no! Something went wrong.</div>
          <div>
            <button className="error-boundary-button" type="button" onClick={onActionTap}>
              Reload
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundaryPage.propTypes = propTypes;
ErrorBoundaryPage.defaultProps = defaultProps;

export default ErrorBoundaryPage;

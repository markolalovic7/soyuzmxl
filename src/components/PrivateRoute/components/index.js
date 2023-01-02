import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Redirect, withRouter } from "react-router";
import { getAuthLoggedIn } from "redux/reselect/auth-selector";
import { getHrefHome } from "utils/route-href";

const propTypes = {
  history: PropTypes.object.isRequired,
  renderAppAuthorized: PropTypes.func.isRequired,
};

const defaultProps = {};

const PrivateRoute = ({ history, renderAppAuthorized }) => {
  const isLoggedIn = useSelector(getAuthLoggedIn);
  if (!isLoggedIn) {
    if (history.location.state?.referrer) {
      return <Redirect to={history.location.state.referrer} />;
    }

    return (
      <Redirect
        to={{
          pathname: getHrefHome(),
          state: {
            referrer: history.location,
          },
        }}
      />
    );
  }

  return renderAppAuthorized();
};

PrivateRoute.propTypes = propTypes;
PrivateRoute.defaultProps = defaultProps;

export default withRouter(PrivateRoute);

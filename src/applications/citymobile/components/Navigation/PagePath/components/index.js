import cx from "classnames";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

import BreadcrumbSVG from "../../../../img/icons/breadcrumb.svg";
import classes from "../../../../scss/citymobile.module.scss";

const PagePath = ({ history, noBottomMargin, paths }) => (
  <div className={cx(classes["breadcrumbs"], { [classes["breadcrumbs__no_bottom_margin"]]: noBottomMargin })}>
    <div className={classes["breadcrumbs__return"]} onClick={() => history.goBack()}>
      <img alt="" src={BreadcrumbSVG} />
    </div>
    <div className={classes["breadcrumbs__body"]}>
      {paths.map((path, index) => {
        const firstItem = index === 0;
        const lastItem = index === paths.length - 1;

        if (firstItem) {
          return (
            <Link className={`${classes["breadcrumbs__item"]}`} key={index} to={path.target}>
              {path.description}
            </Link>
          );
        }
        if (!lastItem) {
          return (
            <Link className={`${classes["breadcrumbs__item"]}`} key={index} to={path.target}>
              <span /> {path.description}
            </Link>
          );
        }

        return (
          <div className={`${classes["breadcrumbs__item"]}`} key={index}>
            <span /> {path.description}
          </div>
        );
      })}
    </div>
  </div>
);

const propTypes = {
  history: PropTypes.object.isRequired,
  noBottomMargin: PropTypes.bool,
  paths: PropTypes.array.isRequired,
};

const defaultProps = { noBottomMargin: false };

PagePath.propTypes = propTypes;
PagePath.defaultProps = defaultProps;

export default withRouter(PagePath);

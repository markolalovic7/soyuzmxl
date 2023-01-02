import { lazy, Suspense } from "react";
import { Route, Switch } from "react-router";

import { getPatternPrematchEvent, getPatternPrematchMain, getPatternSearch } from "utils/route-patterns";

const PrematchPage = lazy(() => import("../PrematchPage"));
const PrematchSearchPage = lazy(() => import("../PrematchSearchPage"));

const propTypes = {};

const defaultProps = {};

// TODO: add `Not Found` page.
const StackPrematch = () => (
  <Suspense fallback={null}>
    <Switch>
      <Route exact component={PrematchSearchPage} path={getPatternSearch()} />
      <Route component={PrematchPage} path={getPatternPrematchEvent()} />
      <Route component={PrematchPage} path={getPatternPrematchMain()} />
    </Switch>
  </Suspense>
);

StackPrematch.propTypes = propTypes;
StackPrematch.defaultProps = defaultProps;

export default StackPrematch;

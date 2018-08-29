/**
 * The component to contain routes.
 */

import * as React from 'react';
import { Switch, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { AppRoutes } from '../../util/AppRoutes';
import Home from '../home/Home';
import Admin from '../admin/Admin';
import Login from '../login/Login';

// Required to make the component "withRouter-enabled".
interface IDummyProps {
}

class Routes extends React.PureComponent<RouteComponentProps<IDummyProps>> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route path={AppRoutes.Home} component={Home} exact={true} />
        <Route path={AppRoutes.Admin} component={Admin} exact={true} />
        <Route path={AppRoutes.Login} component={Login} exact={true} />
        <Redirect to={AppRoutes.Home} />
      </Switch>
    );
  }
}

export default withRouter(Routes);

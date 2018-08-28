/**
 * Application header component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse  } from 'reactstrap';

import { actionCreators } from '../../store/UserHandler';
import { IApplicationState } from '../../store';
import { AppRoutes } from '../../util/AppRoutes';
import { UserModel } from '../../model/UserModel';

import './AppHeader.css';
import logo from '../../img/logo.png';

// Component own properties interface
interface IAppHeaderOwnProps {
  loggedUser: UserModel | undefined;
}

// Component properties type
type AppHeaderProps = 
  IAppHeaderOwnProps & 
  RouteComponentProps<{}> & 
  typeof actionCreators;

/**
 * Interface fot the component state.
 */
interface IAppHeaderState {
  isOpen: boolean;
}

class AppHeader extends React.Component<AppHeaderProps, IAppHeaderState> {
  /**
   * Constructor.
   * 
   * @param props Component properties.
   */
  constructor(props: AppHeaderProps) {
    super(props);
    this.state = {isOpen: false};
  }

  /**
   * Rendering method.
   */
  public render() {
    return (
      <Navbar color='dark' dark={true} expand='md'>
        <NavbarBrand className='app-header-brand'>
          <img alt='Company Logo' src={logo} className='app-header-logo' />
          <span>
            <h3 className='app-header-title ml-4 mb-0'>ShakaCode</h3>
            <h6 className='app-header-title ml-4'>Front-End Test Task</h6>
          </span>
        </NavbarBrand>
        <Nav className='app-header-menu'>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar={true}>
            <NavLink to={AppRoutes.Home} className='nav-link' activeClassName='app-header-active-link' exact={true}>
              Home
            </NavLink>
            <NavLink to={AppRoutes.Admin} className='nav-link' activeClassName='app-header-active-link' exact={true}>
              Admin
            </NavLink>
          </Collapse>
        </Nav>
      </Navbar>
    );
  }

  /**
   * Toggles NavBar meni collapser.
   */
  private toggle = (): void => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  
}

// Redux mapStateToProps function
function mapStateToProps(state: IApplicationState): IAppHeaderOwnProps {
  return {
    loggedUser: state.user.loggedUser,
  };
}

// Redux-and-Router Wrapped component
export default withRouter(connect(mapStateToProps, actionCreators)(AppHeader));

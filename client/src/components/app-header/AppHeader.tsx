/**
 * Application header component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, NavLink, Redirect } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavLink as Link } from 'reactstrap';

import { actionCreators } from '../../store/.';
import { IApplicationState } from '../../store';
import { AppRoutes } from '../../util/AppRoutes';
import { UserModel, RoleEnum  } from '../../model/UserModel';

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
    const isLoggedIn: boolean = (this.props.loggedUser !== undefined);
    const onLoginPage: boolean = (this.props.location.pathname === AppRoutes.Login);
    if (!isLoggedIn && !onLoginPage) {
      return <Redirect to={AppRoutes.Login} />;
    }

    const isAdmin: boolean = 
      (this.props.loggedUser !== undefined && this.props.loggedUser.role === RoleEnum.Admin);
    const greeting: string = (
      this.props.loggedUser !== undefined ? `Hi ${this.props.loggedUser.firstName}!` : '');

    return (
      <Navbar color='dark' dark={true} expand='md'>
        <NavbarBrand className='app-header-brand'>
          <img alt='Company Logo' src={logo} className='app-header-logo' />
          <span>
            <h3 className='app-header-title ml-4 mb-0'>ShakaCode</h3>
            <h6 className='app-header-title ml-4'>Front-End Test Task</h6>
          </span>
        </NavbarBrand>
        {!onLoginPage && 
        <Nav className='app-header-menu w-100'>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar={true}>
            <NavLink to={AppRoutes.Home} className='nav-link' activeClassName='app-header-active-link' exact={true}>
              Home
            </NavLink>
            {isAdmin &&
            <NavLink to={AppRoutes.Admin} className='nav-link' activeClassName='app-header-active-link' exact={true}>
              Admin
            </NavLink>
            }
            <Nav className='justify-content-end w-100'>
              <h5 className='app_header_greeting mr-4 mb-0'>{greeting}</h5>
              <Link onClick={this.logout} href='\' className='nav-link'>
                Logout
              </Link>
            </Nav>
          </Collapse>
        </Nav>
        }
      </Navbar>
    );
  }

  /**
   * Toggles NavBar menu collapser.
   */
  private toggle = (): void => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  
  /**
   * Logs user out.
   */
  private logout = (e: React.MouseEvent): void => {
    e.preventDefault();

    // TO DO: call logout API
    this.props.clearUser();
    this.props.clearAuthTokens();
    
    this.props.history.push(AppRoutes.Login);
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

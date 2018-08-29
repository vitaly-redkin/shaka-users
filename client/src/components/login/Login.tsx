/**
 * The Home component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'reactstrap';

import { actionCreators } from '../../store/.';
import { AppRoutes } from '../../util/AppRoutes';
import { LoginService, ILoginResult } from '../../service/LoginService';

import './Login.css';

// Component properties type
type LoginProps = 
  RouteComponentProps<{}> & 
  typeof actionCreators;

/**
 * Class for the component state.
 */
class LoginState {
  public error: string;

  public loginEmail: string;
  public loginPassword: string;

  public registerLogin: string;
  public registerPassword: string;
  public registerPassword2: string;
  public registerFirstName: string;
  public registerLastName: string;
}

class Login extends React.Component<LoginProps, LoginState> {
  private loginFormElement: HTMLFormElement;

  /**
   * Constructor.
   * Sets initial state.
   */
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      error: '',

      loginEmail: '',
      loginPassword: '',
    
      registerLogin: '',
      registerPassword: '',
      registerPassword2: '',
      registerFirstName: '',
      registerLastName: '',
    };
  }

  /**
   * Renders component.
   */
  public render(): JSX.Element {
    return (
      <Container className='login-container mt-2'>
        <Row className='mb-4'>
          <Col>
            <h2>Welcome to ShakaCode Test Task!</h2>
            <h5 className='mt-4'>Please register (or login if you are already registered) first</h5>
            <hr/>
          </Col>
        </Row>
        <Row className='mt-4'>
          <Col>
            <form ref={this.setLoginFormRef} onSubmit={this.onLogin}>
              <label htmlFor='loginEmail'>E-mail:</label>
              <br/>
              <input type='email' id='loginEmail' required={true} 
                     onChange={(e): void => { this.onInputChange('loginEmail', e); }} />
              <br/>
              <label htmlFor='loginPassword'>Password:</label>
              <br/>
              <input type='password' id='loginPassword' required={true}
                     onChange={(e): void => { this.onInputChange('loginPassword', e); }} />
              <br/>
              <hr/>
              <Button color='primary' disabled={!this.isLoginFormValid()} type='submit'>
                Login
              </Button>
              {this.state.error !== '' &&
                <Alert color='danger' className='mt-4'>{this.state.error}</Alert>
              }
            </form>
          </Col>
        </Row>
        <Row className='mt-4'>
          <Col>
            *Note: The very first registered user will be assigned admin rights automatically - so move fast!
            {JSON.stringify(this.state)}
          </Col>
        </Row>
      </Container>
    );
  }

  /**
   * Sets state property with the input current calue.
   * 
   * @param propName Name of the state property to set
   * @param e Event arguments to extract the value from
   */
    private onInputChange(propName: string, e: React.ChangeEvent<HTMLInputElement>) {
      const value: string = e.target.value.trim();
      const newState: LoginState = {...this.state};
      newState[propName] = value;
      this.setState(newState);
  }

  /**
   * Sets reference to the login form element.
   */
  private setLoginFormRef = (ref: HTMLFormElement): void => {
    this.loginFormElement = ref;
  }

  /**
   * Returns true if the Login form is valid.
   */
  private isLoginFormValid = (): boolean => {
    return (!this.loginFormElement || this.loginFormElement.checkValidity());
  }

  /**
   * Logs in.
   */
  private onLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!this.isLoginFormValid()) {
      return;
    }
    
    new LoginService().login(
      this.state.loginEmail,
      this.state.loginPassword,
      this.onLoginSuccess,
      this.onServiceError
    );
  }

  /**
   * Redirects to the Home page.
   */
  private redirectToHome = (): void => {
    this.props.history.push(AppRoutes.Home);
  }

  /**
   * Handles successful login event.
   * 
   * @param authTokens User authenticaton tokens to set
   * @param user User details to set
   */
  private onLoginSuccess = (result: ILoginResult) => {
    this.props.setUser(result.user);
    this.props.setAuthTokens(result.authTokens);
    this.redirectToHome();
  }

  /**
   * Handles service event.
   * 
   * @param error Error message
   */
  private onServiceError = (error: Error) => {
    this.setState({error: error.message});
    console.log(error.stack);
  }
}

// Redux-Wrapped component
export default withRouter(connect(null , actionCreators)(Login));

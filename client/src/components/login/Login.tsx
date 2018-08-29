/**
 * The Home component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'reactstrap';

import { actionCreators } from '../../store/.';
import { AppRoutes } from '../../util/AppRoutes';
import { UserService, ILoginResult } from '../../service/UserService';

import './Login.css';

// Component properties type
type LoginProps = 
  RouteComponentProps<{}> & 
  typeof actionCreators;

/**
 * Class for the component state.
 */
class LoginState {
  public loginError: string;
  public registerError: string;

  public loginEmail: string;
  public loginPassword: string;

  public registerEmail: string;
  public registerPassword: string;
  public registerPassword2: string;
  public registerFirstName: string;
  public registerLastName: string;
}

class Login extends React.Component<LoginProps, LoginState> {
  private loginFormElement: HTMLFormElement;
  private registerFormElement: HTMLFormElement;

  /**
   * Constructor.
   * Sets initial state.
   */
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      loginError: '',
      registerError: '',

      loginEmail: '',
      loginPassword: '',
    
      registerEmail: '',
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
          <Col className='col-5'>
            <form ref={this.setLoginFormRef} onSubmit={this.onLogin}>
              <Row>
                <Col>
                  <h4>Login</h4>
                  <hr/>
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor='loginEmail'>E-mail:</label>
                </Col>
                <Col>
                  <input type='email' id='loginEmail' required={true} 
                      onChange={(e): void => { this.onInputChange('loginEmail', e); }} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor='loginPassword'>Password:</label>
                </Col>
                <Col>
                  <input type='password' id='loginPassword' required={true}
                      onChange={(e): void => { this.onInputChange('loginPassword', e); }} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <hr/>
                  <Button color='primary' disabled={!this.isLoginFormValid()} type='submit'>
                    Login
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  {this.state.loginError !== '' &&
                  <Alert color='danger' className='mt-4'>{this.state.loginError}</Alert>
                  }
                  </Col>
              </Row>
            </form>
          </Col>
          
          <Col className='col-2'>&nbsp;</Col>

          <Col className='col-5'>
            <form ref={this.setRegisterFormRef} onSubmit={this.onRegister}>
              <Row>
                <Col>
                  <h4>Register</h4>
                  <hr/>
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor='registerEmail'>E-mail:</label>
                </Col>
                <Col>
                  <input type='email' id='registerEmail' required={true} 
                      onChange={(e): void => { this.onInputChange('registerEmail', e); }} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor='registerPassword'>Password:</label>
                </Col>
                <Col>
                  <input type='password' id='registerPassword' required={true}
                      onChange={(e): void => { this.onInputChange('registerPassword', e); }} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor='registerPassword2'>Repeat password:</label>
                </Col>
                <Col>
                  <input type='password' id='registerPassword2' required={true}
                      onChange={(e): void => { this.onInputChange('registerPassword2', e); }} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor='registerFirstName'>First name:</label>
                </Col>
                <Col>
                  <input type='text' id='registerFirstName' required={true}
                      onChange={(e): void => { this.onInputChange('registerFirstName', e); }} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor='registerLastName'>Last name:</label>
                </Col>
                <Col>
                  <input type='text' id='registerLastName' required={true}
                      onChange={(e): void => { this.onInputChange('registerLastName', e); }} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <hr/>
                  <Button color='primary' disabled={!this.isRegisterFormValid()} type='submit'>
                    Register
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  {this.state.registerError !== '' &&
                  <Alert color='danger' className='mt-4'>{this.state.registerError}</Alert>
                  }
                  </Col>
              </Row>
              <Row className='mt-4'>
                <Col>
                  *Note: The very first registered user will be assigned admin rights automatically - so move fast!
                </Col>
              </Row>
            </form>
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
    
    new UserService().login(
      this.state.loginEmail,
      this.state.loginPassword,
      this.onSuccess,
      this.onLoginError
    );
  }

  /**
   * Sets reference to the register form element.
   */
  private setRegisterFormRef = (ref: HTMLFormElement): void => {
    this.registerFormElement = ref;
  }

  /**
   * Returns true if the Register form is valid.
   */
  private isRegisterFormValid = (): boolean => {
    return (
      (!this.registerFormElement || this.registerFormElement.checkValidity()) &&
      (this.state.registerPassword === this.state.registerPassword2)
    );
  }

  /**
   * Register a new user.
   */
  private onRegister = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!this.isRegisterFormValid()) {
      return;
    }
    
    new UserService().register(
      this.state.registerEmail,
      this.state.registerPassword,
      this.state.registerFirstName,
      this.state.registerLastName,
      this.onSuccess,
      this.onRegisterError
    );
  }
  /**
   * Redirects to the Home page.
   */
  private redirectToHome = (): void => {
    this.props.history.push(AppRoutes.Home);
  }

  /**
   * Handles successful login/register event.
   * 
   * @param authTokens User authenticaton tokens to set
   * @param user User details to set
   */
  private onSuccess = (result: ILoginResult) => {
    this.props.setUser(result.user);
    this.props.setAuthTokens(result.authTokens);
    this.redirectToHome();
  }

  /**
   * Handles login error.
   * 
   * @param error Error message
   */
  private onLoginError = (error: Error) => {
    this.setState({loginError: error.message});
    console.log(error.stack);
  }

  /**
   * Handles register error.
   * 
   * @param error Error message
   */
  private onRegisterError = (error: Error) => {
    this.setState({registerError: error.message});
    console.log(error.stack);
  }}

// Redux-Wrapped component
export default withRouter(connect(null , actionCreators)(Login));

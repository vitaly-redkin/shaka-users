/**
 * The User Modal component.
 */

import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter,  Row, Col, Button } from 'reactstrap';

import { UserModel, RoleEnum } from '../../model/UserModel';

import './UserModal.css';

// Component own properties interface
interface IUserModalProps {
    user: UserModel;
    isNewUser: boolean;
    isOpen: boolean;
    toggler: Function;
    saveUser: Function;
    deleteUser: Function;
}

// Component own state class
class UserModalState {
  public email: string;
  public password: string;
  public password2: string;
  public firstName: string;
  public lastName: string;
  public role: RoleEnum;
}

class UserModal extends React.PureComponent<IUserModalProps, UserModalState> {
  private formElement: HTMLFormElement;
  
  /**
   * Constructor.
   * Sets initial state.
   * 
   * @param props Component properties.
   */
  constructor(props: IUserModalProps) {
    super(props);

    const state: UserModalState = this.convertPropsToState(props);
    this.state = {...state};
  }

  public componentWillReceiveProps(newProps: IUserModalProps): void {
    const state: UserModalState = this.convertPropsToState(newProps);
    this.setState({...state});
  }

  /**
   * Rendering method.
   */
  public render(): JSX.Element {
    const isNew: boolean = this.props.isNewUser;

    const passwordGroup: JSX.Element = (
      <React.Fragment>
        {!isNew && (
          <Row>
            <Col colSpan={2}>
              <hr/>
            </Col>
          </Row>
        )
        }
        <Row>
          <Col>
            <label htmlFor='password'>Password:</label>
          </Col>
          <Col>
            <input type='password' id='password' required={isNew}
              onChange={(e): void => { this.onInputChange('password', e); }} />
          </Col>
        </Row>
        <Row>
          <Col>
            <label htmlFor='password2'>Repeat password:</label>
          </Col>
          <Col>
            <input type='password' id='password2' required={isNew}
              onChange={(e): void => { this.onInputChange('password2', e); }} />
          </Col>
        </Row>
        {!isNew && (
          <Row>
            <Col colSpan={2} className='user-modal-password-note text-center mt-2'>
              Set passwords only if you want to change them
            </Col>
          </Row>
        )
        }
      </React.Fragment>
    );

    return (
      <Modal 
        isOpen={this.props.isOpen} 
        toggle={this.toggler} 
        className='user-modal'
        centered={true}
        autoFocus={true}
      >
        <form ref={this.setFormRef} onSubmit={this.onSubmit}>
          <ModalHeader toggle={this.toggler}>
            {this.title}
          </ModalHeader>

          <ModalBody>
            <Row>
              <Col>
                <label htmlFor='email'>E-mail:</label>
              </Col>
              <Col>
                <input type='email' id='email' required={true} disabled={!isNew}
                  defaultValue={this.props.user.email}
                  onChange={(e): void => { this.onInputChange('email', e); }} />
              </Col>
            </Row>
            {isNew && passwordGroup}
            <Row>
              <Col>
                <label htmlFor='firstName'>First name:</label>
              </Col>
              <Col>
                <input type='text' id='firstName' required={true}
                  defaultValue={this.props.user.firstName}
                  onChange={(e): void => { this.onInputChange('firstName', e); }} />
              </Col>
            </Row>
            <Row>
              <Col>
                <label htmlFor='lastName'>Last name:</label>
              </Col>
              <Col>
                <input type='text' id='lastName' required={true}
                  defaultValue={this.props.user.lastName}
                  onChange={(e): void => { this.onInputChange('lastName', e); }} />
              </Col>
            </Row>
            <Row>
              <Col>
                <label htmlFor='role'>Role:</label>
              </Col>
              <Col>
                <select id='role' className='user-modal-select' required={true} 
                  defaultValue={this.props.user.role}
                  onChange={(e): void => { this.onInputChange('role', e); }}
                >
                  <option value={RoleEnum.Admin}>{RoleEnum.Admin}</option>
                  <option value={RoleEnum.User}>{RoleEnum.User}</option>
                </select>
              </Col>
            </Row>
            {!isNew && passwordGroup}
          </ModalBody>

          <ModalFooter>
            <Button color='secondary' onClick={this.toggler} className='user-modal-button'>
              Cancel
            </Button>
            {!isNew && 
            <Button 
              type='button'
              color='danger' 
              className='user-modal-button'
              onClick={this.onDelete}>
              Delete
            </Button>
            }
            <Button 
              type='submit'
              color='primary' 
              className='user-modal-button'
              onClick={this.onSubmit} 
              disabled={!this.isFormValid()}>
              {this.submitButtonCaption}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }

  /**
   * Modal title.
   */
  private get title(): string {
    return (this.props.isNewUser ? 'Create New User' : 'Edit User');
  }

  /**
   * Caption for the submit button.
   */
  private get submitButtonCaption(): string {
    return (this.props.isNewUser ? 'Create' : 'Save');
  }

  /**
   * Sets state property with the input current value.
   * 
   * @param propName Name of the state property to set
   * @param e Event arguments to extract the value from
   */
  private onInputChange(
    propName: string, 
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const value: string = e.target.value.trim();
    const newState: UserModalState = {...this.state};
    newState[propName] = value;
    this.setState(newState);
  }

  /**
   * Toggles modal.
   */
  private toggler = (): void => {
    this.props.toggler();
  }

  /**
   * Submit user.
   */
  private onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!this.isFormValid()) {
      return;
    }

    const user: UserModel = new UserModel(
      this.state.email,
      this.state.password,
      this.state.firstName,
      this.state.lastName,
      this.state.role
    );
    this.props.saveUser(user, this.props.isNewUser);
    this.props.toggler();
  }

  /**
   * Deletes user.
   */
  private onDelete = (e: React.FormEvent): void => {
    e.preventDefault();
    this.props.deleteUser(this.props.user.email);
    this.props.toggler();
  }

  /**
   * Sets reference to the form element.
   */
  private setFormRef = (ref: HTMLFormElement): void => {
    this.formElement = ref;
  }

  /**
   * Returns true if the form is valid.
   */
  private isFormValid = (): boolean => {
    return (
      (!this.formElement || this.formElement.checkValidity()) &&
      (this.state.password === this.state.password2)
    );
  }

  /**
   * Converts props to state.
   * 
   * @param props Component properties to convert into state
   * @returns state derived from properties
   */
  private convertPropsToState = (props: IUserModalProps): UserModalState => {
    return {
      email: props.user.email,
      password: '',
      password2: '',
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      role: props.user.role,
    };
  }
}

export default UserModal;

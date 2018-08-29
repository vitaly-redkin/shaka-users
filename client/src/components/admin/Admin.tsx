/**
 * The Admin component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Alert } from 'reactstrap';
import { DataTable } from 'primereact/datatable';
import { Button as PrButton } from 'primereact/button';
import { Column } from 'primereact/column';

import { IApplicationState } from '../../store';
import { UserModel } from '../../model/UserModel';
import { AuthTokenModel } from '../../model/AuthTokenModel';
import { UserService, IUserDeleteResult } from '../../service/UserService';
import UserModal from '../user-modal/UserModal';

import './Admin.css';

// Component own properties interface
interface IAdminOwnProps {
    loggedUser: UserModel | undefined;
    authTokens: AuthTokenModel;
}

// Component satte interface
interface IAdminState {
  users: UserModel[] | undefined;
  error: string;
  isLoading: boolean;
  isUserModalOpen: boolean;
  isNewUser: boolean;
  selectedUser: UserModel | undefined;
  editedUser: UserModel;
}

class Admin extends React.PureComponent<IAdminOwnProps, IAdminState> {
  private hasBeenUnmounted: boolean = false;

  /**
   * Constructor.
   * Sets initial state.
   * 
   * @param props component properties
   */
  constructor(props: IAdminOwnProps) {
    super(props);

    this.state = {
      users: undefined,
      error: '',
      isLoading: true,
      isUserModalOpen: false,
      isNewUser: false,
      selectedUser: undefined,
      editedUser: new UserModel(),
    };
  }

  /**
   * Called when component is mounted.
   */
  public componentDidMount() {
    this.loadData();
  }

  /**
   * Called when component is mounted.
   */
  public componentWillUnmount() {
    this.hasBeenUnmounted = true;
  }

  /**
   * Rendering method.
   */
  public render(): JSX.Element {
    return (
      <Container>
        <Row>
          <Col>
            <h3>Users</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.renderContent()}
          </Col>
        </Row>
      </Container>
    );
  }

  /**
   * Renders page content.
   */
  private renderContent(): JSX.Element {
    if (this.state.isLoading) {
      return (
        <Alert color='warning'>Loading...</Alert>
      );
    } else if (this.state.error !== '') {
      return (
        <Alert color='danger'>{this.state.error}</Alert>
      );
    }

    const footer = (
      <div className='p-clearfix w-100'>
        <PrButton style={{float: 'left'}} icon='pi pi-plus' label='Add' onClick={this.addNewUser}/>
      </div>
    );    

    return (
      <React.Fragment>
        <DataTable value={this.state.users} paginator={true} rows={10} footer={footer}
          selectionMode='single' selection={this.state.selectedUser} 
          onSelectionChange={this.setSelectedUser}
          onRowSelect={this.editUser}
        >
          <Column field='email' header='E-mail' filter={true} sortable={true} />
          <Column field='firstName' header='First Name' filter={true} sortable={true} />
          <Column field='lastName' header='Last Name' filter={true} sortable={true} />
          <Column field='role' header='Role' filter={true} sortable={true} />
        </DataTable>

        <UserModal 
          user={this.state.editedUser} 
          isNewUser={this.state.isNewUser}
          isOpen={this.state.isUserModalOpen}
          toggler={this.toggleUserModal}
          saveUser={this.saveUser}
          deleteUser={this.deleteUser}
        />
      </React.Fragment>
    );
  }

  /**
   * Loads page data.
   */
  private loadData = (): void => {
    this.setState({error: '', isLoading: true});

    new UserService().getUserList(
      this.props.authTokens,
      this.onDataLoadSuccess,
      this.onDataLoadError
    );
  }

  /**
   * Data loading success handler.
   * 
   * @param users List of users to show
   */
  private onDataLoadSuccess = (users: UserModel[]): void => {
    if (!this.hasBeenUnmounted) {
      this.setState({users: users, error: '', isLoading: false});
    }
  }

  /**
   * Data loading error handler.
   * 
   * @param error Loading error
   */
  private onDataLoadError = (error: Error): void => {
    if (!this.hasBeenUnmounted) {
      this.setState({users: undefined, error: error.message, isLoading: false});
    }
  }

  /**
   * Toggles user modal.
   */
  private toggleUserModal = (): void => {
    this.setState((prevState: IAdminState) => { 
      return {isUserModalOpen: !prevState.isUserModalOpen}; 
    });
  }  

  /**
   * Sets selected user.
   */
  private setSelectedUser = (e: object): void => {
    this.setState({
      //tslint:disable
      selectedUser: e['data']
      //tslint:enable
    });
  }
  /**
   * Adds new user.
   */
  private addNewUser = (): void => {
    this.setState({
      isUserModalOpen: true,
      isNewUser: true,
      editedUser: new UserModel()
    });
  }

  /**
   * Edits existing user.
   */
  private editUser = (e: object): void => {
    //tslint:disable
    const user: UserModel = {...e['data'], password: ''};
    //tslint:enable
    this.setState({
      isUserModalOpen: true,
      isNewUser: false,
      editedUser: user 
    });
  }

  /**
   * Saves user.
   * 
   * @param user User properties
   * @param isNewUser true if this is a new user to create
   */
  private saveUser = (user: UserModel, isNewUser: boolean): void => {
    new UserService().saveUser(
      user,
      isNewUser,
      this.props.authTokens,
      this.onSaveUserSuccess,
      this.onServiceCallError
    );
  }

  /**
   * Deletes user.
   * 
   * @param email E-mail of the user to delete
   */
  private deleteUser = (email: string): void => {
    new UserService().deleteUser(
      email,
      this.props.authTokens,
      this.onDeleteUserSuccess,
      this.onServiceCallError
    );
  }

  /**
   * Handler for the user save success event.
   * 
   * @param user User details
   */
  private onSaveUserSuccess = (user: UserModel): void => {
    const users: UserModel[] = this.state.users!;
    const isNewUser: boolean = (users.findIndex((u: UserModel) => u.email === user.email) < 0);
    const newUsers: UserModel[] = (
      isNewUser ? 
      users.concat(user) :
      users.map((u: UserModel) => (u.email === user.email ? user : u))
    );
    this.setState({users: newUsers});
  }

  /**
   * Handler for the user delete success event.
   * 
   * @param result Object with email of deleted user
   */
  private onDeleteUserSuccess = (result: IUserDeleteResult): void => {
    const newUsers: UserModel[] = this.state.users!.filter(
      (u: UserModel) => u.email !== result.email);
    this.setState({users: newUsers});
  }

  /**
   * Handler for the service call error event.
   * 
   * @param error Error to handle
   */
  private onServiceCallError = (error: Error): void => {
    console.log(error);
    alert('Error occurred - check console for details');
  }
}

// Redux mapStateToProps function
function mapStateToProps(state: IApplicationState): IAdminOwnProps {
  return {
    loggedUser: state.user.loggedUser,
    authTokens: state.authTokens.authTokens
  };
}

// Redux-Wrapped component
export default connect(mapStateToProps)(Admin);

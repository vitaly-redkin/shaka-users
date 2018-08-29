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
import { UserService } from '../../service/UserService';
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
      <DataTable value={this.state.users} paginator={true} rows={5} footer={footer}>
          <Column field='email' header='E-mail' filter={true} sortable={true} />
          <Column field='firstName' header='First Name' filter={true} sortable={true} />
          <Column field='lastName' header='Last Name' filter={true} sortable={true} />
          <Column field='role' header='Role' filter={true} sortable={true} />
      </DataTable>

      {this.renderEditDialog()}
    );
  }

  /**
   * Renders user edit dialog.
   */
  private renderEditDialog(): JSX.Element {
    return (
      <UserModal 
        user={this.state.editedUser} 
        isNew={this.state.isNewUser}
        isOpen={this.state.isUserModalOpen}
        toggler={this.toggleUserModal}
        saveUser={this.saveUser}
        deleteUser={this.deleteUser}
      />
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
   * Adds new user.
   */
  private addNewUser = (): void => {
    this.setState({
      isUserModalOpen: true,
      isNewUser: true,
      editedUser: new UserModel()
    });
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

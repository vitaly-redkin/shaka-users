/**
 * The Admin component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';

import { IApplicationState } from '../../store';
import { UserModel } from '../../model/UserModel';

import './Admin.css';

// Component own properties interface
interface IAdminOwnProps {
    loggedUser: UserModel | undefined;
}

// Component properties type
type AdminProps = 
  IAdminOwnProps;

class Admin extends React.PureComponent<AdminProps> {
  /**
   * Rendering method.
   */
  public render(): JSX.Element {
    return (
      <Container className='home-container mt-1'>
        <Row>
          <Col>
            This is an Admin page - Aloha!
          </Col>
        </Row>
      </Container>
    );
  }
}

// Redux mapStateToProps function
function mapStateToProps(state: IApplicationState): IAdminOwnProps {
  return {
    loggedUser: state.user.loggedUser,
  };
}

// Redux-Wrapped component
export default connect(mapStateToProps)(Admin);

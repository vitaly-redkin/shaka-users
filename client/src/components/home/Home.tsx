/**
 * The Home component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';

import { actionCreators } from '../../store/UserHandler';
import { IApplicationState } from '../../store';
import { UserModel } from '../../model/UserModel';

import './Home.css';

// Component own properties interface
interface IHomeOwnProps {
    loggedUser: UserModel | undefined;
}

// Component properties type
type HomeProps = 
  IHomeOwnProps & 
  typeof actionCreators;

class Home extends React.Component<HomeProps> {
  /**
   * Renders component.
   */
  public render(): JSX.Element {
    return (
      <Container className='home-container mt-1'>
        <Row>
          <Col>
            This is a Home page - Aloha!
          </Col>
        </Row>
      </Container>
    );
  }

}

// Redux mapStateToProps function
function mapStateToProps(state: IApplicationState): IHomeOwnProps {
  return {
    loggedUser: state.user.loggedUser, 
  };
}

// Redux-Wrapped component
export default connect(mapStateToProps, actionCreators)(Home);

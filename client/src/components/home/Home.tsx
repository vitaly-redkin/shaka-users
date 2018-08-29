/**
 * The Home component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';

import { IApplicationState } from '../../store';
import { UserModel, RoleEnum } from '../../model/UserModel';

import './Home.css';

// Component own properties interface
interface IHomeOwnProps {
    loggedUser: UserModel | undefined;
}

class Home extends React.Component<IHomeOwnProps> {
  /**
   * Renders component.
   */
  public render(): JSX.Element {
    if (this.props.loggedUser === undefined) {
      return (<div/>);
    }

    const user: UserModel = this.props.loggedUser;
    const roleGreeting: string = (
      user.role === RoleEnum.Admin ?
      'Congratulations! You one of the few who are choosen - you are the ADMIN!' :
      'Nice to see you but you not the one we are trust to be the admin...'
    );

    return (
      <Container className='home-container mt-1'>
        <Row>
          <Col>
            <h4>Aloha {user.firstName},</h4>
            {roleGreeting}
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
export default connect(mapStateToProps)(Home);

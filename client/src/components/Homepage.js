import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Homepage.css';
import { logoutUser } from '../actions/user';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    this.authListener = firebase.auth.onAuthStateChanged(async (user) => {
      const cookies = new Cookies();
      if (user) {
        this.setState({ authUser: user });
        cookies.set('authToken', await user.getIdToken(), {
          sameSite: true,
          maxAge: 28800,
          // secure: true,
        });
      } else {
        cookies.set('authToken', null);
      }
    });
  }

  componentWillUnmount() {
    this.authListener();
  }

  signOut() {
    const { history, logoutUserProp, firebase } = this.props;
    this.setState({ authUser: null });
    firebase.doSignOut();
    logoutUserProp();
    history.push('/');
  }

  render() {
    const { authUser } = this.state;
    const { history } = this.props;
    const buttons = (authUser) ? (
      <div className="col" style={{ textAlign: 'center' }}>
        <Button color="primary" size="lg" onClick={() => history.push('/lobby')}>Find a Lobby</Button>
        <Button color="danger" size="lg" className="ml-4" onClick={() => this.signOut()}>Sign Out</Button>
      </div>
    ) : (
      <div className="col" style={{ textAlign: 'center' }}>
        <Button color="success" size="lg" onClick={() => history.push('/auth')}>Play</Button>
      </div>
    );
    return (
      <div className="cover">
        <div className="container" style={{ marginTop: '15em' }}>
          <header>
            <h1>MAGIC MAZE</h1>
            <div className="logo">
              <span role="img" aria-label="arrow">🏹</span>
              <span role="img" aria-label="sword">⚔️</span>
              <span role="img" aria-label="magic">🎩</span>
              <span role="img" aria-label="gun">🔫</span>
            </div>
          </header>
          <div className="row">
            {buttons}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  firebase: state.firebaseReducer.firebaseInst,
});

const mapDispatchToProps = dispatch => ({
  logoutUserProp: () => dispatch(logoutUser()),
});

Homepage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  logoutUserProp: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  firebase: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);

import React, { Component } from 'react';
import {
  Table, Card, CardHeader, CardBody, CardTitle, CardFooter, Badge, Button,
} from 'reactstrap';
import { faUsers, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import idx from 'idx';
import Cookies from 'universal-cookie';
import gql from 'graphql-tag';
import client from '../common/utils';
import './Lobby.css';
import Loading from './Loading';
import {
  LOBBY_UPDATED_QUERY,
  LOBBY_USERS_UPDATED_QUERY,
  CREATED_GAMESTATE_QUERY,
} from '../common/queries';
import { toast } from 'react-toastify';

library.add([
  faUsers,
  faDoorOpen,
]);

const GET_LOBBIES = gql`
{
  lobbies {
    _id
    users {
      uid
      username
    }
  }
}
`;

let lobbySub;
let gameSub;
let lobbiesSub;

/**
 * Not sure what states you want to fill that in. Redux states are passed into
 * the component as props. So this will be the main lobby screen or you can rename it
 * but here should display all possible lobbies to join and then there should be a
 * way for the user to join the lobby and you can display something else to show
 * they are in the lobby and that sort of stuff
 */
class Lobby extends Component {
  constructor(props) {
    super(props);
    const cookies = new Cookies();
    const authToken = cookies.get('authToken');
    this.state = {
      lobbyList: [],
      currentUser: null,
      currentLobby: null,
      loading: true,
      authToken,
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    this.authListener = firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        client(this.state.authToken).query({ query: GET_LOBBIES }).then((results) => {
          this.setState({
            currentUser: user,
            currentLobby: this.getCurrentLobby(user.uid, results.data.lobbies),
            lobbyList: results.data.lobbies,
            loading: false,
          });
        });
      }
    })
    this.authListener();
    ;
    
    // update lobby list
    lobbiesSub = client(this.state.authToken).subscribe({ query: LOBBY_UPDATED_QUERY })
      .subscribe((results) => {
        this.setState({
          lobbyList: results.data.lobbiesUpdated,
        });
      });
  }

  componentWillUnmount() {
    if (this.authListener) this.authListener = null;
    this.unsubscribeToLobby();
    if (lobbiesSub) { lobbiesSub.unsubscribe(); lobbiesSub = null; }
  }

  getCurrentLobby = (userID, lobbyList) => {
    let res = null;

    lobbyList.forEach(lobby => {
      if (lobby.users.some(x => x.uid === userID)) {
        res = lobby;
        this.subscribeToLobby(lobby._id);
      }
    });
    return res;
  }

  subscribeToLobby = (lobbyID) => {
    lobbySub = client(this.state.authToken).subscribe({ query: LOBBY_USERS_UPDATED_QUERY(lobbyID), variables: { lobbyID } })
      .subscribe((results) => {
        this.setState({
          currentLobby: results.data.lobbyUsersUpdated,
        });
      });
    // subscription for when gamestate is created
    gameSub = client(this.state.authToken).subscribe({ query: CREATED_GAMESTATE_QUERY(lobbyID), variables: { lobbyID } })
      .subscribe((results) => {
        this.setGameStateCookie(results.data.createdGameState);
        this.props.history.push('/board');
      });
  }

  unsubscribeToLobby = () => {
    if (lobbySub) { lobbySub.unsubscribe(); lobbySub = null; }
    if (gameSub) { gameSub.unsubscribe(); gameSub = null; }
  }

  deleteLobby = (lobbyID, userID) => {
    const { currentLobby, currentUser } = this.state;

    const mutation = gql`
      mutation {
        deleteLobby(lobbyID: "${lobbyID}", userID: "${userID}")
      }
    `;

    if (currentLobby.users[0].uid === currentUser.uid && currentLobby.users.length === 1) {
      client(this.state.authToken).mutate({ mutation: mutation }).then(() => {
        this.setState({
          currentLobby: null,
        });
        this.unsubscribeToLobby();
      });
    } else {
      toast.error('🚫 cannot delete a lobby that still has remaining users', {
        position: 'bottom-right',
      });
    }
  }

  leaveLobby = (lobbyID, userID, callback) => {
    const { currentLobby, currentUser } = this.state;

    const mutation = gql`
      mutation {
        leaveLobby(userID: "${userID}", lobbyID: "${lobbyID}")
      }
    `;
    if (currentLobby.users[0].uid === currentUser.uid) {
      this.deleteLobby(lobbyID, userID);
    } else {
      client(this.state.authToken).mutate({ mutation: mutation }).then(() => {
        this.setState({ currentLobby: null });
        this.unsubscribeToLobby();
        if (callback) callback();
      });
    }
  }

  joinLobby = (lobbyID, userID) => {
    const { currentUser } = this.state;
    const currentLobbyID = idx(this.state, _ => _.currentLobby._id);

    const mutation = gql`
      mutation {
        joinLobby(userID: "${userID}", lobbyID: "${lobbyID}") {
          _id
          users {
            uid
            username
          }
        }
      }
    `;
    if (currentLobbyID === lobbyID) {
      toast.error('🚫 cannot join a lobby you are already in', {
        position: 'bottom-right',
      });
    } else {
      if (currentLobbyID) {
        this.leaveLobby(currentLobbyID, currentUser.uid, () => (
          client(this.state.authToken).mutate({ mutation: mutation }).then((results) => {
            this.setState({
              currentLobby: results.data.joinLobby,
            });
            this.subscribeToLobby(results.data.joinLobby._id);
          }).catch(() => (
            toast.error(`🚫 Lobby is full` , {
            position: 'bottom-right',
          })))
        ));
      } else {
        client(this.state.authToken).mutate({ mutation: mutation }).then((results) => {
          this.setState({
            currentLobby: results.data.joinLobby,
          });
          this.subscribeToLobby(results.data.joinLobby._id);
        }).catch(() => (
          toast.error(`🚫 Lobby is full` , {
          position: 'bottom-right',
        })));
      }
    }
  }

  createLobby = (userID) => {
    const { currentUser } = this.state;
    const currentLobbyID = idx(this.state, _ => _.currentLobby._id);
    
    const mutation = gql`
      mutation {
        createLobby(userID: "${userID}") {
          _id
          users {
            uid
            username
          }
        }
      }
    `;
    if (currentLobbyID) {
      this.leaveLobby(currentLobbyID, currentUser.uid, () => (
        client(this.state.authToken).mutate({ mutation: mutation }).then((results) => {
          this.setState({
            currentLobby: results.data.createLobby,
          });
          this.subscribeToLobby(results.data.createLobby._id);
        }).catch(() => (
          toast.error(`🚫 Could not create lobby` , {
          position: 'bottom-right',
        })))
      ));
    } else {
      client(this.state.authToken).mutate({ mutation: mutation }).then((results) => {
        this.setState({
          currentLobby: results.data.createLobby,
        });
        this.subscribeToLobby(results.data.createLobby._id);
      }).catch(() => (
        toast.error(`🚫 Could not create lobby` , {
        position: 'bottom-right',
      })));
    }
  }

  setGameStateCookie = (gameStateID) => {
    const cookies = new Cookies();
    if (gameStateID) {
      cookies.set('gameStateID', gameStateID, {
        sameSite: true,
        maxAge: 28800,
        // secure: true,
      });
    } else {
      cookies.set('gameStateID', null);
    }
  }

  createGameState = (lobbyID) => {
    const mutation = gql`
      mutation {
        createGameState(lobbyID: "${lobbyID}")
      }
    `;
    client(this.state.authToken).mutate({ mutation }).then((results) => {
      this.setGameStateCookie(results.data.createGameState);
      const mutation = gql`
        mutation {
          deleteLobby(lobbyID: "${lobbyID}", userID: "${this.state.currentUser.uid}")
        }
      `;
      client(this.state.authToken).mutate({ mutation: mutation });
      this.props.history.push('/board');
    }).catch((err) => console.error(err));
  }

  render() {
    const { loading, lobbyList, currentUser, currentLobby } = this.state;
    const { history } = this.props;
    const userLobby = currentLobby ? (
      <Card className="bg-dark text-white h-100">
        <CardHeader tag="h3">
          <FontAwesomeIcon icon="users" />
          &nbsp;{currentLobby.users[0].username}'s lobby
        </CardHeader>
        <CardBody>
          <CardTitle>Current Users</CardTitle>
          {
            currentLobby.users.length > 0
              ? currentLobby.users.map(user => (
                <Badge key={user.uid} color={user.uid === currentLobby.users[0].uid ? 'warning' : 'secondary'} className="mr-2" style={{ fontSize: '18px' }}>{user.username}</Badge>
              ))
              : null
          }
        </CardBody>
        <CardFooter style={{ textAlign: 'center' }}>
          <Button
            color="success"
            className="mr-2 mb-1"
            disabled={currentLobby.users.length < 4}
            onClick={() => this.createGameState(currentLobby._id)}>
            Start Game
          </Button>
          <Button color="danger" className="mb-1" onClick={() => this.leaveLobby(currentLobby._id, currentUser.uid)}>Leave Lobby</Button>
        </CardFooter>
      </Card>
    ) : (
      <Card className="bg-dark text-white h-100">
        <CardHeader tag="h3">
          No lobby selected
        </CardHeader>
        <CardBody>
          <CardTitle>You are not currently in a lobby</CardTitle>
          Join a lobby by selecting a pre-existing one from the left or by creating a new one
        </CardBody>
      </Card>
    );

    if (loading) {
      return (<Loading />);
    }

    return (
      <div>
        <div className="cover">
          <div className="container" style={{ marginTop: '10em', marginBottom: '2em' }}>
            <header>
              <h1>FIND A GAME</h1>
            </header>
            <div className="row mt-5">
              <div className="col">
                <Table dark striped hover className="h-100">
                  <thead>
                    <tr>
                      <th>
                        <h3>
                          <FontAwesomeIcon icon="door-open" />
                          &nbsp;Join a lobby
                        </h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      lobbyList.length > 0
                        ? lobbyList.map(lobby => (
                          <tr key={lobby._id}>
                            <td style={{ cursor: 'pointer' }} onClick={() => this.joinLobby(lobby._id, currentUser.uid)}>
                              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div>
                                  <span style={{ fontWeight: 'bold' }}>{lobby.users[0].username}</span>
                                  &apos;s lobby
                                </div>
                                <span>{lobby.users.length}/4</span>
                              </div>
                            </td>
                          </tr>
                        ))
                        : (
                          <tr>
                            <td>No lobbies currently...</td>
                          </tr>
                        )
                    }
                  </tbody>
                </Table>
              </div>
              <div className="col">
                {userLobby}
              </div>
            </div>
            <div className="row mt-5">
              <div className="col" style={{ textAlign: 'center' }}>
                <Button color="primary" size="lg" onClick={() => this.createLobby(currentUser.uid)}>Create Lobby</Button>
                <Button color="secondary" className="ml-3" size="lg" onClick={() => history.push('/')}>Back</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  firebase: state.firebaseReducer.firebaseInst,
});

Lobby.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  firebase: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Lobby);

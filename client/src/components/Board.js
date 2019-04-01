import gql from 'graphql-tag';
import React, { Component } from 'react';
import Viewport from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleUp,
  faArrowCircleDown,
  faArrowCircleLeft,
  faArrowCircleRight,
  faSearch,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button, Modal, ModalHeader,
  ModalBody, ModalFooter,
} from 'reactstrap';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import client from '../common/utils';
import spritesheet from '../assets/spritesheet.png';
import Loading from './Loading';
import Timer from './Timer';
import './Board.css';
import {
  ENDTIME_QUERY,
  CHARACTER_UPDATED_QUERY,
  MAZETILE_UPDATED_QUERY,
  END_GAME_QUERY,
  ITEMS_CLAIMED_QUERY,
} from '../common/queries';
import { rotateList } from '../common/consts';

// constants
const SCALE = 4;
const TILE_SIZE = 16;
const MAZE_SIZE = 64;
const X_OFFSET = 350;
const Y_OFFSET = 80;

// fontawesome
library.add([
  faSearch,
  faArrowCircleUp,
  faArrowCircleDown,
  faArrowCircleLeft,
  faArrowCircleRight,
  faUser,
]);

// PIXI elements
let app;
let viewport;

// maze tile sprites
const spriteList = [
  { url: spritesheet },
  { url: require('../assets/maze/0.png') },
  { url: require('../assets/maze/1.png') },
  { url: require('../assets/maze/2.png') },
  { url: require('../assets/maze/3.png') },
  { url: require('../assets/maze/4.png') },
  { url: require('../assets/maze/5.png') },
  { url: require('../assets/maze/6.png') },
  { url: require('../assets/maze/7.png') },
  { url: require('../assets/maze/8.png') },
  { url: require('../assets/maze/9.png') },
  { url: require('../assets/maze/10.png') },
  { url: require('../assets/maze/11.png') },
];

// card icons
const escalatorIcon = require('../assets/escalator.svg');
const vortexIcon = require('../assets/vortex.svg');

let characterContainer;
let mazeContainer;
let artifactContainer;

let endTimeSub;
let characterUpdatedSub;
let mazeTileUpdatedSub;
let itemsClaimedSub;
let endGameSub;

class Board extends Component {
  constructor(props) {
    super(props);
    const cookies = new Cookies();
    const authToken = cookies.get('authToken');
    this.state = {
      currentUser: null,
      gameStateID: null,
      selected: '',               // selected character colour
      characters: {},             // character objects
      selector: [],               // selector Objects
      gameEndTime: null,    // end time (for timer)
      itemsClaimed: false,        // whether or not all the items have been claimed
      doTick: true,               // whether or not the timer should tick
      gameOver: false,            // whether or not the game is done or not
      users: [],
      actions: [],
      authToken,
    };

    viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });

    app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    app.renderer.backgroundColor = 0x334D5C;
    app.stage.addChild(viewport);
    viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate()
      .on('clicked', this.move);

    // set scale mode (so pixels aren't blurry when scaling)
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    characterContainer = new PIXI.Container();
    mazeContainer = new PIXI.Container();
    artifactContainer = new PIXI.Container();
  }

  componentDidMount() {
    const { firebase } = this.props;

    this.authListener = firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          currentUser: user
        });
      }
    })
    const cookies = new Cookies();
    const gameStateID = cookies.get('gameStateID');
    this.setState({ gameStateID },
      () => {
        const { gameStateID } = this.state;
        document.getElementById('board').appendChild(app.view);
        document.body.style.overflow = 'hidden';
        PIXI.Loader.shared.reset();
        PIXI.Loader.shared
          .add(spriteList)
          .load(this.setup);

        endTimeSub = client(this.state.authToken).subscribe({ query: ENDTIME_QUERY(gameStateID), variables: { gameStateID } })
          .subscribe(time => {
            const rotateActions = rotateList(this.state.actions, 1);
            this.setState({ gameEndTime: new Date(time.data.endTimeUpdated), actions: rotateActions });
          });

        // get colour and set character state
        characterUpdatedSub = client(this.state.authToken).subscribe({ query: CHARACTER_UPDATED_QUERY(gameStateID), variables: { gameStateID } })
          .subscribe((results) => {
            const { characters, selector, currentUser } = this.state;

            const { colour, coordinates, locked, itemClaimed } = results.data.characterUpdated;

            if (results.data.characterUpdated.itemClaimed) {
              if (!characters[colour].itemClaimed) {
                toast.success(`👌🏻 ${colour} item claimed`, {
                  position: 'bottom-right',
                });
              }
            }

            // update character position
            const characterList = characters;
            characterList[colour].x = coordinates.x * TILE_SIZE * SCALE + X_OFFSET;
            characterList[colour].y = coordinates.y * TILE_SIZE * SCALE + Y_OFFSET;
            characterList[colour].itemClaimed = itemClaimed;
            characterList[colour].locked = locked;

            // update selector position
            const selectorObjIndex = selector.findIndex((select) => select.colour === colour);
            selector[selectorObjIndex].x = coordinates.x * TILE_SIZE * SCALE + X_OFFSET;
            selector[selectorObjIndex].y = coordinates.y * TILE_SIZE * SCALE + Y_OFFSET;
            selector[selectorObjIndex].visible = (locked && selectorObjIndex > -1) ? true : false;

            let selected = '';
            for (let key in characterList) {
              if (characterList[key].locked === currentUser.uid) selected = key;
            }
            this.setState({
              selected,
              characters: characterList,
              selector,
            });
          });

        // set add mazeTile
        mazeTileUpdatedSub = client(this.state.authToken).subscribe({ query: MAZETILE_UPDATED_QUERY(gameStateID), variables: { gameStateID: gameStateID } })
          .subscribe((results) => {
            const newTileTexture = new PIXI.Texture(
              PIXI.utils.TextureCache[require(`../assets/maze/${results.data.mazeTileAdded.spriteID}.png`)],
              new PIXI.Rectangle(0, 0, MAZE_SIZE, MAZE_SIZE),
            );
            const newTile = new PIXI.Sprite(newTileTexture);
            // adding a pivot affects the position of the tile
            // must offset by (WIDTH / 2) * SCALE to counteract this
            newTile.x = results.data.mazeTileAdded.cornerCoordinates.x * (TILE_SIZE * SCALE) + X_OFFSET + (MAZE_SIZE / 2) * 4;
            newTile.y = results.data.mazeTileAdded.cornerCoordinates.y * (TILE_SIZE * SCALE) + Y_OFFSET + (MAZE_SIZE / 2) * 4;
            // add pivot in the centre of the tile
            newTile.pivot.set(MAZE_SIZE / 2);
            newTile.scale.set(SCALE, SCALE);
            newTile.angle = results.data.mazeTileAdded.orientation * (-90);
            mazeContainer.addChild(newTile);
          });

        // display message if all items have been claimed
        itemsClaimedSub = client(this.state.authToken).subscribe({ query: ITEMS_CLAIMED_QUERY(gameStateID), variables: { gameStateID: gameStateID } })
          .subscribe(() => {
            toast.info('🙌🏻 all items have been claimed! all vortexes disabled! time to escape!', {
              position: 'bottom-right',
              autoClose: false,
            });
            this.setState({
              itemsClaimed: true,
            });
          });

        // end the game if true
        endGameSub = client(this.state.authToken).subscribe({ query: END_GAME_QUERY(gameStateID), variables: { gameStateID: gameStateID } })
          .subscribe(() => {
            this.setState({
              doTick: false,
              gameOver: true,
            });
          });
      }
    );
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if ((prevProps.gameStateID !== this.props.gameStateID && this.state.currentUser)
  //     || (this.props.gameStateID && prevState.currentUser !== this.state.currentUser)) {
      
  // }

  componentWillUnmount() {
    this.authListener();
    if (endTimeSub) { endTimeSub.unsubscribe(); endTimeSub = null; }
    if (characterUpdatedSub) { characterUpdatedSub.unsubscribe(); characterUpdatedSub = null; }
    if (mazeTileUpdatedSub) { mazeTileUpdatedSub.unsubscribe(); mazeTileUpdatedSub = null; }
    if (itemsClaimedSub) { itemsClaimedSub.unsubscribe(); itemsClaimedSub = null; }
    if (endGameSub) { endGameSub.unsubscribe(); endGameSub = null; }
  }

  /**
   * call backend and do initial setup
   */
  setup = () => {
    const {
      characters,
      gameStateID,
    } = this.state;
    const query = gql`
      {
        gameState(gameStateID: "${gameStateID}") {
          mazeTiles {
            cornerCoordinates {
              x
              y
            }
            spriteID
            orientation
          }
          endTime
          allItemsClaimed
          characters {
            colour
            itemClaimed
            coordinates {
              x
              y
            }
          }
          users {
            uid
            username
          }
          actions
        }
      }
    `;
    client(this.state.authToken).query({ query }).then((results) => {
      // render and create characters
      if (!results.data.gameState) {
        const cookies = new Cookies();
        cookies.set('gameStateID', null);
        this.props.history.push('/');
        return null;
      }
      characters.red = this.createCharacter(3, results.data.gameState.characters.find(x => x.colour === 'red'));
      characters.purple = this.createCharacter(0, results.data.gameState.characters.find(x => x.colour === 'purple'));
      characters.blue = this.createCharacter(1, results.data.gameState.characters.find(x => x.colour === 'blue'));
      characters.green = this.createCharacter(2, results.data.gameState.characters.find(x => x.colour === 'green'));
      // render initial maze tile
      const startTileTexture = new PIXI.Texture(
        PIXI.utils.TextureCache[require('../assets/maze/0.png')],
        new PIXI.Rectangle(0, 0, MAZE_SIZE, MAZE_SIZE),
      );
      const startTile = new PIXI.Sprite(startTileTexture);
      startTile.x = X_OFFSET;
      startTile.y = Y_OFFSET;
      startTile.scale.set(SCALE, SCALE);

      // render pre-existing maze tiles
      const tiles = results.data.gameState.mazeTiles.filter(x => x.cornerCoordinates !== null);
      tiles.forEach((tile) => {
        const texture = new PIXI.Texture(
          PIXI.utils.TextureCache[require(`../assets/maze/${tile.spriteID}.png`)],
          new PIXI.Rectangle(0, 0, MAZE_SIZE, MAZE_SIZE),
        );
        const newTile = new PIXI.Sprite(texture);
        newTile.x = tile.cornerCoordinates.x * (TILE_SIZE * SCALE) + X_OFFSET + (MAZE_SIZE / 2) * 4;
        newTile.y = tile.cornerCoordinates.y * (TILE_SIZE * SCALE) + Y_OFFSET + (MAZE_SIZE / 2) * 4;
        newTile.pivot.set(MAZE_SIZE / 2);
        newTile.scale.set(SCALE, SCALE);
        newTile.angle = tile.orientation * (-90);
        mazeContainer.addChild(newTile);
      });

      // add actors to containers
      // (we do this to manipulate the z-index properly)
      mazeContainer.addChild(startTile);
      characterContainer.addChild(characters.red);
      characterContainer.addChild(characters.purple);
      characterContainer.addChild(characters.blue);
      characterContainer.addChild(characters.green);
      
      // initialize all the selectors
      const selectorTexture = new PIXI.Texture(
        PIXI.utils.TextureCache[spritesheet],
        new PIXI.Rectangle(5 * TILE_SIZE, 4 * TILE_SIZE, TILE_SIZE, TILE_SIZE),
      );
      let selectorList = [];
      results.data.gameState.characters.forEach(character => {
        const selectorObject = new PIXI.Sprite(selectorTexture);
        selectorObject.colour = character.colour;
        selectorObject.x = character.coordinates.x * (TILE_SIZE * SCALE) + X_OFFSET;
        selectorObject.y = character.coordinates.y * (TILE_SIZE * SCALE) + Y_OFFSET;
        selectorObject.visible = false;
        selectorObject.scale.set(SCALE, SCALE);
        artifactContainer.addChild(selectorObject);
        selectorList.push(selectorObject);
      });

      this.setState({
        gameEndTime: new Date(results.data.gameState.endTime),
        itemsClaimed: results.data.gameState.allItemsClaimed,
        users: results.data.gameState.users,
        characters,
        selector: selectorList,
        actions: results.data.gameState.actions,
      });

      // add containers to viewport
      // (cannot add to stage otherwise scrolling will not work)
      viewport.addChild(mazeContainer);
      viewport.addChild(characterContainer);
      viewport.addChild(artifactContainer);
    });
  }

  /**
   * move the selected character based on selected option
   * move algorithm:
   * - calculate the delta between the click and the character's position
   * - convert delta to the number of tile spaces to increase this by
   *     (i.e. this should return the number of tiles moved; integer between 0 and n)
   * - scale up the coordinate to the actual coordinate
   * @param {*} e click event
   */
  move = (e) => {
    const { selected, characters, gameStateID } = this.state;
    if (selected) {
      const endX = characters[selected].x + Math.floor((e.world.x - characters[selected].x)
      / (TILE_SIZE * SCALE)) * (TILE_SIZE * SCALE);
      const endY = characters[selected].y + Math.floor((e.world.y - characters[selected].y)
      / (TILE_SIZE * SCALE)) * (TILE_SIZE * SCALE);

      const deltaX = (endX - X_OFFSET) / (TILE_SIZE * SCALE);
      const deltaY = (endY - Y_OFFSET) / (TILE_SIZE * SCALE);
      const mutation = gql`
        mutation {
          moveCharacter(
            gameStateID: "${gameStateID}",
            userID: "${this.state.currentUser.uid}",
            characterColour: "${selected}",
            endTileCoords:{ x: ${deltaX}, y: ${deltaY} },
          ) {
            _id
            colour
            coordinates {
              x
              y
            }
          }
        }
      `;
      client(this.state.authToken).mutate({ mutation }).catch((error) => (
        toast.error(`🚫 ${error}` , {
        position: 'bottom-right',
      })));
    }
  }

  /**
   * create a new character
   * @param {*} offset offset value in the spritesheet (hard-coded)
   * @param {*} data the character JSON
   */
  createCharacter = (offset, data) => {
    const {
      gameStateID,
      currentUser,
    } = this.state;

    const texture = new PIXI.Texture(
      PIXI.utils.TextureCache[spritesheet],
      new PIXI.Rectangle(offset * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE),
    );
    const character = new PIXI.Sprite(texture);
    character.colour = data.colour;
    character.locked = null;
    character.x = data.coordinates.x * (TILE_SIZE * SCALE) + X_OFFSET;
    character.y = data.coordinates.y * (TILE_SIZE * SCALE) + Y_OFFSET;
    character.itemClaimed = data.itemClaimed;
    character.scale.set(SCALE, SCALE);
    character.interactive = true;

    character.on('click', () => {      
      const mutation = gql`
        mutation {
          lockCharacter(
            gameStateID: "${gameStateID}",
            characterColour: "${character.colour}",
            userID: "${currentUser.uid}",
          ) {
            colour
            locked
            coordinates {
              x
              y
            }
          }
        }
      `;
      client(this.state.authToken).mutate({ mutation }).catch((error) => (
        toast.error(`🚫 ${error}` , {
        position: 'bottom-right',
      })));
    });
    return character;
  }

  /**
   * search for a new maze tile upon encountering a search tile
   */
  search = () => {
    const { selected, characters, gameStateID, currentUser } = this.state;

    if (selected) {
      const x = (characters[selected].x - X_OFFSET) / (TILE_SIZE * SCALE);
      const y = (characters[selected].y - Y_OFFSET) / (TILE_SIZE * SCALE);
      const mutation = gql`
        mutation {
          searchAction (
            gameStateID: "${gameStateID}",
            userID: "${currentUser.uid}",
            characterCoords: { x: ${x}, y: ${y} },
          ) {
            spriteID
            orientation
            cornerCoordinates {
              x
              y
            }
          }
        }
      `;
      client(this.state.authToken).mutate({ mutation }).catch((error) => (
        toast.error(`🚫 ${error}` , {
        position: 'bottom-right',
      })));
    }
  }

  endGame = () => {
    const { gameStateID } = this.state;
    const mutation = gql`
    mutation{
      deleteGameState (
        gameStateID: "${gameStateID}",
      )
    }
    `;
    client(this.state.authToken).mutate({ mutation });
    const cookies = new Cookies();
    cookies.set('gameStateID', null);
    this.props.history.push('/');
  }

  render() {
    let message;
    const {
      itemsClaimed, gameOver, doTick, gameEndTime,
    } = this.state;

    if (itemsClaimed) {
      const cookies = new Cookies();
      cookies.set('gameStateID', null);
      message = <div className="message">All items have been claimed! All vortexes are disabled!</div>;
    }

    const actionMap = {
      UP: (
        <Button key={'up'} color="primary" className="mr-2 mt-3" style={{ fontSize: '1.5em' }}>
          <FontAwesomeIcon icon="arrow-circle-up" />
        </Button>
      ),
      DOWN: (
        <Button key={'down'} color="primary" className="mr-2 mt-3" style={{ fontSize: '1.5em' }}>
          <FontAwesomeIcon icon="arrow-circle-down" />
        </Button>
      ),
      LEFT: (
        <Button key={'left'} color="primary" className="mr-2 mt-3" style={{ fontSize: '1.5em' }}>
          <FontAwesomeIcon icon="arrow-circle-left" />
        </Button>
      ),
      RIGHT: (
        <Button key={'right'} color="primary" className="mr-2 mt-3" style={{ fontSize: '1.5em' }}>
          <FontAwesomeIcon icon="arrow-circle-right" />
        </Button>
      ),
      SEARCH: (
        <Button
          key={'search'}
          color="primary" 
          className="mr-2 mt-3" 
          type="button" 
          style={{ fontSize: '1.5em' }}
          onClick={() => this.search()}>
          <FontAwesomeIcon icon="search" />
        </Button>
      ),
      ESCALATOR: (
        <Button key={'escalator'} color="primary" className="mr-2 mt-3" style={{ fontSize: '1.5em' }}>
          <img src={escalatorIcon} className="mb-1" alt="Icon made from Freepik retrieved from FlatIcon licensed by CC 3.0" style={{ maxWidth: '25px', maxHeight: '25px' }} />
        </Button>
      ),
      VORTEX: (
        <Button key={'vortex'} color="primary" className="mr-2 mt-3" style={{ fontSize: '1.5em' }}>
          <img src={vortexIcon} className="mb-1" alt="Icon made from Freepik retrieved from FlatIcon licensed by CC 3.0" style={{ maxWidth: '25px', maxHeight: '25px' }}/>
        </Button>
      ),
    }
    const loading = (!this.state.gameStateID || !this.state.currentUser) ? (<Loading />) : null;

    const sideNav = this.state.currentUser !== null ? (
      this.state.users.map((user, index) => (
        <div key={user.uid} className={"player " + (this.state.currentUser.uid === user.uid ? 'bg-warning text-dark' : 'bg-info')}>
          <div className="mt-4" style={{ fontWeight: 'bold' }}>
            <FontAwesomeIcon icon="user" />
            &nbsp;{user.username}
          </div>
          <div>
            {
              this.state.actions[index].map(action => {
                return actionMap[action]
              })
            }
          </div>
        </div>
      ))
    ) : null;
    return (
      <div>
        {loading}
        {/* game win modal */}
        <Modal isOpen={gameOver} size="lg">
          <ModalHeader>
            <span role="img" aria-label="party">🎉</span>
            &nbsp;YOU WON!&nbsp;
            <span role="img" aria-label="party">🎉</span>
          </ModalHeader>
          <ModalBody>
            The boys escaped in time and are free to fight a dragon or something!
          </ModalBody>
          <ModalFooter>
            <Button color="success" className="mb-1" onClick={() => this.endGame()}>Play Again</Button>
          </ModalFooter>
        </Modal>
        <Timer endGame={() => this.endGame()} endTime={gameEndTime} doTick={doTick} />

        <div className="sidenav">
          { sideNav }
        </div>
        { message }
        <div id="board" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  firebase: state.firebaseReducer.firebaseInst,
  gameStateID: state.gameStateReducer.gameStateID,
});

export default connect(mapStateToProps)(Board);

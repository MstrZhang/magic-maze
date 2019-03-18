import gql from 'graphql-tag';
import React, { Component } from 'react';
import Viewport from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import client from '../common/utils';
import spritesheet from '../assets/spritesheet.png';
import './Board.css';

// constants
const SCALE = 4;
const TILE_SIZE = 16;
const MAZE_SIZE = 64;
const X_OFFSET = 350;
const Y_OFFSET = 80;
const GAME_ID = '5c8ef011d52d7f8251f9072c';

// containers
// (this is used for layering)
const characterContainer = new PIXI.Container();
const mazeContainer = new PIXI.Container();

// character objects
let selected = '';
const players = [];

// fontawesome
library.add(faSearch);

/**
 * load all the maze tiles
 * traverses file and maps all the images
 * @param {*} r regex
 */
function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(require.context('../assets/maze/', false, /\.(png|jpe?g|svg)$/));

// create board
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});
app.renderer.backgroundColor = 0x334D5C;
// set the scale mode (makes it so the pixels aren't blurry when scaling)
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

/**
 * move the selected character based on selected option
 * move algorithm:/
 * - calculate the delta between the click and the character's position
 * - convert delta to the number of tile spaces to increase this by
 *     (i.e. this should return the number of tiles moved; integer between 0 and n)
 * - scale up the coordinate to the actual coordinate
 * @param {*} e click event
 */
function move(e) {
  if (selected) {
    const endX = players[selected].x + Math.floor((e.world.x - players[selected].x)
     / (TILE_SIZE * SCALE)) * (TILE_SIZE * SCALE);
    const endY = players[selected].y + Math.floor((e.world.y - players[selected].y)
     / (TILE_SIZE * SCALE)) * (TILE_SIZE * SCALE);

    const deltaX = (endX - X_OFFSET) / (TILE_SIZE * SCALE);
    const deltaY = (endY - Y_OFFSET) / (TILE_SIZE * SCALE);
    const mutation = gql`
      mutation {
        moveCharacter(
          gameStateID: "${GAME_ID}",
          userID: null,
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
    client().mutate({ mutation }).then((results) => {
      players[selected].x = results.data.moveCharacter.coordinates.x * TILE_SIZE * SCALE + X_OFFSET;
      players[selected].y = results.data.moveCharacter.coordinates.y * TILE_SIZE * SCALE + Y_OFFSET;
    });
  }
}

// create viewport
const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  interaction: app.renderer.plugins.interaction,
});
// add and setup the viewport to the stage
// this must be done before adding any sprites
app.stage.addChild(viewport);
viewport
  .drag()
  .pinch()
  .wheel()
  .decelerate()
  .on('clicked', move);

/**
 * create a new character
 * @param {*} offset offset value in the spritesheet (hard-coded)
 * @param {*} data the character JSON
 */
function createCharacter(offset, data) {
  const texture = new PIXI.Texture(
    PIXI.utils.TextureCache[spritesheet],
    new PIXI.Rectangle(offset * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE),
  );
  const character = new PIXI.Sprite(texture);
  character.x = data.coordinates.x * (TILE_SIZE * SCALE) + X_OFFSET;
  character.y = data.coordinates.y * (TILE_SIZE * SCALE) + Y_OFFSET;
  character.scale.set(SCALE, SCALE);
  character.interactive = true;
  // sprite handling can only be caught using 'click'
  // (this is different from the viewport for some reason...)
  character.on('click', () => {
    selected = selected === '' || selected !== data.colour ? data.colour : '';
  });
  return character;
}

/**
 * call backend and do initial setup
 */
const setup = () => {
  const query = gql`
    {
      gameState(gameStateID: "${GAME_ID}") {
        mazeTiles {
          cornerCoordinates {
            x
            y
          }
          spriteID
          orientation
        }
        characters {
          colour
          coordinates {
            x
            y
          }
        }
      }
    }
  `;
  client().query({ query }).then((results) => {
    // render and create characters
    players.red = createCharacter(3, results.data.gameState.characters.find(x => x.colour === 'red'));
    players.purple = createCharacter(0, results.data.gameState.characters.find(x => x.colour === 'purple'));
    players.blue = createCharacter(1, results.data.gameState.characters.find(x => x.colour === 'blue'));
    players.green = createCharacter(2, results.data.gameState.characters.find(x => x.colour === 'green'));

    // render initial maze tile
    // TODO: perhaps abstract this into a separate function
    const startTileTexture = new PIXI.Texture(
      PIXI.utils.TextureCache[images[0]],
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
    characterContainer.addChild(players.red);
    characterContainer.addChild(players.purple);
    characterContainer.addChild(players.blue);
    characterContainer.addChild(players.green);

    // add containers to viewport
    // (cannot add to stage otherwise scrolling will not work)
    viewport.addChild(mazeContainer);
    viewport.addChild(characterContainer);
  });
};

// load sprites
const spriteList = [{ url: spritesheet }];
// we read all the images in the beginning
// then add them all to this object to get the loader to load everything
images.forEach((url) => {
  spriteList.push(url);
});
PIXI.Loader.shared
  .add(spriteList)
  .load(setup);

/**
 * search for a new maze tile upon encountering a search tile
 */
function search() {
  if (selected) {
    const x = (players[selected].x - X_OFFSET) / (TILE_SIZE * SCALE);
    const y = (players[selected].y - Y_OFFSET) / (TILE_SIZE * SCALE);
    const mutation = gql`
      mutation{
        searchAction (
          gameStateID: "${GAME_ID}",
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
    client().mutate({ mutation }).then((results) => {
      const newTileTexture = new PIXI.Texture(
        PIXI.utils.TextureCache[require(`../assets/maze/${results.data.searchAction.spriteID}.png`)],
        new PIXI.Rectangle(0, 0, MAZE_SIZE, MAZE_SIZE),
      );
      const newTile = new PIXI.Sprite(newTileTexture);
      // adding a pivot affects the position of the tile
      // must offset by (WIDTH / 2) * SCALE to counteract this
      newTile.x = results.data.searchAction.cornerCoordinates.x * (TILE_SIZE * SCALE) + X_OFFSET
       + (MAZE_SIZE / 2) * 4;
      newTile.y = results.data.searchAction.cornerCoordinates.y * (TILE_SIZE * SCALE) + Y_OFFSET
       + (MAZE_SIZE / 2) * 4;
      // add pivot in the centre of the tile
      newTile.pivot.set(MAZE_SIZE / 2);
      newTile.scale.set(SCALE, SCALE);
      // start tiles are rotated counterclockwise for god knows why
      newTile.angle = results.data.searchAction.orientation * (-90);
      mazeContainer.addChild(newTile);
    });
  }
}

class Board extends Component {
  // serve board
  componentDidMount() {
    document.getElementById('board').appendChild(app.view);
    document.body.style.overflow = 'hidden';
  }

  render() {
    return (
      <div>
        {/* temporarily remove sidenav (not required for singleplayer) */}
        <div className="sidenav">
          <div className="player">kev</div>
          <div className="player">rakin</div>
          <div className="player">luc</div>
          <div className="player">not-luc</div>
          <button className="btn btn-lg btn-warning" type="button">
            test
          </button>
          <button className="btn btn-lg btn-primary" type="button" onClick={() => search()}>
            <FontAwesomeIcon icon="search" />
          </button>
        </div>
        <div id="board" />
      </div>
    );
  }
}

export default Board;

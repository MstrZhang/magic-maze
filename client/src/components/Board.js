import React, { Component } from 'react';
import Viewport from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import spritesheet from '../assets/spritesheet.png';
import './Board.css';

const SCALE = 4;
const TILE_SIZE = 16;
const X_OFFSET = 140;
const Y_OFFSET = 80;

// create board
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: SCALE,
});
app.renderer.backgroundColor = 0x334D5C;
// set the scale mode (makes it so the pixels aren't blurry when scaling)
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

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
  .decelerate();

function setup() {
  // render the character
  const characterTexture = new PIXI.Texture(
    PIXI.utils.TextureCache[spritesheet],
    new PIXI.Rectangle(0, 0, TILE_SIZE, TILE_SIZE),
  );
  const character = new PIXI.Sprite(characterTexture);
  character.x = (1 * TILE_SIZE) + X_OFFSET;
  character.y = (1 * TILE_SIZE) + Y_OFFSET;

  // render the tilemap (proof of concept)
  const container = new PIXI.Container();
  container.x = 0 + X_OFFSET;
  container.y = 0 + Y_OFFSET;

  /*
    0 = floor
    1 = tl-corner
    2 = top-wall
    3 = tr-corner
    4 = bl-corner
    5 = br-corner
    6 = bottom-wall
  */
  const map = [
    [1, 2, 2, 3],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 6, 6, 5],
  ];

  // this is kind of disgusting
  // will probably do an initial load of all textures in the beginning or something
  const tlCornerTexture = new PIXI.Texture(
    PIXI.utils.TextureCache[spritesheet],
    new PIXI.Rectangle(2 * TILE_SIZE, 1 * TILE_SIZE, TILE_SIZE, TILE_SIZE),
  );
  const trCornerTexture = new PIXI.Texture(
    PIXI.utils.TextureCache[spritesheet],
    new PIXI.Rectangle(3 * TILE_SIZE, 1 * TILE_SIZE, TILE_SIZE, TILE_SIZE),
  );
  const blCornerTexture = new PIXI.Texture(
    PIXI.utils.TextureCache[spritesheet],
    new PIXI.Rectangle(4 * TILE_SIZE, 1 * TILE_SIZE, TILE_SIZE, TILE_SIZE),
  );
  const brCornerTexture = new PIXI.Texture(
    PIXI.utils.TextureCache[spritesheet],
    new PIXI.Rectangle(5 * TILE_SIZE, 1 * TILE_SIZE, TILE_SIZE, TILE_SIZE),
  );
  const floorTexture = new PIXI.Texture(
    PIXI.utils.TextureCache[spritesheet],
    new PIXI.Rectangle(5 * TILE_SIZE, 0 * TILE_SIZE, TILE_SIZE, TILE_SIZE),
  );
  const topWallTexture = new PIXI.Texture(
    PIXI.utils.TextureCache[spritesheet],
    new PIXI.Rectangle(7 * TILE_SIZE, 0 * TILE_SIZE, TILE_SIZE, TILE_SIZE),
  );
  const bottomWallTexture = new PIXI.Texture(
    PIXI.utils.TextureCache[spritesheet],
    new PIXI.Rectangle(1 * TILE_SIZE, 1 * TILE_SIZE, TILE_SIZE, TILE_SIZE),
  );

  // same with this
  for (let row = 0; row < map.length; row += 1) {
    for (let col = 0; col < map[row].length; col += 1) {
      let tile = null;
      switch (map[col][row]) {
        case 0:
          tile = new PIXI.Sprite(floorTexture);
          tile.x = row * TILE_SIZE;
          tile.y = col * TILE_SIZE;
          container.addChild(tile);
          break;
        case 1:
          tile = new PIXI.Sprite(tlCornerTexture);
          tile.x = row * TILE_SIZE;
          tile.y = col * TILE_SIZE;
          container.addChild(tile);
          break;
        case 2:
          tile = new PIXI.Sprite(topWallTexture);
          tile.x = row * TILE_SIZE;
          tile.y = col * TILE_SIZE;
          container.addChild(tile);
          break;
        case 3:
          tile = new PIXI.Sprite(trCornerTexture);
          tile.x = row * TILE_SIZE;
          tile.y = col * TILE_SIZE;
          container.addChild(tile);
          break;
        case 4:
          tile = new PIXI.Sprite(blCornerTexture);
          tile.x = row * TILE_SIZE;
          tile.y = col * TILE_SIZE;
          container.addChild(tile);
          break;
        case 5:
          tile = new PIXI.Sprite(brCornerTexture);
          tile.x = row * TILE_SIZE;
          tile.y = col * TILE_SIZE;
          container.addChild(tile);
          break;
        case 6:
          tile = new PIXI.Sprite(bottomWallTexture);
          tile.x = row * TILE_SIZE;
          tile.y = col * TILE_SIZE;
          container.addChild(tile);
          break;
        default:
          break;
      }
    }
  }

  // must add to viewport (adding to stage will not allow it to scroll)
  viewport.addChild(container);
  viewport.addChild(character);
}

// load character from spritesheet
// let loader = new Loader();
PIXI.Loader.shared
  .add([{
    name: 'spritesheet',
    url: spritesheet,
  }])
  .load(setup);

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
        {/* <div className="sidenav">
          <div className="player">kev</div>
          <div className="player">rakin</div>
          <div className="player">luc</div>
          <div className="player">not-luc</div>
        </div> */}
        <div id="board" />
      </div>
    );
  }
}

export default Board;

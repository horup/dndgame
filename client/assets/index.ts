import * as PIXI from 'pixi.js';
declare var require;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
export const player = [PIXI.Texture.from(require('./Characters/player0.png')).baseTexture, PIXI.Texture.from(require('./Characters/player1.png')).baseTexture];
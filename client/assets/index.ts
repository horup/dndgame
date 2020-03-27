import * as PIXI from 'pixi.js';
declare var require;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
export const player0 = PIXI.Texture.from(require('./Characters/player0.png')).baseTexture;
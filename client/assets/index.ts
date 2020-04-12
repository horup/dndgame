import * as PIXI from 'pixi.js';
import { CreatureType } from '../..';
declare var require;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
export const player = [PIXI.Texture.from(require('./Characters/player0.png')).baseTexture, PIXI.Texture.from(require('./Characters/player1.png')).baseTexture];
export const undead = [PIXI.Texture.from(require('./Characters/Undead0.png')).baseTexture, PIXI.Texture.from(require('./Characters/Undead1.png')).baseTexture];


export function setCreatureSprite(sprite:PIXI.Sprite, creatureType:CreatureType, index:number):PIXI.BaseTexture[]
{
    let base = sprite.texture.baseTexture;
    let frame = sprite.texture.frame;
    switch(creatureType)
    {
        case CreatureType.Fighter:
        {
            base = player[index % player.length];
            frame.x = 0;
            frame.y = 0;
            break;
        }
        case CreatureType.Skeleton:
        {
            base = undead[index % undead.length];
            frame.x = 0;
            frame.y = 16*2;
            break;
        }
    }

    sprite.texture.frame = frame;
    sprite.texture.baseTexture = base;

    return [];
}
import * as PIXI from 'pixi.js';
import {Handler} from 'cmdserverclient';
import {State, Command, hasTurn, distance} from '../..';
import { Context } from '..';


export const renderHandler:Handler<State, Command, Context> = (s, c, p, o, context)=>
{
    if (c.clientTick)
    {
        const sprites = context.sprites;

        Object.entries(s.creatures).forEach(([id, creature])=>{
            sprites.setSprites({
                [id]:{
                    atlas:creature.class1,
                    frame:0,
                    x:creature.x,
                    y:creature.y,
                    zIndex:creature.y,
                    anchor:{x:0.5, y:0.75},
                    tint:hasTurn(id, s) ? 0xFFFFFF : 0xA0A0A0
                }
            })
        });
    }
} 

export * from './uihandler';
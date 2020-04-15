import * as PIXI from 'pixi.js';
import {Handler} from 'cmdserverclient';
import {State, Command} from '../..';
import { Context } from '..';

export const renderHandler:Handler<State, Command, Context> = (s, c, p, o, context)=>
{
    const sprites = context.sprites;
    if (c.clientTick)
    {
        Object.entries(s.creatures).forEach(([id, creature])=>{
            const hasTurn = s.turn != null && s.turn.creatureId == id;
            sprites.setSprites({
                [id]:{
                    atlas:creature.class1,
                    frame:0,
                    x:creature.x,
                    y:creature.y,
                    zIndex:0,
                    anchor:{x:0.5, y:0.75},
                    tint:hasTurn ? 0xFFFFFF : 0xA0A0A0
                }
            })
        });
    }
} 
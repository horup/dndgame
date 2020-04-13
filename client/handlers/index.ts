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
            sprites.setSprites({
                [id]:{
                    atlas:creature.class1,
                    frame:0,
                    x:creature.x,
                    y:creature.y,
                    zIndex:0
                }
            })
        });
    }
} 
import * as PIXI from 'pixi.js';
import {Handler} from 'cmdserverclient';
import {State, Command, hasTurn, distance} from '../..';
import { Context } from '..';


export const renderHandler:Handler<State, Command, Context> = (s, c, p, o, context)=>
{
    if (c.clientTick)
    {
        const sprites = context.sprites;
        const graphics = context.graphics;
        graphics.clear();
        
        Object.entries(s.creatures).forEach(([id, creature])=>{
            sprites.setSprites({
                [id]:{
                    atlas:creature.class1,
                    frame:0,
                    x:creature.x,
                    y:creature.y,
                    zIndex:creature.y,
                    anchor:{x:0.5, y:0.8}
                }
            })

            graphics.beginFill(0xFFFFFF, hasTurn(id, s) ? 1.0 : 0.25);
            graphics.drawCircle(creature.x, creature.y, creature.size);
            graphics.endFill();
        });

        
    }
} 

export * from './uihandler';
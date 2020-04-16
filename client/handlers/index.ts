import * as PIXI from 'pixi.js';
import {Handler} from 'cmdserverclient';
import {State, Command, hasTurn} from '../..';
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
                    zIndex:0,
                    anchor:{x:0.5, y:0.75},
                    tint:hasTurn(id, s) ? 0xFFFFFF : 0xA0A0A0
                }
            })
        });
    }
} 


export const uiHandler:Handler<State, Command, Context> = (s, c, p, o, context)=>
{
    if (c.clientTick)
    {
        const global = context.mouse.global;
        const cursorText = context.cursorText;
        const myCreature = Object.entries(s.creatures)
        .filter(c=>c[1].owner == context.client.id)[0];

        if (myCreature && hasTurn(myCreature[0], s))
        {
            const [id, c] = myCreature;
            cursorText.visible = true;
            cursorText.text = "Move";
            cursorText.position.set(global.x, global.y);
        }
        else
        {
            cursorText.visible = false;
        }
        
        
    }
}
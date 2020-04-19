import {Handler} from 'cmdserverclient';
import {State, Command, hasTurn, distance} from '../..';
import { Context } from '..';
import * as PIXI from 'pixi.js';

export const uiHandler:Handler<State, Command, Context> = (s, c, p, o, context)=>
{
    if (c.setCreatures)
    {
        const myCreature = Object.entries(s.creatures)
        .filter(c=>c[1].owner == context.client.id)[0];
        if (myCreature != null && c.setCreatures[myCreature[0]] != null)
        {
            const c = myCreature[1];
            const avaliableActions = c.avaliableActions;
            const actionPoints = c.actionPoints;
            const container = context.actions;
            container.children.forEach(c=>c.destroy());
            const spacing = 16;
            for (let i = 0; i < avaliableActions.length; i++)
            {
                const a = avaliableActions[i];
                const text = new PIXI.Text(i+1+":"+a.description, {fill:'white', fontSize:'16px'} as PIXI.TextStyle);
                text.y = i * spacing;
                container.addChild(text);
            }
        }
        
    }
    if (c.clientTick)
    {
        const global = context.mouse.global;
        const local = context.sprites.toLocal(global);
        const cursorText = context.cursorText;
        const myCreature = Object.entries(s.creatures)
        .filter(c=>c[1].owner == context.client.id)[0];

        if (myCreature && hasTurn(myCreature[0], s))
        {
            const [id, c] = myCreature;
            cursorText.visible = true;
            cursorText.position.set(global.x, global.y);
            const d = distance(c, local);
            if (d < c.movement)
            {
                cursorText.text = "Move " + d.toFixed(2) + " / " + c.movement.toFixed(2);
                cursorText.style.fill = 'white';
            }
            else
            {
                cursorText.text = "Too far!";
                cursorText.style.fill = 'red';
            }
            
        }
        else
        {
            cursorText.visible = false;
        }
        
        
    }
}
import {Handler} from 'cmdserverclient';
import {State, Command, hasTurn, distance, isBlockedByCreature} from '../..';
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
            // FUSK
            const spacing = 16;
            for (let i = 0; i < avaliableActions.length; i++)
            {
                const a = avaliableActions[i];
                let text = container.children[i] != null ? container.children[i] as PIXI.Text : null;
                if (!text)
                {
                    text = new PIXI.Text("", {fill:'white', fontSize:'16px'} as PIXI.TextStyle);
                    container.addChild(text);
                }

                text.text = i+1+":"+a.description;
                text.y = i * spacing;
                container.addChild(text);
            }

            console.log(container.children.length);

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
            if (context.selectedAction == null)
            {
                const d = distance(c, local);
                if (d < c.movement)
                {
                    if (isBlockedByCreature(local.x, local.y, id, s) == null)
                    {
                        cursorText.text = "Move\n" + d.toFixed(2) + " / " + c.movement.toFixed(2);
                        cursorText.style.fill = 'white';
                    }
                    else
                    {
                        cursorText.text = "Blocked!";
                        cursorText.style.fill = 'red';
                    }
                }
                else
                {
                    cursorText.text = "Insufficient speed";
                    cursorText.style.fill = 'red';
                }
            }
            else
            {
                const d = distance(c, local);
                if (context.selectedAction.range == null || d < context.selectedAction.range + c.size)
                {
                    cursorText.text = context.selectedAction.description;
                    cursorText.style.fill = 'white';
                }
                else
                {
                    cursorText.text = "Not in range";
                    cursorText.style.fill = 'red';
                }

                cursorText.text += "\nPress escape to cancel";
            }
            
        }
        else
        {
            cursorText.visible = false;
        }
        
        
    }
}
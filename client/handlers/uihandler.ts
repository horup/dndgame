import {Handler} from 'cmdserverclient';
import {State, Command, hasTurn, distance} from '../..';
import { Context } from '..';

export const uiHandler:Handler<State, Command, Context> = (s, c, p, o, context)=>
{
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
import { Handler } from "cmdserverclient";

import { State, Command } from "../shared";

export const creatureHandler:Handler<State, Command> = (s, c, push, origin)=>
{
    if (c.creatureAction)
    {
        const id = c.creatureAction.creatureId;
        let creature = s.creatures[id];
        if (!creature)
            return; // no creature
        if (creature.owner != origin)
            return; // not the owner
        if (s.turn == null || s.turn.creatureId != id)
            return; // not the creatures turn
        if (c.creatureAction.moveTo != null)
        {
            const m =c.creatureAction.moveTo;
            const vx = m.x - creature.x;
            const vy = m.y - creature.y;
            const l = Math.sqrt(vx*vx+vy*vy);
            if (l <= creature.movement)
            {
                push({
                    setCreatures:{[id]:{...creature, 
                        x:c.creatureAction.moveTo.x, 
                        y:c.creatureAction.moveTo.y, movement:creature.movement - l}}
                }, true);
            }
        }
        if (c.creatureAction.endTurn != null)
        {
            push({
                setCreatures:{[id]:{...creature, acted:true}}
            }, true);
        }
    } 
 /*   if (c.playerInput)
    {
        let moveTo = c.playerInput.moveTo;
        let find = Object.entries(s.creatures).filter(([id,creature])=>creature.owner == c.playerInput.id)[0];
        if (find != null)
        {
            const [id, creature] = find;
            if (s.turn && s.turn.creatureId == parseInt(id))
            {
                push({
                    setCreatures:{[id]:{...creature, x:moveTo.x, y:moveTo.y, acted:true}}
                }, true);
            }
        }
    }*/
} 
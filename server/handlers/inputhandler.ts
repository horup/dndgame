import { Handler } from "cmdserverclient";

import { State, Command } from "../shared";

export const inputHandler:Handler<State, Command> = (s, c, push)=>
{
    if (c.playerInput)
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
    }
}
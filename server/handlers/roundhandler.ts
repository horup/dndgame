import { Handler } from "cmdserverclient";
import { State, Command } from "../shared";

export const roundHandler:Handler<State, Command> = (s, c, push)=>
{
    if (c.setRound)
    {
        // new round has started, reset all creatures
        let creatures = {...s.creatures};
        for (let id in creatures)
        {
            let creature = creatures[id];
            creatures[id] = {...creature, 
                acted:false,
                movement:creature.movementTotal};
        }
        push({
            setCreatures:creatures
        }, true);
    }
}


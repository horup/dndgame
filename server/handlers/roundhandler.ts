import { Handler } from "cmdserverclient";
import { State, Command } from "../shared";

export const roundHandler:Handler<State, Command> = (s, c, push)=>
{
    if (c.setRound)
    {
        // new round has started, reset acted for all creatures
        let creatures = {...s.creatures};
        for (let id in creatures)
        {
            creatures[id] = {...creatures[id], acted:false};
        }
        push({
            setCreatures:creatures
        }, true);
    }
}


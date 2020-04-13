import { Handler } from "cmdserverclient";
import { Command, State } from "../..";

export const aiHandler:Handler<State, Command> = (s, c, push)=>
{
    if (c.serverTick)
    {
        let monsters = Object.entries(s.creatures).filter(c=>!c[1].owner);
        for (let [id,monster] of monsters)
        {
            if (s.turn != null && s.turn.creatureId == id)
            {
                // this creature has the turn.
                // end it
                push({
                    creatureAction:{
                        creatureId:id,
                        endTurn:true
                    }
                }, true)
            }
        }
    }
}
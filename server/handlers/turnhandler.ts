import { Handler } from "cmdserverclient";
import { State, Command } from "../..";

export const turnHandler:Handler<State, Command> = (s, c, push)=>
{
    if (c.tick)
    {
        if (!s.turn)
        {
            // no one has the turn 
            // find a creature which can act this round
            let creatures = Object.entries(s.creatures);
            let next = creatures.filter(c=>!c[1].acted)
            .sort((a,b)=>a[1].initiative - b[1].initiative);

            if (next.length == 0)
            {
                // no creatures can act this round, advance to next round
                push({setRound:{round:s.round + 1}}, true);
            }
            else
            {
                push({
                    setTurn:{
                        turn:{
                            creatureId:next[0][0]
                        }
                    }
                }, true)
            }
        }
        else
        {
            let creature = s.creatures[s.turn.creatureId];
            if (creature == null || creature.acted)
            {
                // creature was not found or it has acted this round, give up the turn
                push({
                    setTurn:{
                        turn:null
                    }
                }, true);
            }
        }
    }
}
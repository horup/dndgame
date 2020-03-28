import { Handler } from "cmdserverclient";
import { State, Command, Creature, Dice } from "../shared";

let nextId = 1;
export const spawnHandler:Handler<State, Command> = (s, c, push) =>
{
    if (c.playerJoined)
    {
        // player joined, create a creature for the player
        let creature:Creature = {
            owner:c.playerJoined.id,
            x:Math.random() * 10,
            y:Math.random() * 10,
            hitpoints:10,
            initiative:Dice.d20(),
            acted:true
        }

        push({setCreatures:{[nextId++]:creature}}, true);
    }
    if (c.playerLeft)
    {
        // player left, find his creature and remove it.
        Object.entries(s.creatures).forEach(([id,creature])=>
        {
            if (creature.owner == c.playerLeft.id)
            {
                push({deleteCreature:{id:parseInt(id)}}, true);
            }
        });
    }
}

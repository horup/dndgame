import { Handler } from "cmdserverclient";
import { State, Command, Creature, Dice, Class } from "../shared";

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
            acted:true,
            class1:Class.Fighter
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
    if (c.tick)
    {
        const players = Object.entries(s.creatures).filter(c=>c[1].owner);
        const monsters = Object.entries(s.creatures).filter(c=>!c[1].owner);
        if (monsters.length < players.length)
        {
            let monster:Creature = {
                owner:null,
                x:Math.random() * 20,
                y:Math.random() * 20,
                hitpoints:8,
                initiative:Dice.d20(),
                acted:true,
                class1:Class.Skeleton
            }
            push({setCreatures:{[nextId++]:monster}}, true);
        }
    }
}

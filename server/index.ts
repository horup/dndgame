import * as http from 'http';
import {Server, Handler} from 'cmdserverclient';
import {State, Command, Creature, setter, defaultState, Dice} from './shared';

let nextId = 1;
const spawnHandler:Handler<State, Command> = (s, c, push) =>
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

const inputHandler:Handler<State, Command> = (s, c, push)=>
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

const roundHandler:Handler<State, Command> = (s, c, push)=>
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

const turnHandler:Handler<State, Command> = (s, c, push)=>
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
                            creatureId:parseInt(next[0][0])
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


const httpServer = new http.Server();
const server = new Server<State, Command>(defaultState, {info:(s)=>console.log(s)});
server.handlers = [
    spawnHandler,
    setter,
    turnHandler,
    roundHandler
];

server.clientHandlers = [
    inputHandler
]

server.onClientConnected = id=>
{
    server.pushCommand({playerJoined:{id:id}}, true);
}

server.onClientDisconnected = id=>
{
    server.pushCommand({playerLeft:{id:id}}, true);
}

setInterval(()=>
{
    server.pushCommand({
        tick:{}
    }, true)
}, 1000);

server.attach(httpServer);
httpServer.listen(8080, "0.0.0.0");
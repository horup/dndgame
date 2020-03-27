import * as http from 'http';
import {Server, Handler} from 'cmdserverclient';
import {State, Command, Creature, setter, defaultState} from '../shared';

let nextId = 1;
const spawner:Handler<State, Command> = (s, c, push) =>
{
    if (c.playerJoined)
    {
        // player joined, create a creature for the player
        let creature:Creature = {
            owner:c.playerJoined.id,
            x:Math.random() * 10,
            y:Math.random() * 10,
            hitpoints:10
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

const input:Handler<State, Command> = (s, c, push)=>
{
    if (c.playerInput)
    {
        let moveTo = c.playerInput.moveTo;
        let find = Object.entries(s.creatures).filter(([id,creature])=>creature.owner == c.playerInput.id)[0];
        if (find != null)
        {
            const [id, creature] = find;
            push({
                setCreatures:{[id]:{...creature, x:moveTo.x, y:moveTo.y}}
            }, true);
        }
    }
}


const httpServer = new http.Server();
const server = new Server<State, Command>(defaultState, {info:(s)=>console.log(s)});
server.handlers = [
    spawner,
    setter
];

server.clientHandlers = [
    input
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
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
            x:Math.random() * 32,
            y:Math.random() * 32,
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


const httpServer = new http.Server();
const server = new Server<State, Command>(defaultState, {info:(s)=>console.log(s)});
server.handlers = [
    spawner,
    setter
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
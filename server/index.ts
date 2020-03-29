import * as http from 'http';
import {Server, Handler} from 'cmdserverclient';
import {State, Command, Creature, setter, defaultState, Dice} from './shared';
import { turnHandler, roundHandler, creatureHandler, spawnHandler, aiHandler } from './handlers';

const httpServer = new http.Server();
const server = new Server<State, Command>(defaultState, {info:(s)=>console.log(s)});
server.handlers = [
    spawnHandler,
    creatureHandler,
    setter,
    turnHandler,
    aiHandler,
    roundHandler,
];

server.clientHandlers = [
    creatureHandler
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
}, 250);

server.attach(httpServer);
httpServer.listen(8080, "0.0.0.0");
import * as http from 'http';
import {Server, Handler} from 'cmdserverclient';
import {State, Command, Monster, setter, defaultState} from '../shared';

let nextId = 1;
const spawner:Handler<State, Command> = (s, c, push) =>
{
    if (c.tick)
    {
        if (Object.keys(s.monsters).length < 2)
        {
            let id = nextId++
            let monster:Monster = {
                health:15, 
                x:Math.random()*100, 
                y:Math.random()*100
            };

            const cc = {
                setMonsters:{
                    [id]:monster
                }
            };
            push(cc, true)
        }
    }
}

const cleaner = (s:State, c:Command)=>
{
    if (c.tick)
    {
        for (let id in s.monsters)
        {
            let m = s.monsters[id];
            if (m.health <= 0)
            {
               // return [{setMonster:{}}]
            }
        }
    }
}

const thinker:Handler<State, Command> = (s, c, push) =>
{
    if (c.tick)
    {
        for (let id in s.monsters)
        {
            let m = s.monsters[id];
            if (m.health > 0)
            {
                let x = m.x + Math.random() - 0.5;
                let y = m.y + Math.random() - 0.5;
                push({
                    setMonsters:{[id]:{...m, ...{x:x, y:y}}}
                }, true)
            }
        }
    }
}



const httpServer = new http.Server();
const server = new Server<State, Command>(defaultState, {info:(s)=>console.log(s)});
server.handlers = [
    spawner,
    setter,
    thinker
]

setInterval(()=>
{
    server.pushCommand({
        tick:{}
    }, true)
}, 1000);

server.attach(httpServer);
httpServer.listen(8080, "0.0.0.0");
import * as http from 'http';
import {Server, Handler} from 'cmdserverclient';
import {State, Command, Creature, setter, defaultState} from '../shared';

let nextId = 1;
const spawner:Handler<State, Command> = (s, c, push) =>
{
    if (c.tick)
    {
        if (Object.keys(s.creatures).length < 2)
        {
            let id = nextId++
            let creature:Creature = {
                health:15, 
                x:Math.random()*100, 
                y:Math.random()*100
            };

            const c:Command = {
                setCreatures:{
                    [id]:creature
                }
            };
            push(c, true)
        }
    }
}


const thinker:Handler<State, Command> = (s, c, push) =>
{
    if (c.tick)
    {
        for (let id in s.creatures)
        {
            let m = s.creatures[id];
            if (m.health > 0)
            {
                let x = m.x + (Math.random() - 0.5) * 30;
                let y = m.y + (Math.random() - 0.5) * 30;
                push({
                    setCreatures:{[id]:{...m, ...{x:x, y:y}}}
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
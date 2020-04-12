import {Client, Handler, process} from 'cmdserverclient';
import {State, Command, setter, Creature} from '../server/shared';
import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    resizeTo:window
})
document.body.appendChild(app.view);


const client = new Client<State, Command>({info:(s)=>{}});
client.handlers = [
    setter,
    (s, c)=>
    {
       /* if (!c.tick)
            console.log(c);*/
    }
]
client.connect("ws://localhost:8080");
/*
const render = new Render(app, client);

app.ticker.add((dt)=>{
    render.tick(app.ticker.lastTime);
});*/

const onKeydown = (e:KeyboardEvent)=>
{
    Object.entries(client.state.creatures).forEach(([id,creature])=>
    {
        if (creature.owner == client.id)
        {
            client.pushCommand({
                creatureAction:{
                    creatureId:id,
                    endTurn:true
                }
            }, true);
        }
    });
}

window.onkeydown = onKeydown;

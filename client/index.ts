import {Client, Handler, process} from 'cmdserverclient';
import {State, Command, setter} from '../shared';
import * as PIXI from 'pixi.js';
import * as assets from './assets';
const client = new Client<State, Command>({info:(s)=>{}});
const canvas:HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const app = new PIXI.Application({
    view:canvas
})


client.handlers = [
    setter,
    (s, c)=>
    {
        if (c.tick)
        {
            
        }
    }
]
client.connect("ws://localhost:8080");

const ground = new PIXI.Container();
const creatures = new PIXI.Container();
const stage = new PIXI.Container();
stage.scale.set(2);
stage.addChild(ground);
stage.addChild(creatures);
app.stage.addChild(stage);
const ui = new PIXI.Container();

app.stage.addChild(ui);

app.ticker.add(()=>
{
    const s = client.state;
    if (s == null)
        return;
    for (let id in s.creatures)
    {
        let c = s.creatures[id];
        let o:PIXI.Sprite = creatures.children.filter(o=>o.name ==id)[0] as PIXI.Sprite;
        if (o == null)
        {
            o = new PIXI.Sprite(new PIXI.Texture(assets.player0, new PIXI.Rectangle(0,0, 16, 16)));
            o.name = id;
            creatures.addChild(o);
        }

        o.x = c.x;
        o.y = c.y;
    }
    for (let sprite of creatures.children)
        if (!s.creatures[sprite.name])
            creatures.removeChild(sprite);
});


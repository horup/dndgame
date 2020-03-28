import {Client, Handler, process} from 'cmdserverclient';
import {State, Command, setter} from '../server/shared';
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
        if (!c.tick)
            console.log(c);
    }
]
client.connect("ws://localhost:8080");

const ground = new PIXI.Container();
const creatures = new PIXI.Container();
const stage = new PIXI.Container();
stage.hitArea = {contains:(x, y)=>true};
stage.scale.set(16*2);
stage.addChild(ground);
stage.addChild(creatures);
app.stage.addChild(stage);
const ui = new PIXI.Container();
app.stage.addChild(ui);

stage.interactive =true;

const roundText = new PIXI.Text("Round", {fill:'white', stroke:'black'} as PIXI.TextStyle);
app.stage.addChild(roundText);

const onClick = (e:PIXI.interaction.InteractionEvent)=>
{
    if (e.target == stage)
    {
        let p = e.data.getLocalPosition(stage);
        client.pushCommand({
            playerInput: {
                id:client.id,
                moveTo:{x:p.x, y:p.y}
            }
        }, true);
    }
};

stage.on('click', onClick);


app.ticker.add((dt)=>
{
    const animationSpeed = 1000;
    const animationIndex = (app.ticker.lastTime % animationSpeed) < animationSpeed/2 ? 0 : 1;
    const s = client.state;
    if (s == null)
        return;
    roundText.text= `Round: ${s.round}`;

    for (let id in s.creatures)
    {
        let c = s.creatures[id];
        let o:PIXI.Sprite = creatures.children.filter(o=>o.name ==id)[0] as PIXI.Sprite;
        if (o == null)
        {
            o = new PIXI.Sprite(new PIXI.Texture(assets.player[animationIndex], new PIXI.Rectangle(0,0, 16, 16)));
            o.width = 1;
            o.height = 1;
            o.anchor.x = 0.5;
            o.anchor.y = 0.5;
            o.name = id;
            o.x = c.x;
            o.y = c.y;
            //o.tint = 0xAAAAAA;
            //o.addChild(new PIXI.Text(""+c.initiative, {fill:'white', fontSize:8} as PIXI.TextStyle));
            o.interactive = true;
            o.on('click', onClick)
            creatures.addChild(o);
        }

        if (s.turn == null || s.turn.creatureId != parseInt(id))
            o.tint = 0xAAAAAA;
        else
            o.tint = 0xFFFFFF;

        o.texture.baseTexture = assets.player[animationIndex];
        let vx = c.x - o.x;
        let vy = c.y - o.y;
        const l = Math.sqrt(vx*vx+vy*vy);
        let nx = vx / l;
        let ny = vy / l;
        const speed = 0.5;
        if (l <= speed)
        {
            o.x = c.x;
            o.y = c.y;
        }
        else
        {
            o.x += nx*speed;
            o.y += ny*speed;
        }
    }
    for (let sprite of creatures.children)
        if (!s.creatures[sprite.name])
            creatures.removeChild(sprite);
});


import {Client, Handler, process} from 'cmdserverclient';
import {State, Command, setter, Creature} from '../server/shared';
import * as PIXI from 'pixi.js';
import * as assets from './assets';
import { FloatingMessage } from './render/floatingmessage';
import {Render} from './render';

const canvas:HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const app = new PIXI.Application({
    view:canvas
})


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

const render = new Render(app);

app.ticker.add((dt)=>{
    render.tick(client, app.ticker.lastTime);
})

/*


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

const onClick = (e:PIXI.interaction.InteractionEvent)=>
{
    if (e.target == board)
    {
        Object.entries(client.state.creatures).forEach(([id,creature])=>
        {
            if (creature.owner == client.id)
            {
                let p = e.data.getLocalPosition(board);
                let vx = p.x - creature.x;
                let vy = p.y - creature.y;
                let l = Math.sqrt(vx*vx+ vy*vy);
                if (l > creature.movement)
                {
                    pushFloatingMessage(new FloatingMessage("Not enough movement"))
                    .position = new PIXI.Point(p.x * 32, p.y * 32);
                }
                client.pushCommand({
                    creatureAction:{
                        creatureId:id,
                        moveTo:p
                    }
                }, true);
            }
        });
    }
};

board.on('click', onClick);


app.ticker.add((dt)=>
{
    const animationSpeed = 1000;
    const animationIndex = (app.ticker.lastTime % animationSpeed) < animationSpeed/2 ? 0 : 1;
    const s = client.state;
    if (s == null)
        return;
    roundText.text= `Round: ${s.round}`;
    let me:string = null;
    for (let id in s.creatures)
    {
        let c = s.creatures[id];
        if (c.owner == client.id)
            me = id;
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

        if (s.turn == null || s.turn.creatureId != id)
            o.tint = 0xAAAAAA;
        else
            o.tint = 0xFFFFFF;


        assets.setCreatureSprite(o, c.class1, animationIndex);
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

    if (me != null)
    {
        let creature = s.creatures[me];
        //modeText.text = "Move";
        statsText.text = "Movement: \n" + Math.floor(creature.movement * 5) + "/" + Math.floor(creature.movementTotal * 5);
    }

 //   if (!(s.turn == null || s.turn.creatureId != me))
    {
        ui.alpha = (s.turn == null || s.turn.creatureId != me) ? 0.75 : 1.0;
    }

    update(client);
});

*/
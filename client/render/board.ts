import * as PIXI from 'pixi.js';
import { Client } from 'cmdserverclient';
import { State, Command } from '../../server/shared';
import * as assets from './../assets';
import { UI } from './ui';
import { FloatingMessage } from './floatingmessage';

export class Board extends PIXI.Container
{
    creatures:PIXI.Container;
    client:Client<State, Command>;
    constructor(client:Client<State, Command>)
    {
        super();
        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(0,0, 10000, 10000);
        this.client = client;
        const s = 2;
        this.scale.set(16*s);
        this.creatures = new PIXI.Container();
        this.addChild(this.creatures);

        this.on('click', this.onClick);
    }

    onFloatingMessage:(msg:FloatingMessage)=>any = (msg)=>{}

    onClick(e:PIXI.interaction.InteractionEvent)
    {
        console.log("test");
        if (e.target == this)
        {
            Object.entries(this.client.state.creatures).forEach(([id,creature])=>
            {
                if (creature.owner == this.client.id)
                {
                    let p = e.data.getLocalPosition(this);
                    let vx = p.x - creature.x;
                    let vy = p.y - creature.y;
                    let l = Math.sqrt(vx*vx+ vy*vy);
                    if (l > creature.movement)
                    {
                        let msg = new FloatingMessage("Not enough movement");
                        msg.position = new PIXI.Point(p.x * 32, p.y * 32);
                        this.onFloatingMessage(msg);
                    }
                    this.client.pushCommand({
                        creatureAction:{
                            creatureId:id,
                            moveTo:p
                        }
                    }, true);
                }
            });
        }
    }

    tick(lastTime:number)
    {
        const s = this.client.state;
        const animationSpeed = 1000;
        const animationIndex = (lastTime % animationSpeed) < animationSpeed/2 ? 0 : 1;
        let me:string = null;
        for (let id in s.creatures)
        {
            let c = s.creatures[id];
            if (c.owner == this.client.id)
                me = id;
            let o:PIXI.Sprite = this.creatures.children.filter(o=>o.name ==id)[0] as PIXI.Sprite;
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
                //o.on('click', onClick)
                this.creatures.addChild(o);
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
    }
}
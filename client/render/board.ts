import * as PIXI from 'pixi.js';
import { Client } from 'cmdserverclient';
import { State, Command } from '../../server/shared';
import * as assets from './../assets';

export class Board extends PIXI.Container
{
    creatures:PIXI.Container;
    constructor()
    {
        super();
        const s = 2;
        this.scale.set(16*s);
        this.creatures = new PIXI.Container();
        this.addChild(this.creatures);
    }

    tick(client:Client<State, Command>, lastTime:number, s:State)
    {
        const animationSpeed = 1000;
        const animationIndex = (lastTime % animationSpeed) < animationSpeed/2 ? 0 : 1;
        let me:string = null;
        for (let id in s.creatures)
        {
            let c = s.creatures[id];
            if (c.owner == client.id)
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
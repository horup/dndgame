import * as PIXI from 'pixi.js';
import { State, Command } from '../../server/shared';
import { Client } from 'cmdserverclient';
import { FloatingMessage } from './floatingmessage';

export class UI extends PIXI.Container
{
    debug:PIXI.Text;
    floatingMessages:PIXI.Container;
    constructor()
    {
        super();
        this.debug = new PIXI.Text("");
        this.addChild(this.debug);
        this.floatingMessages = new PIXI.Container();
        this.addChild(this.floatingMessages);
    }
    tick(client:Client<State, Command>, lastTime:number, s:State)
    {
        this.debug.text = "";

        this.debug.text= `Round: ${s.round}\n`;

        this.floatingMessages.children.forEach((msg:FloatingMessage)=>
        {
            msg.update();
        });
    }
}
import * as PIXI from 'pixi.js';
import { State, Command } from '../../server/shared';
import { Client } from 'cmdserverclient';
import { FloatingMessage } from './floatingmessage';

export class UI extends PIXI.Container
{
    debug:PIXI.Text;
    floatingMessages:PIXI.Container;
    client:Client<State, Command>;
    constructor(client:Client<State, Command>)
    {
        super();
        this.client = client;
        this.debug = new PIXI.Text("");
        this.addChild(this.debug);
        this.floatingMessages = new PIXI.Container();
        this.addChild(this.floatingMessages);
    }

    pushFloatingMessage(msg:FloatingMessage)
    {
        this.floatingMessages.addChild(msg);
    }
    
    tick(lastTime:number)
    {
        const s = this.client.state;
        this.debug.text = "";

        this.debug.text= `Round: ${s.round}\n`;

        this.floatingMessages.children.forEach((msg:FloatingMessage)=>
        {
            msg.update();
        });
    }
}
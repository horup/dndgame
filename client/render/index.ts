import * as PIXI from 'pixi.js';
import { FloatingMessage } from './floatingmessage';
import { Client } from 'cmdserverclient';
import { Command, State } from '../../server/shared';
import { Board } from './board';
import { UI } from './ui';
export * from './floatingmessage';

export class Render
{
    app:PIXI.Application;
    root:PIXI.Container;

    board:Board;
    ui:UI;
    client:Client<State, Command>;

    constructor(app:PIXI.Application, client:Client<State, Command>)
    {
        this.client = client;
        this.app = app;
        this.root = app.stage;
        this.ui = new UI(this.client);
        this.board = new Board(this.client);

        this.board.onFloatingMessage = (msg)=>
        {
            this.ui.pushFloatingMessage(msg);
        };

        this.root.addChild(this.board);
        this.root.addChild(this.ui);
    }

    tick(lastTime:number)
    {
        const s = this.client.state;
        if (s == null)
            return;

        this.board.tick(lastTime);
        this.ui.tick(lastTime);
    }
}
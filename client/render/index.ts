import * as PIXI from 'pixi.js';
import { FloatingMessage } from './floatingmessage';
import { Client } from 'cmdserverclient';
import { Command, State } from '../../server/shared';
export * from './floatingmessage';

const canvas:HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
export const app = new PIXI.Application({
    view:canvas
})

const ground = new PIXI.Container();
export const creatures = new PIXI.Container();
export const board = new PIXI.Container();
board.hitArea = {contains:(x, y)=>true};
board.scale.set(16*2);
board.addChild(ground);
board.addChild(creatures);
app.stage.addChild(board);
export const ui = new PIXI.Container();
app.stage.addChild(ui);

board.interactive =true;

export const roundText = new PIXI.Text("Round", {fill:'white', stroke:'black'} as PIXI.TextStyle);
export const modeText = new PIXI.Text("", {fill:'white', stroke:'black'} as PIXI.TextStyle);
export const statsText = new PIXI.Text("", {fill:'white', stroke:'black'} as PIXI.TextStyle);
modeText.position.y = 32;
statsText.position.y = modeText.y + 32;
ui.addChild(roundText);
ui.addChild(modeText);
ui.addChild(statsText);


const floatingMessages = new PIXI.Container();
ui.addChild(floatingMessages);

export const pushFloatingMessage = (msg:FloatingMessage)=>
{
    floatingMessages.addChild(msg);
    return msg;
}


export const update = (client:Client<State, Command>) =>
{
    floatingMessages.children.forEach((msg:FloatingMessage)=>
    {
        msg.update();
    });
}
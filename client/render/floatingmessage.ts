import * as PIXI from 'pixi.js';

export class FloatingMessage extends PIXI.Text
{
    constructor(s:string)
    {
        super(s, {fill:'white', fontSize:14} as PIXI.TextStyle);
        this.anchor.x = 0.5;
        this.anchor.y = 1.0;
    }

    update()
    {
        this.alpha -= 0.01;
        if (this.alpha <= 0)
        {
            //this.parent.removeChild(this)
        }
    }
}
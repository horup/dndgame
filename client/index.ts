import {Client, Handler, process} from 'cmdserverclient';
import {State, Command, setHandler, Creature, findCreaturesWithOwner} from '..';
import * as PIXI from 'pixi.js';
import {CenteredText, AtlasSpriteContainer, AtlasMap, pan, zoom} from 'pixigamelib';
import { renderHandler, uiHandler } from './handlers';

const app = new PIXI.Application({
    resizeTo:window
})
document.body.appendChild(app.view);

const game = new PIXI.Container();
game.scale.set(64);
const ui = new PIXI.Container();

const status = new CenteredText(app.view, "Loading assets...", {fill:'white'});

app.stage.addChild(game);
app.stage.addChild(ui);
app.stage.addChild(status);

app.loader
.add("dwarf", require('./assets/dwarf.png'))
.add("skeleton", require('./assets/skeleton.png'))
.on('complete', ()=>
{
    onLoad();
}).load();


export interface Context
{
    sprites:AtlasSpriteContainer;
    cursorText:PIXI.Text;
    mouse:PIXI.interaction.InteractionData;
    client:Client<State, Command>;
    actions:PIXI.Container;
}

function onLoad()
{
    const res = app.loader.resources;
    const atlases:AtlasMap = {
        0:{columns:1, rows:1, texture:res.dwarf.texture.baseTexture},
        1:{columns:1, rows:1, texture:res.skeleton.texture.baseTexture}
    }
    const sprites = new AtlasSpriteContainer(atlases);
    game.addChild(sprites);
    const cursorText = new PIXI.Text("hello world!", {fill:'white', fontSize:'12pt'} as PIXI.TextStyle);
    cursorText.anchor.x = -0.1;
    cursorText.anchor.y = -1.0;

    const actions = new PIXI.Container();
    ui.addChild(actions);
    ui.addChild(cursorText);
    status.text = "Connecting...";

    const client = new Client<State, Command, Context>({info:(s)=>{}});
    client.context = {
        sprites:sprites,
        cursorText:cursorText,
        mouse:app.renderer.plugins.interaction.mouse,
        client:client,
        actions:actions
    }

    app.renderer.plugins.interaction.mouse.global;

    client.handlers = [
        setHandler,
        renderHandler,
        uiHandler,
        (s, c)=>
        {
            if (!c.serverTick && !c.clientTick)
                console.log(c);
        }
    ]
    client.connect("ws://localhost:8080").then(e=>
    {
        if (e == true)
        {
            status.text = "";
        }
        else
        {
            status.text = "Connection failed, refresh and try again"
        }
    });

    
    window.onkeydown = (e:KeyboardEvent)=>
    {
        const panSpeed = 10;
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

    window.onmousewheel = (e:MouseWheelEvent)=>
    {
        const dir = Math.sign(e.deltaY);
        if (dir != 0)
        {
            console.log(dir);
            const speed = 1.1;

            zoom(game, dir < 0 ? speed : 1/speed, new PIXI.Point(e.x, e.y));
        }
    }

    window.onmousemove = (e:MouseEvent)=>
    {
        if (e.buttons == 2)
        {
            pan(game, -e.movementX, -e.movementY);
        }
    }

    window.onmousedown = (e:MouseEvent)=>
    {
        if (client.state == null)
            return;

        if (e.buttons == 1)
        {
            const local = sprites.toLocal(new PIXI.Point(e.x, e.y));
            const [id, c] = findCreaturesWithOwner(client.id, client.state)[0];
            if (id && c)
            {
                client.pushCommand({
                    creatureAction:{
                        creatureId:id,
                        moveTo:local
                    }
                }, true);
            }
        }
    }

    app.ticker.add(()=>
    {
        if (client.state != null)
            client.pushCommand({clientTick:{}}, false);
    })

}

window.oncontextmenu = (e:MouseEvent)=>
{
    e.preventDefault();
}
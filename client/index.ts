import {Client, Handler, process} from 'cmdserverclient';
import {State, Command, setter, Creature} from '..';
import * as PIXI from 'pixi.js';
import {CenteredText, AtlasSpriteContainer, AtlasMap, pan, zoom} from 'pixigamelib';

const app = new PIXI.Application({
    resizeTo:window
})
document.body.appendChild(app.view);

const game = new PIXI.Container();
game.scale.set(64);
const status = new CenteredText(app.view, "Loading assets...", {fill:'white'});

app.stage.addChild(game);
app.stage.addChild(status);

app.loader
.add("dwarf", require('./assets/dwarf.png'))
.add("skeleton", require('./assets/skeleton.png'))
.on('complete', ()=>
{
    onLoad();
}).load();


function onLoad()
{
    const res = app.loader.resources;
    const atlases:AtlasMap = {
        0:{columns:1, rows:1, texture:res.dwarf.texture.baseTexture},
        1:{columns:1, rows:1, texture:res.skeleton.texture.baseTexture}
    }
    const sprites = new AtlasSpriteContainer(atlases);
    game.addChild(sprites);
    sprites.setSprites({'a':{atlas:0, frame:0, x:0, y:0, zIndex:0}});
    sprites.setSprites({'b':{atlas:1, frame:0, x:1, y:0, zIndex:0}});
    status.text = "Connecting...";
    const client = new Client<State, Command>({info:(s)=>{}});
    client.handlers = [
        setter,
        (s, c)=>
        {
           /* if (!c.tick)
                console.log(c);*/
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
        pan(game, -1, 1);
     /*   Object.entries(client.state.creatures).forEach(([id,creature])=>
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
        });*/
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
        if (e.buttons == 1)
        {
            pan(game, -e.movementX, -e.movementY);
        }
    }

}


window.oncontextmenu = (e:MouseEvent)=>
{
    e.preventDefault();
}
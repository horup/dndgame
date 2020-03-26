import {Client, Handler} from 'cmdserverclient';
import {State, Command, setter} from '../shared';

const client = new Client<State, Command>({info:(s)=>{}});

const canvas:HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

client.handlers = [
    setter,
    (s, c)=>
    {
        if (c.tick)
        {
            
        }
    }
]


client.connect("ws://localhost:8080");



const render = ()=>
{
    window.requestAnimationFrame(render);
    const w = 640;
    const h = 480;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, w, h);

    if (client.state == null)
        return;

    ctx.fillStyle = 'red';
    for (let id in client.state.creatures)
    {
        let m = client.state.creatures[id];
        ctx.fillRect(m.x, m.y, 16,16);
        
    }

}

render();

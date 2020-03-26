import {Client, Handler} from 'cmdserverclient';
import {State, Command, setter} from '../shared';

const client = new Client<State, Command>({info:(s)=>console.log(s)});
client.handlers = [
    setter,
    (s, c)=>
    {
        if (c.tick)
        {
            console.clear();
            console.log(`Monsters:`, JSON.stringify(s.monsters));
        }
    }
]

client.connect("ws://localhost:8080");

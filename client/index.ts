import {Client, Handler} from 'cmdserverclient';
import {State, Command, setter} from '../shared';

const client = new Client<State, Command>({info:(s)=>console.log(s)});
client.handlers = [
    setter
]

import * as http from 'http';
import {Server} from 'cmdserverclient';
import {State, Command, Monster, setter, defaultState} from '../shared';


const httpServer = new http.Server();
const server = new Server<State, Command>(defaultState, {info:(s)=>console.log(s)});
server.attach(httpServer);
httpServer.listen(8080, "0.0.0.0");
import {Handler} from 'cmdserverclient';

export interface State
{
    round:number;
    monsters:{readonly [id:number]:Monster};
}

export interface Monster
{
    readonly x:number;
    readonly y:number;
    readonly health:number;
}

export interface Command
{
    /** Sets monsters */
    setMonsters?:{readonly [id:number]:Monster};
    
    /** A tick occured */
    tick?:{}
}

export const defaultState:State = {round:0, monsters:{}};

export const setter:Handler<State, Command> = (s, c, push)=>
{
    if (c.setMonsters)
    {
        s.monsters = {...s.monsters, ...c.setMonsters}; 
    }
}
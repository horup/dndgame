import {Handler} from 'cmdserverclient';

export interface State
{
    round:number;
    creatures:{readonly [id:number]:Creature};
}

export interface Creature
{
    readonly x:number;
    readonly y:number;
    readonly health:number;
}

export interface Command
{
    /** Sets creatures */
    setCreatures?:{readonly [id:number]:Creature};
    
    /** A tick occured */
    tick?:{}
}

export const defaultState:State = {round:0, creatures:{}};

export const setter:Handler<State, Command> = (s, c, push)=>
{
    if (c.setCreatures)
    {
        s.creatures = {...s.creatures, ...c.setCreatures}; 
    }
}
import {Handler} from 'cmdserverclient';

export interface State
{
    round:number;
    creatures:{readonly [id:number]:Creature};
}

export interface Creature
{
    /** The owner of the creature, such as a player */
    readonly owner?:string;
    readonly x:number;
    readonly y:number;
    readonly hitpoints:number;
}

export interface Command
{
    /** Sets creatures */
    readonly setCreatures?:{readonly [id:number]:Creature};

    /** Deletes a creature */
    readonly deleteCreature?:{readonly id:number};

    /** Player joined the game */
    readonly playerJoined?:{readonly id:string};

    /** Player left the game */
    readonly playerLeft?:{readonly id:string};

    /** Input from a player */
    readonly playerInput?:{
        readonly id?:string, 
        readonly moveTo:{x:number, y:number}}

    readonly tick?:{};
    
    /** A new round has started*/
    readonly newRoundStarted?:{readonly round:number};
}

export const defaultState:State = {round:0, creatures:{}};

export const setter:Handler<State, Command> = (s, c, push)=>
{
    if (c.setCreatures)
    {
        s.creatures = {...s.creatures, ...c.setCreatures}; 
    }
    if (c.deleteCreature)
    {
        let creatures = {...s.creatures};
        delete creatures[c.deleteCreature.id];
        s.creatures = creatures;
    }
}
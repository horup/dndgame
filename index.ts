import {Handler} from 'cmdserverclient';

export interface State
{
    turn?:Turn;

    /** the current round */
    round:number;
    creatures:{readonly [id:string]:Creature};
}

export enum CreatureType
{
    Dwarf = 0,
    Skeleton = 1
}


export interface Creature
{
    /** The owner of the creature, such as a player */
    readonly owner?:string;
    readonly x:number;
    readonly y:number;
    readonly hitpoints:number;

    /** The creatures initiative */
    readonly initiative:number; 

    /** True if the creatures acted this round */
    readonly acted:boolean;
    readonly class1:CreatureType; 

    readonly movement:number;
    readonly movementTotal:number;
}

export interface Turn
{
    /** This creature has the turn */
    readonly creatureId:string;
}

export interface Command    
{
    /** set the turn */
    readonly setTurn?:{readonly turn:Turn};

    /** turn ended */
    readonly endTurn?:{};

    /** Sets creatures */
    readonly setCreatures?:{readonly [id:string]:Creature};

    /** Deletes a creature */
    readonly deleteCreature?:{readonly id:string};

    /** Player joined the game */
    readonly playerJoined?:{readonly id:string};

    /** Player left the game */
    readonly playerLeft?:{readonly id:string};

    readonly serverTick?:{};
    readonly clientTick?:{};
    
    /** A new round has started*/
    readonly setRound?:{readonly round:number};

    /** A creature with id took an action */
    readonly creatureAction?:{
        readonly creatureId:string;
        readonly moveTo?:{x?:number, y?:number}
        readonly endTurn?:boolean
    }
}

export const defaultState:State = {round:0, turn:undefined, creatures:{}};

export const setHandler:Handler<State, Command> = (s, c, push)=>
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
    if (c.setRound)
    {
        s.round = c.setRound.round;
    }
    if (c.setTurn)
    {
        s.turn = c.setTurn.turn;
    }
}

export const Dice = 
{
    d20:(modifier:number = 0)=>{
        return Math.ceil(Math.random()*20) + modifier;
    }
}
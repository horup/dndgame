import {Handler} from 'cmdserverclient';

export interface State
{
    turn?:Turn;

    /** the current round */
    round:number;
    creatures:{readonly [id:number]:Creature};
}

export enum Class
{
    Fighter,
    Skeleton
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

    readonly class1:Class; 

}

export interface Turn
{
    readonly creatureId:number;
}

export interface Command    
{
    /** set the turn */
    readonly setTurn?:{readonly turn:Turn};

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
    readonly setRound?:{readonly round:number};
}

export const defaultState:State = {round:0, turn:undefined, creatures:{}};

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
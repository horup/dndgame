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

export enum ActionType
{
    Attack = 0,
    Dodge = 1
}

export enum ActionFuel
{
    Speed = 0,
    ActionPoints = 1,
    BonusActionPoints = 2,
    ReactionActionPoints = 3
}

export interface Action
{
    /**The type of action being performed */
    type:ActionType;

    /**The human readable description of the action */
    description:string;

    /**The optional range of the action.
     * If not specified, no range check needs to be done.
     */
    range?:number;
    
    /**True if the action targets other creatures. 
     */
    targetsOther?:boolean;

    /**True if the action targets the creature performing the action */
    targetSelf?:boolean;
}

export interface Creature
{
    /** The owner of the creature, such as a player */
    readonly owner?:string;
    readonly x:number;
    readonly y:number;
    readonly hitpoints:number;

    readonly size:number;

    /** The creatures initiative */
    readonly initiative:number; 

    /** True if the creatures acted this round */
    readonly acted:boolean;
    readonly class1:CreatureType; 

    readonly movement:number;
    readonly movementTotal:number;

    readonly actionPoints:number;
    readonly avaliableActions:Action[];
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

export const distance = (from:{x:number, y:number}, to:{x:number, y:number}) =>
{
    let vx = to.x - from.x;
    let vy = to.y - from.y;
    const l = vx*vx + vy*vy;
    return Math.sqrt(l); 
}

/**Returns true if the creature has the turn and can thus act right now */
export const hasTurn = (creatureId:string, state:State)=>
{
    const c = findCreatureWithTurn(state);
    if (c != null && c[0] == creatureId)
        return true;
    return false;
}

/**Gets the creature whom has the turn. 
 * Returns null if no creatures have the turn right now. 
 */
export const findCreatureWithTurn = (state:State)=>
{
    if (state.turn && state.turn.creatureId != null)
    {
        const creature = state.creatures[state.turn.creatureId];

        return [state.turn.creatureId, creature] as [string, Creature];
    }

    return null;
}

/**Finds creature with the given ownerid */
export function findCreaturesWithOwner(ownerId:string, state:State)
{
    return Object.entries(state.creatures).filter(([id, c])=>c.owner == ownerId);
}

export const Dice = 
{
    d20:(modifier:number = 0)=>{
        return Math.ceil(Math.random()*20) + modifier;
    }
}

/**Returns null if x and y are not blocked by a creature, where id is the creature id
 * else returns the creature id which blocks the creature with the given id */
export function isBlockedByCreature(x:number, y:number, id:string, state:State)
{
    let blocked:string = null;
    let creature = state.creatures[id];
    Object.entries(state.creatures).forEach((v)=>{
        if (v[0] != id && blocked == null)
        {
            let c = v[1];
            const l = creature.size + c.size;
            let vx = c.x - x;
            let vy = c.y - y;
            if (Math.sqrt(vx*vx+vy*vy) <= l)
            {
                blocked = v[0];
            }
        }
    });
    return blocked;
}

/**Gets the creature where x and y intersects with its radius.
 * Returns null if no creature is found
 */
export function getCreatureAtPoint(x:number, y:number, state:State):[string, Creature]
{
    let creature:[string, Creature] = null;
    Object.entries(state.creatures).forEach(([id, c])=>{
        if (creature == null)
        {
            let vx = c.x - x;
            let vy = c.y - y;
            let l = Math.sqrt(vx*vx+vy*vy);
            if (l <= c.size)
            {
                creature = [id, c];
            }
        }
    })

    return creature;
}

/**Returns true if the target creature id is in attack range of the attacker */
export function isInAttackRange(attacker:string, target:string, state:State)
{
    let c1 = state.creatures[attacker];
    let c2 = state.creatures[target];
    const vx = c1.x - c2.x;
    const vy = c1.y - c2.y;
    const l = Math.sqrt(vx*vx+vy*vy);
    const range = c1.size+c2.size+0.5;
    if (l<=range)
    {
        return true;
    }

    return false;
}


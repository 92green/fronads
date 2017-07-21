// @flow

import Either, {Left, Right} from './Either';
import {getIn} from './util/Data';

/**
 * The maybe monad is a way to represent null values without being forced to check for their existence. Maybe is the identity monad but with an added condition. The maybe says "I will only ever call map/flatmap if I am a Some. "
 *
 *
 * ```
 * Some(5).map(ii => ii * 2) // Some(10)
 * None().map(ii => ii * 2) // None()
 * ```
 *
 * Maybe lets you declaratively write what should happen to data, but only excecutes if that data exists.
 *
 * ### Units
 * Some(value)
 * None()
 * Perhaps(value)
 * PerhapsIn(value, path)
 *
 * ### Examples
 * #### Unknown Deep Children
 * #### Don't Render without data
 * ####
 *
 * * [Some](#module:Maybe~Some)
 * * [None](#module:Maybe~None)
 * @module Maybe
 */

/**
 * Maybe class
 */
class Maybe {

    /**
     * Maybe constructor
     *
     * @param {*} value - The value to store
     * @param {boolean} isSome - Whether or not the maybe is `some` or `none`
     * @return {Maybe}
     */
    constructor(value: any, isSome: boolean) {
        this.isSome = isSome;
        this.val = value;
    }

    /**
     * Unit function
     * @param {any} value
     * @return {Either}
     */
    unit(value: any): Maybe {
        return Some(value);
    }

    /**
     * Perform a flatMap on the current maybe
     *
     * @param {Function} fn - perform a flatMap if Some
     * @return {Some}
     */
    flatMap(fn: Function): any {
        return this.isSome ? fn(this.val) : this;
    }

    /**
     * map
     * @param {Function} fn
     * @return {Maybe}
     */
    map(fn: any): Maybe {
        return this.flatMap(value => this.unit(fn(value)));
    }


    /**
     * Return the maybe's value if it is 'some' or else return `defaultValue`
     * @param {*} [defaultValue = null] - value that is Some
     * @return {*}
     */
    value(defaultValue: any = null): any {
        return this.val == null ? defaultValue : this.val;
    }

    /**
     * Change the Maybe to an Either. If `Some` the value is placed in `Right`
     * if `None` the value of `leftValue` is placed in a `Left`.
     *
     * @inner
     * @param {*} leftValue - Value to place in the Left side
     * @return {Either}
     */
    toEither(leftValue: any): Either {
        return this.isSome ? Right(this.val) : Left(leftValue);
    }

    toJSON(): * {
        return this.isSome ? this.val : null;
    }
}


export function MaybeFactory(value: any, isSome: boolean): Maybe {
    return new Maybe(value, isSome);
}

/**
 * Creates a new Maybe as 'Some' value
 * @return {Maybe}
 * @example
 * var person = Some({
 *     name: "Derek Tibbs",
 *     child: Some({
 *         name: "Derek Tibbs Jr"
 *     })
 * });
 */
export function Some(value: any): Maybe {
    return MaybeFactory(value, true);
}

/**
 * Creates a new Maybe as 'None' value
 *
 * @example
 * var person = Some({
 *     name: "Derek Tibbs",
 *     child: None()
 * });
 */
export function None(): Maybe {
    return MaybeFactory(null, false);
}

/**
 * Create a new Maybe where the value is uncertain.
 * @param {any} value
 * @return {Maybe}
 * @example
 * var person = Perhaps(possibleNullValue);
 */
export function Perhaps(value: any): Maybe {
    return value == null ? None() : Some(value);
}


/**
 * Create a new Maybe from a deep uncertain value.
 * @param {any} value
 * @param {string[]} path
 * @return {Maybe}
 * @example
 * var person = PerhapsIn({foo: {bar: possibleNullValue}}, ['foo', 'bar']);
 */
export function PerhapsIn(value: any, path: string[]): Maybe {
    const deepValue = getIn(value, path);
    return deepValue == null ? None() : Some(deepValue);
}




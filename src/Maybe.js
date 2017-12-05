// @flow

import {Left, Right, Either} from './Either';
import {getIn} from './util/Data';

/**
 * The maybe monad is a way to represent null values without being forced to check for their existence. Maybe is the identity monad but with an added condition. The maybe says "I will only ever call map/flatmap if I am a Some. "
 *
 *
 * ```
 * Some(5).map(ii => ii * 2) // Some(10)
 * None.map(ii => ii * 2) // None
 * ```
 *
 * Maybe lets you declaratively write what should happen to data, but only excecutes if that data exists.
 *
 * ### Units
 * Some(value)
 * None
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
export class Maybe<T> {
    val: T;
    isSome: boolean;

    /**
     * Maybe constructor
     *
     * @param {*} value - The value to store
     * @param {boolean} isSome - Whether or not the maybe is `some` or `none`
     * @return {Maybe}
     */
    constructor(value: T, isSome: boolean) {
        this.isSome = isSome;
        this.val = value;
    }

    /**
     * Unit function
     * @param {any} value
     * @return {Either}
     */
    unit<U>(value: U): Maybe<U> {
        return Some(value);
    }

    /**
     * Perform a flatMap on the current maybe
     *
     * @param {Function} fn - perform a flatMap if Some
     * @return {Some}
     */
    flatMap<U>(fn: (T) => Maybe<U>): Maybe<U> {
        return this.isSome ? fn(this.val) : None;
    }

    /**
     * map
     * @param {Function} fn
     * @return {Maybe}
     */
    map<U>(fn: (T) => U): Maybe<U> {
        return this.flatMap(value => this.unit(fn(value)));
    }

    /**
     * ap
     * @param {Maybe} maybeWithFn
     * @return {Maybe}
     */
    ap<U>(maybeWithFn: Maybe<(T) => U>): Maybe<U> {
        return this.isSome ? maybeWithFn.map(fn => fn(this.val)) : None;
    }

    /**
     * Return the maybe's value if it is 'some' or else return `defaultValue`
     * @param {*} [defaultValue = null] - value that is Some
     * @return {*}
     */
    value(defaultValue: any = null): T|any {
        return this.val == null ? defaultValue : this.val;
    }

    /**
     * Change the Maybe to a Some or None based on the result of a predicate
     * @param {Function} predicate
     * @return {Maybe}
     */
    filter(predicate: T => boolean): Maybe<T> {
        return this.isSome && predicate(this.val) ? Some(this.val) : None;
    }

    /**
     * Change the Maybe to an Either. If `Some` the value is placed in `Right`
     * if `None` the value of `leftValue` is placed in a `Left`.
     *
     * @inner
     * @param {*} leftValue - Value to place in the Left side
     * @return {Either}
     */
    toEither<L>(leftValue: L): Either<L, T> {
        return this.isSome ? Right(this.val) : Left(leftValue);
    }

    toJSON(): * {
        return this.isSome ? this.val : null;
    }
}


export function MaybeFactory<T>(value: T, isSome: boolean): Maybe<T> {
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
export function Some<T>(value: T): Maybe<T> {
    return MaybeFactory(value, true);
}

/**
 * Creates a new Maybe as 'None' value
 *
 * @example
 * var person = Some({
 *     name: "Derek Tibbs",
 *     child: None
 * });
 */
export const None: Maybe<any> = new Maybe(null, false);

/**
 * Create a new Maybe where the value is uncertain.
 * @param {any} value
 * @return {Maybe}
 * @example
 * var person = Perhaps(possibleNullValue);
 */
export function Perhaps<T>(value: T): Maybe<T> {
    return value == null ? None : Some(value);
}


/**
 * Create a new Maybe from a deep uncertain value.
 * @param {any} value
 * @param {string[]} path
 * @return {Maybe}
 * @example
 * var person = PerhapsIn({foo: {bar: possibleNullValue}}, ['foo', 'bar']);
 */
export function PerhapsIn(value: any, path: string[]): Maybe<any> {
    const deepValue = getIn(value, path);
    return deepValue == null ? None : Some(deepValue);
}




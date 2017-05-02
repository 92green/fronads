// @flow

import Either, {Left, Right} from './Either';

/**
 * @module Maybe
 * @description Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, porro dolorem blanditiis minima harum corporis praesentium animi sunt libero officia, illo esse sed in, commodi quibusdam ipsum nam mollitia dolor.
 */

/**
 * Creates a new Maybe as 'Some' value
 * @example
 * var person = Some({
 *     name: "Derek Tibbs",
 *     child: Some({
 *         name: "Derek Tibbs Jr"
 *     })
 * });
 */
export function Some(value: any): Maybe {
    return new Maybe(value, true);
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
    return new Maybe(null, false);
}


/**
 * Maybe constructor
 *
 * @param {*} value - The value to store
 * @param {boolean} isSome - Whether or not the maybe is `some` or `none`
 *
 * @class
 * @name Maybe
 * @kind class
 */
export default class Maybe {
    static fromNull(value: any): Maybe {
        return value == null ? None() : Some(value);
    }

    constructor(value: any, isSome: boolean) {
        this.isSome = isSome;
        this.val = value;
    }

    /**
     * Unit function
     *
     * #### `maybe.unit(A): Some[A]`
     * ```
     * Maybe
     * ```
     */
    unit(value: any): Maybe {
        return Some(value);
    }

    /**
     * Perform a flatMap on the current maybe
     *
     * @param {Function} fn - perform a flatMap if Some
     * @return {Some}
     * @kind function
     * @inner
     */
    flatMap(fn: Function): any {
        return this.isSome ? fn(this.val) : this;
    }

    /**
     * `map(fn: A => B): Some(B)`
     * @kind function
     * @inner
     */
    map(fn: any): Maybe {
        return this.flatMap(value => this.unit(fn(value)));
    }


    /**
     * Return the maybe's value if it is 'some' or else return `defaultValue`
     *
     * @kind function
     * @inner
     * @param {*} [defaultValue = null] - value that is Some
     * @return {*}
     */
    value(defaultValue: any = null): any {
        return this.val == null ? defaultValue : this.val;
    }

    /**
     * Change the Maybe to an Either. If `Some` the value is placed in `Right`
     * if `None` the value of `leftValue` is placed in a `Left`
     *
     * @inner
     * @param {*} [leftValue] - Value to place in the Left side
     * @return {Either}
     */
    toEither(leftValue: any): Either {
        return this.isSome ? Right(this.val) : Left(leftValue);
    }
}

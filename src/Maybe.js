// @flow

import Either, {Left, Right} from './Either';
//
// Identities
//


/**
 * Flatmapper...
 *
 * @callback MaybeFlatMap
 * @param {Maybe-A} A
 * @return {Maybe-B} B
 */

/**
 * @module Maybe
 */

/**
 * Creates a new Maybe as 'Some' value
 *
 * @param {*} value
 * @return {Some}
 *
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
 * Creates a new Maybe as 'Some' value
 *
 * @param {ColumnUpdater} updater
 * @return {Maybe} A new `ChartData` containing the updated columns.
 *
 * @example
 * var person = Some({
 *     name: "Derek Tibbs",
 *     child: Some({
 *         name: "Derek Tibbs Jr"
 *     })
 * });
 */
export function None(): Maybe {
    return new Maybe(null, false);
}


/**
 * Maybe Class Description
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
     * @param {*} value that is Some.
     * @return {Some}
     *
     * @name unit
     * @kind function
     * @inner
     */
    unit(value: any): Maybe {
        return Some(value);
    }

    /**
     * map
     *
     * @param {*} value that is Some.
     * @return {Some}
     *
     * @name map
     * @kind function
     * @inner
     */
    map(fn: any): Maybe {
        return this.flatMap(value => this.unit(fn(value)));
    }

    /**
     * flatMap
     *
     * @param {MaybeFlatMap} fn - perform a flatMap if Some
     * @return {Some}
     *
     * @name flatMap
     * @kind function
     * @inner
     */
    flatMap(fn: Function): any {
        return this.isSome ? fn(this.val) : this;
    }

    /**
     * value
     *
     * @param {*} value that is Some.
     * @return {Some}
     *
     * @name value
     * @kind function
     * @inner
     */
    value(defaultValue: any = null): any {
        return this.val == null ? defaultValue : this.val;
    }

    toEither(leftValue: any): Either {
        return this.isSome ? Right(this.val) : Left(leftValue);
    }
}

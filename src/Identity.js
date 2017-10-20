// @flow

import {Right, Either} from './Either';
import {Some, Maybe} from './Maybe';

import type {Mapper} from './definitions';

// ```
// withData(withState(component))

// Some(component)
//     .map(withState)
//     .map(withData)
//     .value();

// [withState, withData]
//     .reduce((rr, ii) => rr.map(ii), Some(component))
//     .value()

// [withData, withState]
//     .reverse()
//     .reduce((rr, ii) => rr.map(ii), Some(component))
//     .value()
// ```

/**
 * Identity is the vanilla ice cream of monads. Plain and simple, it is a function composer with only one state.
 * Identity says: "I will always map your function to my value".
 *
 * ```
 * // Composition
 * foo(bar(value));
 *
 * // Compose
 * Compose(foo, bar)(value);
 *
 * // Identity
 * Identity(value)
 *     .map(bar)
 *     .map(value)
 *     .value();
 *
 * ```
 *
 * ### Examples
 * * Hocks
 * * repeated Composition.
 *
 * ```js
 * import {Identity} from 'fronads';
 *
 * const add = aa => bb => aa + bb;
 *
 * Identity(5)
 *     .map(add(2))
 *     .map(add(-10))
 *     .value();
 * // -3
 *
 *
 * // Hocking a React component.
 * Some(UserProfile)
 *     .map(connect(({user}) => ({user}))
 *     .value();
 * ```
 * @module Identity`
 */

/**
 * Identity class
 */
export class Identity<T> {
    val: T;

    /**
     * Identity constructor
     *
     * @param {*} value - The value to store
     * @return {Identity}
     */
    constructor(value: T) {
        this.val = value;
    }

    /**
     * Unit function
     * @param {any} value
     * @return {Identity}
     */
    unit<U>(value: U): Identity<U> {
        return IdentityFactory(value);
    }

    /**
     * Perform a flatMap on the current identity
     *
     * @param {Function} fn - perform a flatMap
     * @return {Some}
     */
    flatMap<U>(fn: Mapper<T, Identity<U>>): Identity<U> {
        return fn(this.val);
    }

    /**
     * map
     * @param {Function} fn
     * @return {Identity}
     */
    map<U>(fn: Mapper<T,U>): Identity<U> {
        return this.flatMap(value => this.unit(fn(value)));
    }


    /**
     * Return the identity's value. If the value is null, return `defaultValue`
     * @param {*} [defaultValue = null]
     * @return {*}
     */
    value(defaultValue: any = null): any {
        return this.val == null ? defaultValue : this.val;
    }

    /**
     * Change the Identity to a Right Either.
     * @return {Either}
     */
    toEither(): Either<T> {
        return Right(this.val);
    }

    /**
     * Change the Identity to a Some Maybe.
     * @return {Maybe}
     */
    toMaybe(): Maybe<T> {
        return Some(this.val);
    }

    toJSON(): * {
        return this.val;
    }
}


export function IdentityFactory(value: any): Identity<any> {
    return new Identity(value);
}




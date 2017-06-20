// @flow

import {Right} from './Either';
import {Some} from './Maybe';

/**
 * Identity is a monad that has only one state. It has all the monad operations but
 * will always return the same state type.
 * It is useful as a way to compose functions.
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
 * @module Identity
 */

/**
 * Identity class
 */
class Identity {

    /**
     * Identity constructor
     *
     * @param {*} value - The value to store
     * @return {Identity}
     */
    constructor(value: any) {
        this.val = value;
    }

    /**
     * Unit function
     * @param {any} value
     * @return {Identity}
     */
    unit(value: any): Identity {
        return IdentityFactory(value);
    }

    /**
     * Perform a flatMap on the current identity
     *
     * @param {Function} fn - perform a flatMap
     * @return {Some}
     */
    flatMap(fn: Function): any {
        return fn(this.val);
    }

    /**
     * map
     * @param {Function} fn
     * @return {Identity}
     */
    map(fn: any): Identity {
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
    toEither(): Either {
        return Right(this.val);
    }

    /**
     * Change the Identity to a Some Maybe.
     * @return {Either}
     */
    toMaybe(): Maybe {
        return Some(this.val);
    }

    toJSON(): * {
        return this.val;
    }
}


export function IdentityFactory(value: any): Identity {
    return new Identity(value);
}




// @flow

import {Right} from './Either';
import {Some} from './Maybe';

function isElement(object: *): boolean {
    return (
        typeof object === 'object'
            && object !== null
            && (object['$$typeof'] || '').toString() === 'Symbol(react.element)'
                || object['$$typeof'] === 0xeac7
    );
}



/*
 * The Component Monad stores a nested chain of react elements+
 * @module Component
 */

/*
 * Component class
 */
class Component {
    val: *;

    /*
     * Component constructor
     *
     * @param {*} value - The value to store
     * @return {Component}
     */
    constructor(value: any) {
        this.val = isElement(value)
            ? {children: value}
            : value;
    }

    /*
     * Unit function
     * @param {any} value
     * @return {Component}
     */
    unit(value: any): Component {
        return ComponentFactory(value);
    }

    /*
     * Perform a flatMap on the current identity
     *
     * @param {Function} fn - perform a flatMap
     * @return {Some}
     */
    flatMap(fn: Function): any {
        return fn(this.val);
    }

    /*
     * map
     * @param {Function} fn
     * @return {Component}
     */
    map(fn: any): Component {
        return this.flatMap(props => this.unit(fn(props)));
    }


    /*
     * Return the identity's value. If the value is null, return `defaultValue`
     * @param {*} [defaultValue = null]
     * @return {*}
     */
    value(defaultValue: any = null): any {
        return this.val == null ? defaultValue : this.val.children;
    }

    /*
     * Change the Component to a Right Either.
     * @return {Either}
     */
    toEither(): Either {
        return Right(this.val);
    }

    /*
     * Change the Component to a Some Maybe.
     * @return {Maybe}
     */
    toMaybe(): Maybe {
        return Some(this.val);
    }

    toJSON(): * {
        return this.val;
    }
}


export function ComponentFactory(value: any): Component {
    return new Component(value);
}




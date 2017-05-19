// @flow

import {Some, None} from './Maybe';


/**
 * Either is monad that can hold a value of type `Left` or `Right`, but never at the same time.
 * @module Either
 */


/**
 * Either class
 */
class Either {

    /**
     * @param {any} value
     * @param {boolean} isRight
     * @return {Either}
     */
    constructor(value: any, isRight: boolean) {
        this.isRight = isRight;
        this.val = value;
    }

    /**
     * Unit function
     * @param {any} value
     * @return {Either}
     */
    unit(value: any): Either {
        return Right(value);
    }

    /**
     * flatMap
     * @param {Function} fn
     * @return {Either}
     */
    flatMap(fn: Function): Either {
        return this.isRight ? fn(this.val) : this;
    }

    /**
     * map
     * @param {Function} fn
     * @return {Either}
     */
    map(fn: Function): Either {
        return this.flatMap(value => this.unit(fn(value)));
    }

    /**
     * leftFlatMap
     * @param {Function} fn
     * @return {Either}
     */
    leftFlatMap(fn: Function): Either {
        return this.isRight ? this : fn(this.val);
    }

    /**
     * leftMap
     * @param {Function} fn
     * @return {Either}
     */
    leftMap(fn: Function): Either {
        return this.leftFlatMap(value => Left(fn(value)));
    }

    /**
     * ap
     * @param {Either} eitherWithFn
     * @return {Either}
     */
    ap(eitherWithFn: Either): Either {
        return this.isRight ? eitherWithFn.map(fn => fn(this.val)) : this;
    }

    /**
     * Provide functions to map both sides of the Either
     * @param {Function} leftFn
     * @param {Function} rightFn
     * @return {any}
     */
    biMap(leftFn: Function, rightFn: Function): Either {
        return this.isRight ? this.map(rightFn) : this.leftMap(leftFn);
    }

    /**
     * biFlatMap
     * @param {Function} leftFn
     * @param {Function} rightFn
     * @return {any}
     */
    biFlatMap(leftFn: Function, rightFn: Function): any {
        return this.isRight ? rightFn(this.val) : leftFn(this.val);
    }

    /**
     * Return the current value.
     * @return {any}
     */
    value(): any {
        return this.val;
    }

    /**
     * toMaybe
     * @return {Maybe}
     */
    toMaybe(): Maybe {
        return this.isRight ? Some(this.val) : None();
    }
}

export function EitherFactory(value: any, isRight: boolean): Either {
    return new Either(value, isRight);
}

/**
 * Create an Either as a Right value
 * @param {any} value
 * @return {Either}
 */
export function Right(value: any): Either {
    return EitherFactory(value, true);
}

/**
 * Create an Either as a Left value
 * @param {any} value
 * @return {Either}
 */
export function Left(value: any): Either {
    return EitherFactory(value, false);
}

/**
 * Create a Try Either. `func` is immediately exceuted,
 * if an error is thrown the Either will be Left(error) otherwise
 * the value of `func` is passed to a Right.
 * @param {Function} func
 * @return {Either}
 */
export function Try(func: Function): Either {
    try {
        return Right(func.call());
    } catch(error) {
        return Left(error);
    }
}


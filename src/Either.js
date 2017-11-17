// @flow

import {Maybe, Some, None} from './Maybe';

/**
 * The Either monad describes situations that have two distinct states: Right and Left. Often used
 * If the Either is Right map/Flatmap will be called and if the Either is Left leftMap/leftFlatMap will be called.
 *
 * If Identity has 1 state, Maybe has 1.5, Either has 2.
 *
 * @module Either
 */

export class Either<T> {
    val: T;
    isRight: boolean;

    constructor(value: T, isRight: boolean) {
        this.isRight = isRight;
        this.val = value;
    }

    /**
     * Unit function
     * @param {any} value
     * @return {Either}
     */
    unit<U>(value: U): Either<U> {
        return Right(value);
    }

    /**
     * flatMap
     * @param {Function} fn
     * @return {Either}
     */
    flatMap<U>(fn: (T) => Either<U>): Either<U> {
        return this.isRight ? fn(this.val) : Left(this.val);
    }

    /**
     * map
     * @param {Function} fn
     * @return {Either}
     */
    map<U>(fn: (T) => U): Either<U> {
        return this.flatMap(value => this.unit(fn(value)));
    }

    /**
     * leftFlatMap
     * @param {Function} fn
     * @return {Either}
     */
    leftFlatMap<U>(fn: (T) => Either<U>): Either<U> {
        return this.isRight ? Right(this.val) : fn(this.val);
    }

    /**
     * leftMap
     * @param {Function} fn
     * @return {Either}
     */
    leftMap<U>(fn: (T) => U): Either<U> {
        return this.leftFlatMap(value => Left(fn(value)));
    }

    /**
     * ap
     * @param {Either} eitherWithFn
     * @return {Either}
     */
    ap<U>(eitherWithFn: Either<any>): Either<U> {
        return this.isRight ? eitherWithFn.map(fn => fn(this.val)) : Left(this.val);
    }

    /**
     * Provide functions to map both sides of the Either
     * @param {Function} leftFn
     * @param {Function} rightFn
     * @return {Either}
     */
    biMap<U>(leftFn: (T) => U, rightFn: (T) => U): Either<U> {
        return this.isRight ? this.map(rightFn) : this.leftMap(leftFn);
    }

    /**
     * biFlatMap
     * @param {Function} leftFn
     * @param {Function} rightFn
     * @return {Either}
     */
    biFlatMap<U>(leftFn: (T) => Either<U>, rightFn: (T) => Either<U>): Either<U> {
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
     * Change the Either to a Right or Left based on the result of a predicate
     * @param {Function} predicate
     * @return {Either}
     */
    filter(predicate: (T) => boolean): Either<T> {
        return predicate(this.val) ? this.toRight() : this.toLeft();
    }


    /**
     * Force the Either to a Left
     * @return {Left}
     */
    toLeft(): Either<T> {
        return Left(this.val);
    }

    /**
     * Force the Either to a Right
     * @return {Right}
     */
    toRight(): Either<T> {
        return Right(this.val);
    }

    /**
     * If the Either is a right change to a Some if the Either is a Left drop the value and return a None
     * @return {Maybe}
     */
    toMaybe(): Maybe<T> {
        return this.isRight ? Some(this.val) : None;
    }

    toJSON(): * {
        return this.val;
    }
}

/**
 *
 * @class Either
 * @param {any} value
 * @param {boolean} isRight
 */
export function EitherFactory(value: any, isRight: boolean): Either<any> {
    return new Either(value, isRight);
}

/**
 * Create an Either as a Right value
 * @param {any} value
 * @return {Either}
 */
export function Right(value: any): Either<any> {
    return EitherFactory(value, true);
}

/**
 * Create an Either as a Left value
 * @param {any} value
 * @return {Either}
 */
export function Left(value: any): Either<any> {
    return EitherFactory(value, false);
}

/**
 * Create a new Either where the value is uncertain.
 * @param {any} value
 * @return {Maybe}
 * @example
 * var person = PerhapsEither(possibleNullValue);
 */
export function PerhapsEither<T>(value: T): Either<T> {
    return value == null ? Left(value) : Right(value);
}


/**
 * Create a Try Either. `func` is immediately exceuted,
 * if an error is thrown the Either will be Left(error) otherwise
 * the value of `func` is passed to a Right.
 * @param {Function} func
 * @return {Either}
 */
export function Try(func: Function): Either<any> {
    try {
        return Right(func.call());
    } catch(error) {
        return Left(error);
    }
}


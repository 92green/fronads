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

export class Either<L, R> {
    left: L;
    right: R;
    isRight: boolean;

    constructor(value: *, isRight: boolean) {
        this.isRight = isRight;

        if(isRight) {
            this.right = value;
        } else {
            this.left = value;
        }
    }

    /**
     * Unit function
     * @param {any} value
     * @return {Either}
     */
    unit<U>(value: U): Either<L, U> {
        return Right(value);
    }

    /**
     * flatMap
     * @param {Function} fn
     * @return {Either}
     */
    flatMap<U>(fn: (R) => Either<L, U>): Either<L, U> {
        return this.isRight ? fn(this.right) : Left(this.left);
    }

    /**
     * map
     * @param {Function} fn
     * @return {Either}
     */
    map<U>(fn: (R) => U): Either<L, U> {
        return this.flatMap(value => this.unit(fn(value)));
    }

    /**
     * leftFlatMap
     * @param {Function} fn
     * @return {Either}
     */
    leftFlatMap<U>(fn: (L) => Either<U, R>): Either<U, R> {
        return this.isRight ? Right(this.right) : fn(this.left);
    }

    /**
     * leftMap
     * @param {Function} fn
     * @return {Either}
     */
    leftMap<U>(fn: (L) => U): Either<U, R> {
        return this.leftFlatMap(value => Left(fn(value)));
    }

    /**
     * ap
     * @param {Either} eitherWithFn
     * @return {Either}
     */
    ap<U>(eitherWithFn: Either<*, *>): Either<L, U> {
        return this.isRight ? eitherWithFn.map(fn => fn(this.right)) : Left(this.left);
    }

    /**
     * Provide functions to map both sides of the Either
     * @param {Function} leftFn
     * @param {Function} rightFn
     * @return {Either}
     */
    biMap(leftFn: (L) => *, rightFn: (R) => *): Either<*, *> {
        return this.isRight ? this.map(rightFn) : this.leftMap(leftFn);
    }

    /**
     * biFlatMap
     * @param {Function} leftFn
     * @param {Function} rightFn
     * @return {Either}
     */
    biFlatMap(leftFn: (L) => Either<*, R>, rightFn: (R) => Either<L, *>): Either<*, *> {
        return this.isRight ? rightFn(this.right) : leftFn(this.left);
    }

    /**
     * Return the current value.
     * @return {any}
     */
    value(): any {
        return this.isRight ? this.right : this.left;
    }


    /**
     * Change the Either to a Right or Left based on the result of a predicate
     * @param {Function} predicate
     * @return {Either}
     */
    filter(predicate: (*) => boolean): Either<L, R> {
        return predicate(this.value()) ? this.toRight() : this.toLeft();
    }


    /**
     * Force the Either to a Left
     * @return {Left}
     */
    toLeft(): Either<L, R> {
        return Left(this.value());
    }

    /**
     * Force the Either to a Right
     * @return {Right}
     */
    toRight(): Either<L, R> {
        return Right(this.value());
    }

    /**
     * If the Either is a right change to a Some if the Either is a Left drop the value and return a None
     * @return {Maybe}
     */
    toMaybe(): Maybe<R> {
        return this.isRight ? Some(this.right) : None;
    }

    toPromise(): Promise<*> {
        return this.isRight
            ? Promise.resolve(this.right)
            : Promise.reject(this.left)
        ;
    }

    toJSON(): * {
        return this.value();
    }
}

/**
 *
 * @class Either
 * @param {any} value
 * @param {boolean} isRight
 */
export function EitherFactory<V>(value: V, isRight: boolean): Either<*, *> {
    return new Either(value, isRight);
}

/**
 * Create an Either as a Right value
 * @param {any} value
 * @return {Either}
 */
export function Right<R>(value: R): Either<*, R> {
    return EitherFactory(value, true);
}

/**
 * Create an Either as a Left value
 * @param {any} value
 * @return {Either}
 */
export function Left<L>(value: L): Either<L, *> {
    return EitherFactory(value, false);
}

/**
 * Create a new Either where the value is uncertain.
 * @param {any} value
 * @return {Maybe}
 * @example
 * var person = PerhapsEither(possibleNullValue);
 */
export function PerhapsEither<T>(value: T): Either<*, *> {
    return value == null ? Left(value) : Right(value);
}


/**
 * Create a Try Either. `func` is immediately exceuted,
 * if an error is thrown the Either will be Left(error) otherwise
 * the value of `func` is passed to a Right.
 * @param {Function} func
 * @return {Either}
 */
export function Try<T>(func: Function): Either<Error, T> {
    try {
        return Right(func.call());
    } catch(error) {
        return Left(error);
    }
}


// @flow
import test from 'ava';
import {Either, EitherFactory, Right, Left, Try, PerhapsEither} from '../Either';

test('EitherFactory', (tt: Object) => {
    tt.is(
        EitherFactory(1, true)
            .map(() => 2)
            .value(),
        2
    );
    tt.is(
        EitherFactory(1, false)
            .map(() => 2)
            .value(),
        1
    );
});


test('Right', (tt: Object) => {
    const value: Either<number> = Right(1);

    tt.is(value.map(() => 2).value(), 2);
    tt.is(value.leftMap(() => 2).value(), 1);
});

test('Left', (tt: Object) => {
    const value: Either<number> = Left(1);
    tt.is(value.leftMap(() => 2).value(), 2);
    tt.is(value.map(() => 2).value(), 1);
});

test('Try', (tt: Object) => {
    tt.false(Try(() => {
        throw 'blergh';
    }).isRight);
    tt.true(Try(() => 'rad').isRight);
});

test('Either.biMap', (tt: Object) => {
    tt.is(
        Left(1)
            .biMap(() => 2, () => 'foo')
            .value(),
        2
    );
    tt.is(
        Right(1)
            .biMap(() => 'foo', () => 2)
            .value(),
        2
    );
});


test('Either.biFlatMap', (tt: Object) => {
    tt.is(
        Left(1)
            .biFlatMap(() => Left(2), () => Right(1))
            .value(),
        2
    );
    tt.is(
        Right(1)
            .biFlatMap(() => Right(1), () => Right(2))
            .value(),
        2
    );
});



test('Either.ap', (tt: Object) => {
    tt.is(Right(10).ap(Right(ii => ii * 2)).val, 20);
    tt.is(Left(10).ap(Right(ii => ii * 2)).val, 10);
});

test('Either.toMaybe', (tt: Object) => {
    tt.false(Left(1).toMaybe().isSome);
    tt.true(Right(1).toMaybe().isSome);
});

test('Either.toJSON', (tt: Object) => {
    tt.deepEqual(JSON.stringify({a: Right({b: Right(2)})}), JSON.stringify({a: {b: 2}}));
    tt.deepEqual(JSON.stringify({a: Left(null)}), JSON.stringify({a: null}));
});

test('Either.toLeft', (tt: Object) => {
    tt.is(
        Right()
            .toLeft()
            .leftMap(() => 'foo')
            .value(),
        'foo'
    );
});

test('Either.toRight', (tt: Object) => {
    tt.is(
        Left()
            .toRight()
            .map(() => 'foo')
            .value(),
        'foo'
    );
});

test('Either.filter', (tt: Object) => {
    tt.true(Left().filter(() => true).isRight);
    tt.false(Left().filter(() => false).isRight);
    tt.true(Right().filter(() => true).isRight);
    tt.false(Right().filter(() => false).isRight);
});


test('PerhapsEither', (tt: Object) => {
    tt.false(PerhapsEither(null).isRight);
    tt.false(PerhapsEither().isRight);
    tt.true(PerhapsEither(2).isRight);
});




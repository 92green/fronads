import test from 'ava';
import {EitherFactory, Right, Left, Try} from '../Either';
// import {Some, None} from '../Maybe';

const NoOp = () => {};
const Identity = (ii) => ii;


test('EitherFactory', tt => {
    tt.is(EitherFactory(1, true).map(() => 2).value(), 2);
    tt.is(EitherFactory(1, false).map(() => 2).value(), 1);
});


test('Right', tt => {
    tt.is(Right(1).map(() => 2).value(), 2);
    tt.is(Right(1).leftMap(() => 'WRONG').value(), 1);
});

test('Left', tt => {
    tt.is(Left(1).leftMap(() => 2).value(), 2);
    tt.is(Left(1).map(() => 'WRONG').value(), 1);
});

test('Try', tt => {
    tt.is(Try(() => rad).isRight, false);
    tt.is(Try(() => 'rad').isRight, true);
});

test('Either.biMap', tt => {
    tt.is(Left(1).biMap(ii => 2, null).value(), 2);
    tt.is(Right(1).biMap(null, ii => 2).value(), 2);
});


test('Either.biFlatMap', tt => {
    tt.is(Left(1).biFlatMap(ii => 2, null), 2);
    tt.is(Right(1).biFlatMap(null, ii => 2), 2);
});



test('Either.ap', tt => {
    tt.is(Right(10).ap(Right(ii => ii * 2)).val, 20);
    tt.is(Left(10).ap(Right(ii => ii * 2)).val, 10);
});

test('Either.toMaybe', tt => {
    tt.is(Left(1).toMaybe().isSome, false);
    tt.is(Right(1).toMaybe().isSome, true);
});

test('Either.toJSON', tt => {
    tt.deepEqual(JSON.stringify({a: Right({b: Right(2)})}), JSON.stringify({a: {b: 2}}));
    tt.deepEqual(JSON.stringify({a: Left(null)}), JSON.stringify({a: null}));
});

test('Either.toLeft', tt => {
    tt.is(Right().toLeft().leftMap(() => 'foo').value(), 'foo');
});

test('Either.toRight', tt => {
    tt.is(Left().toRight().map(() => 'foo').value(), 'foo');
});

test('Either.filter', tt => {
    tt.is(Left().filter(() => true).isRight, true);
    tt.is(Left().filter(() => false).isRight, false);
    tt.is(Right().filter(() => true).isRight, true);
    tt.is(Right().filter(() => false).isRight, false);
});




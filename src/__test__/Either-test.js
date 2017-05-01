import test from 'ava';
import {Right, Left, Try} from '../Either';
// import {Some, None} from '../Maybe';

const NoOp = () => {};
const Identity = (ii) => ii;


test('Right', tt => {
    tt.is(Right(1).map(() => 2).cata(NoOp, Identity), 2);
    tt.is(Right(1).leftMap(() => 'WRONG').cata(NoOp, Identity), 1);
});

test('Left', tt => {
    tt.is(Left(1).leftMap(() => 2).cata(Identity, NoOp), 2);
    tt.is(Left(1).map(() => 'WRONG').cata(Identity, NoOp), 1);
});

test('Try', tt => {
    tt.is(Try(() => rad).isRight, false);
    tt.is(Try(() => 'rad').isRight, true);
});

test('ap', tt => {
    tt.is(Right(10).ap(Right(ii => ii * 2)).val, 20);
    tt.is(Left(10).ap(Right(ii => ii * 2)).val, 10);
});

test('to', tt => {
    tt.is(Left(1).toMaybe().isSome, false);
    tt.is(Right(1).toMaybe().isSome, true);
});


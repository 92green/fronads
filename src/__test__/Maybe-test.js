import test from 'ava';
import {
    MaybeFactory,
    Perhaps,
    PerhapsIn,
    Some,
    None
} from '../Maybe';


const person = Some({
    child: Some({
        child: Some('harry')
    })
});

const noGrandChild = Some({
    child: Some({
        child: None()
    })
});

const getChild = (ii) => ii.child;

test('MaybeFactory', tt => {
    tt.is(MaybeFactory(1, true).map(ii => 2).value(), 2);
    tt.is(MaybeFactory(1, false).map(ii => 2).value(), 1);
});

test('Some', tt => {
    tt.is(Some(1).map(() => 2).value(), 2);
    tt.is(person.flatMap(getChild).flatMap(getChild).value(), 'harry');
});

test('None', tt => {
    tt.is(noGrandChild.flatMap(getChild).flatMap(getChild).value(), null);
    tt.is(noGrandChild.flatMap(getChild).flatMap(getChild).flatMap(getChild).value(), null);
});

test('Perhaps', tt => {
    tt.is(Perhaps(2).isSome, true);
    tt.is(Perhaps(null).isSome, false);
});


test('PerhapsIn', tt => {
    tt.is(PerhapsIn({foo: {bar: 2}}, ['foo', 'bar']).isSome, true);
    tt.is(PerhapsIn({foo: {bar: 2}}, ['foo', 'bar']).isSome, true);
    tt.is(PerhapsIn({foo: null}, ['foo', 'bar']).map(ii => ii * 2).isSome, false);
    tt.is(PerhapsIn(null, ['foo', 'bar']).isSome, false);
});



test('to', tt => {
    tt.is(Some(1).toEither().isRight, true);
    tt.is(None().toEither().isRight, false);
    tt.is(None().toEither('fail').val, 'fail');

    tt.deepEqual(JSON.stringify({a: Some({b: Some(2)})}), JSON.stringify({a: {b: 2}}));
    tt.deepEqual(JSON.stringify({a: None()}), JSON.stringify({a: null}));
});

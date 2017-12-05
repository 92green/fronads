// @flow
import test from 'ava';
import {
    Maybe,
    MaybeFactory,
    Perhaps,
    PerhapsIn,
    Some,
    None
} from '../Maybe';


const person: Maybe<Object> = Some({
    child: Some({
        child: Some('harry')
    })
});

const noGrandChild = Some({
    child: Some({
        child: None
    })
});

const getChild = (ii) => ii.child;

test('MaybeFactory', (tt: Object) => {
    tt.is(
        MaybeFactory(1, true)
            .map(() => 2)
            .value(),
        2
    );
    tt.is(
        MaybeFactory(1, false)
            .map(() => 2)
            .value(),
        null
    );
});

test('Some', (tt: Object) => {
    tt.is(
        Some(1)
            .map(() => 2)
            .value(),
        2
    );
    tt.is(
        person
            .flatMap(getChild)
            .flatMap(getChild)
            .value(),
        'harry'
    );
});

test('None', (tt: Object) => {
    tt.is(
        noGrandChild
            .flatMap(getChild)
            .flatMap(getChild)
            .value(),
        null
    );
    tt.is(
        noGrandChild
            .flatMap(getChild)
            .flatMap(getChild)
            .flatMap(getChild)
            .value(),
        null
    );
});

test('Perhaps', (tt: Object) => {
    tt.is(Perhaps(2).isSome, true);
    tt.is(Perhaps(null).isSome, false);
});


test('PerhapsIn', (tt: Object) => {
    tt.is(PerhapsIn({foo: {bar: 2}}, ['foo', 'bar']).isSome, true);
    tt.is(PerhapsIn({foo: {bar: 2}}, ['foo', 'bar']).isSome, true);
    tt.is(PerhapsIn({foo: null}, ['foo', 'bar']).map(ii => ii * 2).isSome, false);
    tt.is(PerhapsIn(null, ['foo', 'bar']).isSome, false);
});

test('Maybe.filter', (tt: Object) => {
    tt.true(Some().filter(() => true).isSome);
    tt.false(Some().filter(() => false).isSome);
    tt.false(None.filter(() => true).isSome);
    tt.false(None.filter(() => false).isSome);
});

test('Maybe.ap', (tt: Object) => {
    tt.is(Some(2).ap(Some(a => a * 2)).value(), 4);
    tt.false(Some(2).ap(None).isSome);
    tt.false(None.ap(None).isSome);
    tt.false(None.ap(Some(a => a * 2)).isSome);
});

test('to', (tt: Object) => {
    tt.is(Some(1).toEither().isRight, true);
    tt.is(None.toEither().isRight, false);
    tt.is(None.toEither('fail').left, 'fail');

    tt.deepEqual(JSON.stringify({a: Some({b: Some(2)})}), JSON.stringify({a: {b: 2}}));
    tt.deepEqual(JSON.stringify({a: None}), JSON.stringify({a: null}));
});

test('value', (tt: Object) => {
    tt.is(Some('foo').value(), 'foo');
    tt.is(None.value('bar'), 'bar');
    tt.is(None.value(), null);
});

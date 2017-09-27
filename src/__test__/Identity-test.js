// @flow
import test from 'ava';
import {
    Identity,
    IdentityFactory
} from '../Identity';

const foo: Identity<string> = new Identity('foo');
const bar: Identity<string> = new Identity('bar');


test('Identity map/flatmap/unit', (tt: Object) => {
    tt.is(foo.map(() => 'bar').value(), 'bar');
});

test('Identity.value', (tt: Object) => {
    tt.is(bar.value('foo'), 'bar');
    tt.is(IdentityFactory().value('foo'), 'foo');
});

test('Identity.to', (tt: Object) => {
    tt.true(foo.toMaybe().isSome);
    tt.true(foo.toEither().isRight);
});

test('Identity.toJSON', (tt: Object) => {
    tt.is(JSON.stringify(foo.toJSON()), "\"foo\"");
});

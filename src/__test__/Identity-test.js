import test from 'ava';
import {
    IdentityFactory as Identity,
} from '../Identity';


test('Identity map/flatmap/unit', tt => {
    tt.is(Identity('foo').map(() => 'bar').value(), 'bar');
});

test('Identity.value', tt => {
    tt.is(Identity('bar').value('foo'), 'bar');
    tt.is(Identity().value('foo'), 'foo');
});

test('Identity.to', tt => {
    tt.true(Identity('foo').toMaybe().isSome);
    tt.true(Identity('foo').toEither().isRight);
});

test('Identity.toJSON', tt => {
    tt.is(JSON.stringify(Identity('foo').toJSON()), "\"foo\"");
});

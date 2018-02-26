//@flow
import test from 'ava';
import {Task, TaskFactory, Reject, Resolve, TaskPromise} from '../Task';
import {Some, None, Maybe} from '../Maybe';
import {Left, Right} from '../Either';
import Do, {DoCallback} from '../Do';

//
// unit
//
test('Do can yeild monad values', (t: Object): * => {
    const value = Do(function * () {
        var foo = yield Some('foo');
        var bar = yield Some('bar');
        return foo + bar;
    });
    t.is('foobar', value.value());
});

test('Do will divert to the failed monad chain', (t: Object): * => {
    const noneValue = Do(function * () {
        var foo = yield Left('broken');
        var bar = yield Right('bar');
        return foo + bar;
    });
    t.is('broken', noneValue.value());
});


test('Do can behave asynchronously', (t: Object): * => {
    return Do(function * () {
        var foo = yield Resolve('foo');
        var bar = yield Resolve('bar');
        return foo + bar;
    })
        .toPromise()
        .then(data => t.is('foobar', data))
});

test('Do can fail asynchronously', (t: Object): * => {
    return Do(function * () {
        var foo = yield Reject('broken');
        var bar = yield Resolve('bar');
        return foo + bar;
    })
        .toPromise()
        .catch(data => t.is('broken', data))
});

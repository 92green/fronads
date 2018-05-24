// @flow
import test from 'ava';
import {AsyncEitherFactory} from '../AsyncEither';
import {AsyncLeft} from '../AsyncEither';
import {AsyncRight} from '../AsyncEither';

test('Left', async (t: *): * => {
    return AsyncLeft('foo')
        .leftMap(val => t.is(val, 'foo'))
        .catch(xx => xx)
    ;
});

test('Right', async (t: *): * => {
    return AsyncRight('foo')
        .map(val => t.is(val, 'foo'))
    ;
});

test('AsyncEitherFactory', async (t: *): * => {
    return AsyncEitherFactory(Promise.resolve('foo'))
        .map(val => t.is(val, 'foo'))
    ;
});


test('leftFlatMap', async (t: *): * => {
    return AsyncLeft('foo')
        .leftFlatMap(AsyncRight)
        .map(val => t.is(val, 'foo'))
        .catch(xx => xx)
    ;
});

test('rightFlatMap', async (t: *): * => {
    return AsyncRight('foo')
        .flatMap(AsyncLeft)
        .leftMap(val => t.is(val, 'foo'))
        .catch(xx => xx) // catch to not break tests
    ;
});

test('biMap', async (t: *): * => {
    return AsyncRight('foo').biMap(t.fail, () => t.pass()).then();
});

test('biMap', async (t: *): * => {
    return AsyncLeft('foo').biMap(() => t.pass(), t.fail).catch(xx => xx);
});

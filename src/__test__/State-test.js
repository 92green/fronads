// @flow
import test from 'ava';

import {StatePut} from '../State';
import {StateModify} from '../State';
import {StateValue} from '../State';


test('State value/state', (t: *) => {
    t.is(StateValue('foo').value(), 'foo');
    t.is(StatePut('foo').state(), 'foo');
});

test('State map', (t: *) => {
    t.is(StateValue('foo').map(() => 'bar').value(), 'bar');
});


test('State map', (t: *) => {
    StateValue('foo')
        .flatMap(value => StateModify((state: *) => {
            t.is(value, 'foo');
            t.is(state, 'bar');
        }))
        .run('bar');
    t.is();
});

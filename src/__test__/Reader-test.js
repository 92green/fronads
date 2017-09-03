// @flow
import test from 'ava';
import {Reader} from '../Reader';
import {ReaderFactory} from '../Reader';



test('Reader run', (t: *) => {
    const foo: Reader<string> = new Reader((config) => t.is(config, 'foo'));
    foo.run('foo');
});

test('Reader flatMap', (t: *) => {
    const foo: Reader<string> = new Reader(config => config);
    foo
        .map(() => 'bar')
        .flatMap(value => new Reader((config: string) => {
            t.is(value, 'bar');
            t.is(config, 'foo');
        }))
        .run('foo');
});

test('Reader factory', (t: *) => {
    const reader = ReaderFactory(() => 'foo');
    t.is(reader.fn(), 'foo');
});

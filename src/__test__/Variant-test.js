// @flow
import test from 'ava';
import {VariantFactory} from '../Variant';

const {view, edit} = VariantFactory(['view', 'edit']);

const foo = view('foo');
const bar = edit('foo');

test('Variant {type} map/flatmap/unit', (t: Object) => {
    t.is(foo.viewMap(() => 'bar').value(), 'bar');
    t.is(foo.editMap(() => 'bar').value(), 'foo');

    t.is(bar.viewMap(() => 'bar').value(), 'foo');
    t.is(bar.editMap(() => 'bar').value(), 'bar');
});

test('Variant  map/flatmap/unit', (t: Object) => {
    t.is(foo.map(() => 'bar').value(), 'bar');
});


test('Variant.value', (t: Object) => {
    t.is(view('bar').value('foo'), 'bar');
    t.is(view().value('foo'), 'foo');
});

test('Variant.to', (t: Object) => {
    t.is(
        view('bar')
            .toEdit()
            .editMap(() => 'foo')
            .value(),
        'foo'
    );
    t.is(
        view('bar')
            .toEdit()
            .viewMap(() => 'foo')
            .value(),
        'bar'
    );
});

// @flow
import test from 'ava';
import {
    StateFunctorFactoryFactory as StateFunctorFactory
} from '../StateFunctor';

const {ViewState, EditState} = StateFunctorFactory(['View', 'Edit']);

const viewState = ViewState('foo');
const editState = EditState('foo');

test('StateFunctor map/flatmap/unit', (tt: Object) => {
    tt.is(viewState.viewMap(() => 'bar').value(), 'bar');
    tt.is(viewState.editMap(() => 'bar').value(), 'foo');

    tt.is(editState.viewMap(() => 'bar').value(), 'foo');
    tt.is(editState.editMap(() => 'bar').value(), 'bar');
});


test('StateFunctor.value', (tt: Object) => {
    tt.is(ViewState('bar').value('foo'), 'bar');
    tt.is(ViewState().value('foo'), 'foo');
});

test('StateFunctor.to', (tt: Object) => {
    tt.is(
        ViewState('bar')
            .toEdit()
            .editMap(() => 'foo')
            .value(),
        'foo'
    );
    tt.is(
        ViewState('bar')
            .toEdit()
            .viewMap(() => 'foo')
            .value(),
        'bar'
    );
});


test('StateFunctor.equals', (tt: Object) => {
    tt.false(ViewState(1).equals(EditState(1)));
    tt.false(ViewState(1).equals(ViewState(2)));
    tt.true(ViewState(1).equals(ViewState(1)));
});

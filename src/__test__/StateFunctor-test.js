import test from 'ava';
import {
    StateFunctorFactoryFactory as StateFunctorFactory,
} from '../StateFunctor';

const {ViewState, EditState} = StateFunctorFactory(['View', 'Edit']);

test('StateFunctor map/flatmap/unit', tt => {
    tt.is(ViewState('foo').viewMap(() => 'bar').value(), 'bar');
    tt.is(ViewState('foo').editMap(() => 'bar').value(), 'foo');

    tt.is(EditState('foo').viewMap(() => 'bar').value(), 'foo');
    tt.is(EditState('foo').editMap(() => 'bar').value(), 'bar');
});

import test from 'ava';
import {
    StateFunctorFactoryFactory as StateFunctorFactory,
} from '../StateFunctor';

const {ViewState, EditState} = StateFunctorFactory(['View', 'Edit']);

test('MaybeFactory', tt => {
    tt.is(ViewState('foo').mapView(ii => 'bar').value(), 'bar');
    tt.is(ViewState('foo').mapEdit(ii => 'bar').value(), 'foo');

    tt.is(EditState('foo').mapView(ii => 'bar').value(), 'foo');
    tt.is(EditState('foo').mapEdit(ii => 'bar').value(), 'bar');
});

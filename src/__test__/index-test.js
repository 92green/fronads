import test from 'ava';
import RequestState, {
    RequestEmpty,
    RequestFetching,
    RequestError,
    RequestSuccess
} from '../index';

const NOOP = () => {};

test('RequestEmpty', tt => {
    tt.is(
        RequestEmpty()
            .map(tt.fail)
            .fetchingMap(tt.fail)
            .errorMap(tt.fail)
            .orValue('foo'),
        'foo'
    );

});

test('RequestFetching', tt => {
    tt.is(RequestFetching().errorMap(NOOP).fetchingMap(() => 'foo').orValue(), 'foo');
    tt.is(RequestFetching().errorFlatMap(NOOP).fetchingFlatMap(() => 'foo'), 'foo');
});

test('RequestError', tt => {
    tt.is(RequestError().fetchingMap(NOOP).errorMap(() => 'foo').orValue(), 'foo');
    tt.is(RequestError().fetchingFlatMap(NOOP).errorFlatMap(() => 'foo'), 'foo');
});

test('RequestSuccess', tt => {
    tt.is(RequestSuccess('success').flatMap(() => 'foo'), 'foo');
    tt.is(RequestSuccess('success').map(ii => ii) instanceof RequestState, true);
    tt.is(RequestFetching('success').flatMap(ii => ii) instanceof RequestState, true);
    tt.is(RequestError('success').flatMap(ii => ii) instanceof RequestState, true);

    tt.is(RequestSuccess('success').orValue('rad'), 'success');
    tt.is(RequestFetching().orValue('rad'), 'rad');
});


test('Component Test', tt => {
    function Component(requestState) {
        return requestState
            .map(() => 'Component')
            .fetchingMap(() => 'fetching')
            .errorMap(() => 'error')
            .orValue('empty');
    }
    tt.is(Component(RequestFetching()), 'fetching');
    tt.is(Component(RequestError()), 'error');
    tt.is(Component(RequestEmpty()), 'empty');
    tt.is(Component(RequestSuccess()), 'Component');

});


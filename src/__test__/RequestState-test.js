// @flow
import test from 'ava';
import {
    RequestState,
    RequestStateFactory,
    RequestEmpty,
    RequestFetching,
    RequestError,
    RequestSuccess
} from '../RequestState';

const NOOP = () => {};

const fetching = RequestFetching();
const error = RequestError();
const success = RequestSuccess();

test('RequestStateFactory', (tt: Object) => {
    tt.is(RequestStateFactory(null, false, false, false) instanceof RequestState, true);
});

test('RequestEmpty', (tt: Object) => {
    tt.is(
        RequestEmpty()
            .map(tt.fail)
            .fetchingMap(tt.fail)
            .errorMap(tt.fail)
            .value('foo'),
        'foo'
    );
});

test('RequestFetching', (tt: Object) => {
    tt.is(
        fetching
            .errorMap(NOOP)
            .fetchingMap(() => 'foo')
            .value(),
        'foo'
    );
    tt.is(fetching.errorFlatMap(NOOP).fetchingFlatMap(() => 'foo'), 'foo');
});

test('RequestError', (tt: Object) => {
    tt.is(
        error
            .fetchingMap(NOOP)
            .errorMap(() => 'foo')
            .value(),
        'foo'
    );
    tt.is(
        error
            .fetchingFlatMap(NOOP)
            .errorFlatMap(() => 'foo'),
        'foo'
    );
});

test('RequestSuccess', (tt: Object) => {
    tt.is(success.flatMap(() => 'foo'), 'foo');
    tt.is(success.map(ii => ii) instanceof RequestState, true);
    tt.is(RequestFetching('success').flatMap(ii => ii) instanceof RequestState, true);
    tt.is(RequestError('success').flatMap(ii => ii) instanceof RequestState, true);

    tt.is(RequestSuccess('success').value('rad'), 'success');
    tt.is(fetching.value('rad'), 'rad');
});


test('Component Test', (tt: Object) => {
    function Component(requestState: RequestState): string {
        return requestState
            .map(() => 'Component')
            .fetchingMap(() => 'fetching')
            .errorMap(() => 'error')
            .value('empty');
    }
    tt.is(Component(fetching), 'fetching');
    tt.is(Component(error), 'error');
    tt.is(Component(RequestEmpty()), 'empty');
    tt.is(Component(success), 'Component');

});

test('to<type> functions', (tt: Object) => {
    tt.is(RequestEmpty().toFetching().isFetching, true);
    tt.is(RequestEmpty().toError().isError, true);
    tt.is(RequestEmpty().toSuccess().isSuccess, true);
    tt.is(success.toEmpty().isSuccess, false);
    tt.is(
        success
            .toEither()
            .map(() => 2)
            .value(),
        2
    );
    tt.is(
        error
            .toEither()
            .leftMap(() => 2)
            .value(),
        2
    );
});



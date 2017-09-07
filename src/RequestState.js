// @flow
import {EitherFactory, Either} from './Either';

/*
 * RequestState is used to hold the four part relationship of an asynchronous request.
 * It is like a four way version of an Either. Instead of Left and Right the RequestState
 * can be either be empty, fetching, an error or a success. These states are represented through the identites:
 * * [RequestEmpty](#module:RequestState~RequestEmpty)
 * * [RequestFetching](#module:RequestState~RequestFetching)
 * * [RequestError](#module:RequestState~RequestError)
 * * [RequestSuccess](#module:RequestState~RequestSuccess)
 *
 * @module RequestState
 */


/*
 * RequestState class
 */
export default class RequestState {
    isFetching: boolean;
    isError: boolean;
    isSuccess: boolean;
    val: any;

    /*
     * @kind function
     * @param {any} value
     * @param {boolean} isFetching
     * @param {boolean} isError
     * @param {boolean} isSuccess
     * @return {RequestState}
     */
    constructor(value: any, isFetching: boolean, isError: boolean, isSuccess: boolean) {
        this.isFetching = isFetching;
        this.isError = isError;
        this.isSuccess = isSuccess;
        this.val = value;
    }

    /*
     * map
     * @param {any} fn
     * @return {RequestState}
     */
    map(fn: any): RequestState {
        return this.isSuccess ? RequestSuccess(fn(this.val)) : this;
    }

    /*
     * flatMap
     * @param {Function} fn
     * @return {any}
     */
    flatMap(fn: Function): any {
        return this.isSuccess ? fn(this.val) : this;
    }

    /*
     * fetchingMap
     * @param {Function} fn
     * @return {RequestState}
     */
    fetchingMap(fn: Function): RequestState {
        return this.isFetching ? RequestFetching(fn(this.val)) : this;
    }

    /*
     * fetchingFlatMap
     * @param {Function} fn
     * @return {RequestState}
     */
    fetchingFlatMap(fn: Function): RequestState {
        return this.isFetching ? fn(this.val) : this;
    }

    /*
     * errorMap
     * @param {Function} fn
     * @return {RequestState}
     */
    errorMap(fn: Function): RequestState {
        return this.isError ? RequestError(fn(this.val)) : this;
    }

    /*
     * errorFlatMap
     * @param {Function} fn
     * @return {RequestState}
     */
    errorFlatMap(fn: Function): RequestState {
        return this.isError ? fn(this.val) : this;
    }

    /*
     * toFetching
     * @return {RequestState}
     */
    toFetching(): RequestState {
        return RequestFetching(this.val);
    }

    /*
     * toError
     * @return {RequestState}
     */
    toError(): RequestState {
        return RequestError(this.val);
    }

    /**
     * toSuccess
     * @return {RequestState}
     */
    toSuccess(): RequestState {
        return RequestSuccess(this.val);
    }

    /**
     * toEmpty
     * @return {RequestState}
     */
    toEmpty(): RequestState {
        return RequestEmpty();
    }

    /*
     * Convert the RequestState to an Either. RequestErrors will be turned into a `Left` everything else a will be a `Right`.
     * @return {Either}
     */
    toEither(): Either {
        return EitherFactory(this.val, !this.isError);
    }

    /*
     * value
     * @param {any} defaultValue
     * @return {any}
     */
    value(defaultValue: any): any {
        return this.val == null ? defaultValue : this.val;
    }
}

/*
 * Create an RequestState as a RequestEmpty value
 * @param {any} value
 * @return {RequestState}
 */
export function RequestEmpty(): RequestState {
    return new RequestState(null, false, false, false);
}

/*
 * Create a RequestState as a RequestFetching value
 * @param {any} value
 * @return {RequestState}
 */
export function RequestFetching(value: any): RequestState {
    return new RequestState(value, true, false, false);
}

/*
 * Create a RequestState as a RequestError value
 * @param {any} value
 * @return {RequestState}
 */
export function RequestError(value: any): RequestState {
    return new RequestState(value, false, true, false);
}

/*
 * Create a RequestState as a RequestSuccess value
 * @param {any} value
 * @return {RequestState}
 */
export function RequestSuccess(value: any): RequestState {
    return new RequestState(value, false, false, true);
}


export function RequestStateFactory(value: any, isFetching: boolean, isError: boolean, isSuccess: boolean): RequestState {
    return new RequestState(value, isFetching, isError, isSuccess);
}


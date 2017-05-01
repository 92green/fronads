// @flow

//
// Identities
//

export function RequestEmpty(): RequestState {
    return new RequestState(null, false, false, false);
}

export function RequestFetching(value: any): RequestState {
    return new RequestState(value, true, false, false);
}

export function RequestError(error: any): RequestState {
    return new RequestState(error, false, true, false);
}

export function RequestSuccess(data: any): RequestState {
    return new RequestState(data, false, false, true);
}


//
// Monad
//


export default class RequestState {
    constructor(value: any, isFetching: boolean, isError: boolean, isSuccess: boolean) {
        this.isFetching = isFetching;
        this.isError = isError;
        this.isSuccess = isSuccess;
        this.val = value;
    }
    map(fn: any): RequestState {
        return this.isSuccess ? RequestSuccess(fn(this.val)) : this;
    }
    flatMap(fn: Function): any {
        return this.isSuccess ? fn(this.val) : this;
    }
    fetchingMap(fn: Function): RequestState {
        return this.isFetching ? RequestFetching(fn(this.val)) : this;
    }
    fetchingFlatMap(fn: Function): RequestState {
        return this.isFetching ? fn(this.val) : this;
    }
    errorMap(fn: Function): RequestState {
        return this.isError ? RequestError(fn(this.val)) : this;
    }
    errorFlatMap(fn: Function): RequestState {
        return this.isError ? fn(this.val) : this;
    }
    toFetching(): RequestState {
        return RequestFetching(this.val);
    }
    toError(): RequestState {
        return RequestError(this.val);
    }
    toSuccess(): RequestState {
        return RequestSuccess(this.val);
    }
    toEmpty(): RequestState {
        return RequestEmpty();
    }
    value(defaultValue: any): any {
        return this.val == null ? defaultValue : this.val;
    }
}

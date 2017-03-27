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
        this.value = value;

    }
    map(fn: any): RequestState {
        return this.isSuccess ? RequestSuccess(fn(this.value)) : this;
    }
    flatMap(fn: Function): any {
        return this.isSuccess ? fn(this.value) : this;
    }
    fetchingMap(fn: Function): RequestState {
        return this.isFetching ? RequestFetching(fn(this.value)) : this;
    }
    fetchingFlatMap(fn: Function): RequestState {
        return this.isFetching ? fn(this.value) : this;
    }
    errorMap(fn: Function): RequestState {
        return this.isError ? RequestError(fn(this.value)) : this;
    }
    errorFlatMap(fn: Function): RequestState {
        return this.isError ? fn(this.value) : this;
    }
    orValue(defaultValue: any): any {
        return this.value || defaultValue;
    }
}

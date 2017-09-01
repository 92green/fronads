// @flow

const NOOP = () => {};
const IDLE = 0;
const STARTED = 1;
const RESOLVED = 2;
const REJECTED = 3;

class Future {
    computation: Function;
    pending: Object[];
    value: *;
    state: number;

    constructor(fn: Function) {
        this.pending = [];
        this.value = null;
        this.state = IDLE;
        this.computation = fn;
    }

    resolveFuture(reject: Function, resolve: Function) {
        this.state = STARTED;
        return this.computation(
            (error: *): * => {
                this.state = REJECTED;
                this.value = error;
                this.invokePending('reject', error);
                return reject(error);
            },
            (data: *): * => {
                this.state = RESOLVED;
                this.value = data;
                this.invokePending('resolve', data);
                return resolve(data);
            }
        );
    }
    invokePending(kind: string, data: *) {
        const xs = this.pending;
        this.pending.length = 0;
        for (var i = 0; i < xs.length; ++i) {
            xs[i][kind](data);
        }
    }
    addToPendingOperations(reject: Function, resolve: Function) {
        this.pending.push({reject, resolve});
    }
}

export function FutureFactory(fn: Function): Future {
    return new Future(fn);
}

export function Resolve(value: any): Future {
    return new Future((_, resolve) => resolve(value));
}

export function Reject(value: any): Future {
    return new Future(reject => reject(value));
}



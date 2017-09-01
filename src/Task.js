// @flow

const NOOP = () => {};

class Task {
    computation: Function;

    constructor(fn: Function) {
        this.computation = fn;
    }
    unit(fn: Function): Task {
        return new Task(fn);
    }
    flatMap(fn: Function): Task {
        return new Task((reject: Function, resolve: Function): * => {
            return this.computation(
                reject,
                value => fn(value).computation(reject, resolve)
            );
        });
    }
    leftFlatMap(fn: Function): Task {
        return new Task((reject: Function, resolve: Function): * => {
            return this.computation(
                value => fn(value).computation(reject, resolve),
                resolve
            );
        });
    }
    map(fn: Function): Task {
        return new Task((reject: Function, resolve: Function): * => {
            return this.computation(
                reject,
                value => resolve(fn(value))
            );
        });
    }
    leftMap(fn: Function): Task {
        return new Task((reject: Function, resolve: Function): * => {
            return this.computation(
                value => reject(fn(value)),
                resolve,
            );
        });
    }
    run() {
        //    __
        // -=(o '.
        //    '.-.\
        //    /|  \\
        //    '|  ||
        //     _\_):,_
        this.computation(NOOP, NOOP);
    }
    toPromise(): Promise<> {
        return new Promise((resolve, reject) => this.computation(reject, resolve));
    }
}

export function TaskFactory(fn: Function): Task {
    return new Task(fn);
}

export function Resolve(value: any): Task {
    return new Task((_, resolve) => resolve(value));
}

export function Reject(value: any): Task {
    return new Task(reject => reject(value));
}

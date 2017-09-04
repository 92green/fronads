// @flow

const NOOP = () => {};

type TaskFlatMapper = (value: *) => Task;
type TaskMapper = (value: *) => *;

export class Task {
    _type: string;
    computation: Function;

    constructor(fn: Function) {
        this.computation = fn;
        this._type = 'Task';
    }
    unit(fn: Function): Task {
        return new Task(fn);
    }
    flatMap(fn: TaskFlatMapper): Task {
        return this.unit((reject: Function, resolve: Function): * => {
            return this.computation(
                reject,
                value => fn(value).computation(reject, resolve)
            );
        });
    }
    leftFlatMap(fn: TaskFlatMapper): Task {
        return this.unit((reject: Function, resolve: Function): * => {
            return this.computation(
                value => fn(value).computation(reject, resolve),
                resolve
            );
        });
    }
    map(fn: TaskMapper): Task {
        return this.unit((reject: Function, resolve: Function): * => {
            return this.computation(
                reject,
                value => resolve(fn(value))
            );
        });
    }
    leftMap(fn: TaskMapper): Task {
        return this.unit((reject: Function, resolve: Function): * => {
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

export function TaskPromise(fn: Function): Task {
    return new Task((reject, resolve) => fn().then(resolve, reject));
}

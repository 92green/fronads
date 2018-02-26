// @flow

const NOOP = () => {};

type TaskFlatMapper = (value: any) => Task;
type TaskMapper = (value: any) => any;
type TaskComputation = (reject: Function, resolve: Function) => void;

/**
 * Task lets you create a description of an action that is resolved via a callback.
 * It is useful for asynchronous operations. It can be thought of as a stricter more monadic version of a promise.
 *
 * @module Task
 */


/**
 * Task class
 */
export class Task {
    _type: string;
    computation: TaskComputation;

    /**
     * Task constructor
     *
     * @param {TaskComputation} fn - a function given reject and resolve callback to call when appropriate
     * @return {Task}
     */
    constructor(computation: TaskComputation) {
        this.computation = computation;
        this._type = 'Task';
    }

    /**
     * Unit function
     *
     * @param {TaskComputation} fn - a function given reject and resolve callback to call when appropriate
     * @return {Task}
     */
    static unit(value: *): Task {
        return new Task((_, resolve) => resolve(value));
    }

    /**
     * Perform a flatMap on the current value of the previous resolved computation
     *
     * @param {TaskFlatMapper} fn - perform a flatMap
     * @return {Task}
     */
    flatMap(fn: TaskFlatMapper): Task {
        return Task.unit((reject: Function, resolve: Function): * => {
            return this.computation(
                reject,
                value => fn(value).computation(reject, resolve)
            );
        });
    }

    /**
     * Perform a flatMap on the current value of the previous rejected computation
     *
     * @param {TaskFlatMapper} fn - perform a flatMap
     * @return {Task}
     */
    leftFlatMap(fn: TaskFlatMapper): Task {
        return Task.unit((reject: Function, resolve: Function): * => {
            return this.computation(
                value => fn(value).computation(reject, resolve),
                resolve
            );
        });
    }

    /**
     * Perform a map on the current value of the previous resolved computation
     *
     * @param {TaskMapper} fn - map
     * @return {Task}
     */
    map(fn: TaskMapper): Task {
        return Task.unit((reject: Function, resolve: Function): * => {
            return this.computation(
                reject,
                value => resolve(fn(value))
            );
        });
    }

    /**
     * Perform a map on the current value of the previous rejected computation
     *
     * @param {TaskMapper} fn - map
     * @return {Task}
     */
    leftMap(fn: TaskMapper): Task {
        return Task.unit((reject: Function, resolve: Function): * => {
            return this.computation(
                value => reject(fn(value)),
                resolve,
            );
        });
    }

    /**
     * Run the the series of compututations.
     */
    run() {
        this.computation(NOOP, NOOP);
        //               ----------
        //                     \
        //                      \
        //                         __
        //                      -=(o '.
        //                         '.-.\
        //                         /|  \\
        //                         '|  ||
        //                          _\_):,_
        //
    }

    /**
     * Run the computation and return the state as either a rejected or resolved promise.
     * @returns {Promise}
     */
    toPromise(): Promise<any> {
        return new Promise((resolve, reject) => this.computation(reject, resolve));
    }
}


/**
 * Create a new Task
 * @param {TaskComputation} computation
 * @return {Task}
 */
export function TaskFactory(computation: Function): Task {
    return new Task(computation);
}

/**
 * Create a new resolved Task
 * @param {any} value
 * @return {Task}
 */
export function Resolve(value: any): Task {
    return new Task((_, resolve) => resolve(value));
}

/**
 * Create a new rejected Task
 * @param {any} value
 * @return {Task}
 */
export function Reject(value: any): Task {
    return new Task(reject => reject(value));
}

/**
 * Create a new Task from a function that returns a promise.
 * @param {any} value
 * @return {Task}
 */
export function TaskPromise(fn: Function): Task {
    return new Task((reject, resolve) => fn().then(resolve, reject));
}

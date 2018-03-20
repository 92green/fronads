// @flow

const rejectify = _ => Promise.reject(_);
const identity = _ => _;

export class AsyncEither<T> {
    value: Promise<T>;

    constructor(value: Promise<T>) {
        this.value = value;
    }

    static unit(value: Promise<T>): AsyncEither<T> {
        return new AsyncEither(Promise.resolve(value));
    }
    flatMap<U>(fn: (T) => AsyncEither<U>): AsyncEither<U> {
        return new AsyncEither(
            this.value
                .then(fn)
                .then(_ => _.value)
        );
    }
    map<U>(fn: (T) => U): AsyncEither<U> {
        return new AsyncEither(this.value.then(fn));
    }

    static leftUnit(value: Promise<T>): AsyncEither<T> {
        return new AsyncEither(Promise.reject(value));
    }
    leftFlatMap<U>(fn: (T) => AsyncEither<U>): AsyncEither<U> {
        return new AsyncEither(
            this.value
                .then(identity, value => Promise.reject(fn(value)))
                .then(identity, _ => _.value)
        );
    }
    leftMap<U>(fn: (T) => U): AsyncEither<U> {
        return new AsyncEither(this.value.then(identity, fn).then(rejectify));
    }

    biMap<U>(leftFn: (T) => U, rightFn: (T) => U): AsyncEither<U> {
        return new AsyncEither(this.value.then(
            rightFn,
            value => Promise.resolve(value).then(leftFn).then(rejectify)
        ));
    }


    then(...args: Array<*>): Promise<T> {
        return this.value.then(...args);
    }
    catch(fn: Function): Promise<T> {
        return this.value.catch(fn);
    }
}


export default function AsyncEitherFactory<T>(promise: Promise<T>): AsyncEither<T> {
    return new AsyncEither(promise);
}

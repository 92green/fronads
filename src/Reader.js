// @flow

export class Reader<V> {
    fn: V => *;
    constructor(fn: Function) {
        this.fn = fn;
    }
    unit(fn: Function): Reader<Function> {
        return new Reader(fn);
    }
    run(value: any): any {
        return this.fn(value);
    }
    flatMap(fn: Function): Reader<Function> {
        return this.unit((value) => fn(this.fn(value)).run(value));
    }
    map(fn: Function): Reader<Function> {
        return this.unit((value) => fn(this.fn(value)));
    }
}

export function ReaderFactory<T>(value: (T) => *): Reader<T> {
    return new Reader(value);
}

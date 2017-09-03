// @flow

class Reader {
    constructor(fn) {
        this.fn = fn;
    }
    unit(fn) {
        return new Reader(fn);
    }
    run(value) {
        return this.fn(value)
    }
    flatMap(fn) {
        return this.unit((value) => fn(this.fn(value)).run(value))
    }
    map(fn) {
        return this.unit((value) => fn(this.fn(value)))
    }
}

export function ReaderFactory(value: any): Reader {
    return new Reader(value);
}




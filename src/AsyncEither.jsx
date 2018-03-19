const rejectify = _ => Promise.reject(_);

class AsyncEither {
    constructor(value) {
        this.value = value;
    }

    static unit(value) {
        return new AsyncEither(Promise.resolve(value));
    }
    flatMap(fn) {
        return new AsyncEither(
            this.value
                .then(fn)
                .then(_ => _.value)
        );
    }
    map(fn) {
        return new AsyncEither(this.value.then(fn));
    }

    static leftUnit(value) {
        return new AsyncEither(Promise.reject(value));
    }
    leftFlatMap(fn) {
        return new AsyncEither(
            this.value
                .then(null, value => Promise.reject(fn(value)))
                .then(null, _ => _.value)
        );
    }
    leftMap(fn) {
        return new AsyncEither(this.value.then(null, fn).then(rejectify));
    }

    biMap(leftFn, rightFn) {
        return new AsyncEither(this.value.then(
            rightFn,
            value => Promise.resolve(value).then(leftFn).then(rejectify)
        ));
    }


    then(...args) {
        return this.value.then(...args);
    }
    catch(fn) {
        return this.value.catch(fn);
    }
}

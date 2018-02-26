//@flow
export default function Do(generatorFunction: Function, passThroughValue: *): * {
    const generator = generatorFunction(passThroughValue);
    let monad;

    function next(flatMapValue: *): * {
        const res = generator.next(flatMapValue);
        const {value, done} = res;

        if (done) {
            return monad.constructor.unit(value);
        } else {
            monad = value;
            return value.flatMap(next);
        }
    }
    return next(null);
}

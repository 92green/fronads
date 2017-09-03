// @flow

export class State<V, S> {
    run: Function;
    constructor(run: Function) {
        this.run = run;
    }
    unit<W, T>(run: Function): State<W, T> {
        return new State(run);
    }
    join<W, T>(): State<W, T> {
        return this.unit((nextState: *): * => {
            var {state, value} = this.run(nextState);
            return value.run(state);
        });
    }
    flatMap<W>(fn: (V) => State<W, S>): State<W, S> {
        return this.map(fn).join();
    }
    map<W>(fn: (V) => W): State<W, S> {
        return this.unit((nextState: *): * => {
            var {value, state} = this.run(nextState);
            return {
                value: fn(value),
                state
            };
        });
    }
    value(initState: any): any {
        return this.run(initState).value;
    }
    state(initState: any): any {
        return this.run(initState).state;
    }
}


// of
export function StateValue<V>(value: V): State<V, *> {
    return new State(state => ({value, state}));
}


export function StatePut<S>(state: S): State<S, S> {
    return new State(() => ({value: state, state}));
}

export function StateGet(): State<*, *> {
    return new State(state => ({value: state, state}));
}

export function StateModify(fn: Function): State<*, *> {
    return StateGet().flatMap(state => StatePut(fn(state)));
}


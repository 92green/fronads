// @flow

function falsify(obj: Object): Object {
    return Object
        .keys(obj)
        .reduce((rr, ii) => {
            rr[ii] = false;
            return rr;
        }, {});
}

/**
 * @module State
 */
class StateFunctor {
    val: any;
    value: Function;
    stateKeys: string[];

    /**
     * State constructor
     *
     * @param {*} value - The value to store
     * @param {object} stateBooleans - Whether or not the maybe is `some` or `none`
     * @return {State}
     */
    constructor(value: any, stateBooleans: Object) {
        this.val = value;
        this.value = (defaultValue: * = null): * => this.val == null ? defaultValue : this.val;
        this.stateKeys = [];
        Object
            .keys(stateBooleans)
            .forEach((booleanKey: string) => {
                const stateKey = `is${booleanKey}`;

                this.stateKeys = this.stateKeys.concat(stateKey);
                // console.log(this.stateBooleans);
                this[stateKey] = stateBooleans[booleanKey];

                const unit = (value: *): StateFunctor => {
                    return new StateFunctorFactory(value, {
                        ...falsify(stateBooleans),
                        [booleanKey]: true
                    });
                };

                const flatMap = (fn: Function): StateFunctor => {
                    return this[stateKey] ? fn(this.val) : this;
                };

                const map = (fn: Function): StateFunctor => {
                    return flatMap(value => unit(fn(value)));
                };

                const to = (): StateFunctor => {
                    return unit(this.val);
                };

                this[`to${booleanKey}`] = to;
                this[`${booleanKey.toLowerCase()}Unit`] = unit;
                this[`${booleanKey.toLowerCase()}FlatMap`] = flatMap;
                this[`${booleanKey.toLowerCase()}Map`] = map;
            });
    }

    equals(stateFunctor: StateFunctor): boolean {
        if(stateFunctor.val !== this.val) {
            return false;
        }

        for (let key of this.stateKeys) {
            if(stateFunctor[key] !== this[key]) {
                return false;
            }
        }

        return true;
    }


}


export function StateFunctorFactory(value: any, stateBooleans: Object): Maybe {
    return new StateFunctor(value, stateBooleans);
}


/**
 * Sometimes the state of your app can be represented through more than two states.
 * The StateMonadFactory lets you create a monad with an arbitary number of state.
 *
 * Given an array of names it will returns an on object of custom Unit functions.
 *
 * @name StateFunctor
 * @example
 * StateFunctor(['Empty', 'Fetching', 'Refetching', 'Error', 'Success'])
 * // {
 * //      EmptyState: EmptyState,
 * //      FetchingState: FetchingState,
 * //      RefetchingState: RefetchingState,
 * //      ErrorState: ErrorState,
 * //      SuccessState: SuccessState
 * // }
 *
 * StateFunctor(['New', 'Edit', 'View'])
 * // {
 * //      NewState: NewState,
 * //      EditState: EditState,
 * //      ViewState: ViewState
 * // }
 */
export function StateFunctorFactoryFactory(stateBooleans: boolean[]): Object {
    return stateBooleans
        .reduce((rr, ii) => {
            const bools = stateBooleans
                .reduce((rr, ii) => {
                    rr[ii] = false;
                    return rr;
                }, {});
            rr[`${ii}State`] = (value) => StateFunctorFactory(value, {...bools, [ii]: true});
            return rr;
        }, {});
}


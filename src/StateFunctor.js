// @flow

import type {Mapper} from './definitions';

function falsify(obj: Object): Object {
    return Object
        .keys(obj)
        .reduce((rr: Object, ii: string): Object => {
            rr[ii] = false;
            return rr;
        }, {});
}

/**
 * @module State
 */
export class StateFunctor<T> {
    val: T;
    value: Function;
    stateKeys: string[];

    /**
     * State constructor
     *
     * @param {*} value - The value to store
     * @param {object} stateBooleans - Whether or not the maybe is `some` or `none`
     * @return {State}
     */
    constructor(value: T, stateBooleans: Object) {
        this.val = value;
        this.value = (defaultValue: * = null): * => this.val == null ? defaultValue : this.val;
        this.stateKeys = [];
        Object
            .keys(stateBooleans)
            .forEach((booleanKey: string) => {
                const stateKey = `is${booleanKey}`;

                const FLOWBUG_this: Object = this;
                const _this = this;

                this.stateKeys = this.stateKeys.concat(stateKey);

                FLOWBUG_this[stateKey] = stateBooleans[booleanKey];

                function unit<U>(value: U): StateFunctor<U> {
                    return new StateFunctorFactory(value, {
                        ...falsify(stateBooleans),
                        [booleanKey]: true
                    });
                }

                function flatMap<U>(fn: Mapper<T,StateFunctor<U>>): StateFunctor<U>|StateFunctor<T> {
                    return FLOWBUG_this[stateKey] ? fn(_this.val) : _this;
                }

                function map<U>(fn: Mapper<T,U>): StateFunctor<U>|StateFunctor<T> {
                    return flatMap(value => unit(fn(value)));
                }

                function to(): StateFunctor<T> {
                    return unit(_this.val);
                }

                FLOWBUG_this[`to${booleanKey}`] = to;
                FLOWBUG_this[`${booleanKey.toLowerCase()}Unit`] = unit;
                FLOWBUG_this[`${booleanKey.toLowerCase()}FlatMap`] = flatMap;
                FLOWBUG_this[`${booleanKey.toLowerCase()}Map`] = map;
            });
    }

    equals(stateFunctor: Object): boolean {
        const FLOWBUG_this: Object = this;
        if(stateFunctor.val !== this.val) {
            return false;
        }

        for (let key of this.stateKeys) {
            if(stateFunctor[key] !== FLOWBUG_this[key]) {
                return false;
            }
        }

        return true;
    }


}


export function StateFunctorFactory<T>(value: T, stateBooleans: Object): StateFunctor<T> {
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
export function StateFunctorFactoryFactory(stateBooleans: string[]): Object {
    return stateBooleans
        .reduce((rr: Object, ii: string): Object => {
            const bools = stateBooleans
                .reduce((rr: Object, ii: string): Object => {
                    rr[ii] = false;
                    return rr;
                }, {});

            rr[`${ii}State`] = (value) => StateFunctorFactory(value, {...bools, [ii]: true});
            return rr;
        }, {});
}


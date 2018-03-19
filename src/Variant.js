// @flow

/**
 * @module Variant
 */
export class Variant {
    val: *;
    type: string;

    /**
     * Variant constructor
     *
     * @param {*} value - The value to store
     * @param {object} stateBooleans - Whether or not the maybe is `some` or `none`
     * @return {Variant}
     */
    constructor(value: *, type: string, typeList: Array<string>) {
        this.val = value;
        this.type = type;

        typeList
            .forEach((name: string) => {
                // const stateKey = `is${booleanKey}`;

                // TODO: Flow cant handle computed property types on classes
                // This line tricks flow into thinking it's just an object
                // UBER HACK. But as it is a library the flow types need to be valid as they
                // can't be ignored through comments and so you are left with the rock/hard place
                // of broken flow or gross hacks.
                const FLOWBUG_this: Object = this;

                const unit = (value: *): Variant => {
                    return new Variant(value, name, typeList);
                };

                const flatMap = (fn: (*) => Variant): Variant => {
                    return this.type === name ? fn(this.val) : this;
                };

                const map = (fn: (*) => *): Variant => {
                    return flatMap(value => unit(fn(value)));
                };

                const to = (): Variant => {
                    return unit(this.val);
                };

                FLOWBUG_this[`to${name[0].toUpperCase()}${name.slice(1)}`] = to;
                FLOWBUG_this[`${name[0].toLowerCase()}${name.slice(1)}Unit`] = unit;
                FLOWBUG_this[`${name[0].toLowerCase()}${name.slice(1)}FlatMap`] = flatMap;
                FLOWBUG_this[`${name[0].toLowerCase()}${name.slice(1)}Map`] = map;
            });
    }
    value(defaultValue: * = null): * {
        return this.val == null ? defaultValue : this.val;
    }
}




/**
 * Sometimes the state of your app can be represented through more than two states.
 * The StateMonadFactory lets you create a monad with an arbitary number of state.
 *
 * Given an array of names it will returns an on object of custom Unit functions.
 *
 * @name Variant
 * @example
 * Variant(['Empty', 'Fetching', 'Refetching', 'Error', 'Success'])
 * // {
 * //      EmptyState: EmptyState,
 * //      FetchingState: FetchingState,
 * //      RefetchingState: RefetchingState,
 * //      ErrorState: ErrorState,
 * //      SuccessState: SuccessState
 * // }
 *
 * Variant(['New', 'Edit', 'View'])
 * // {
 * //      NewState: NewState,
 * //      EditState: EditState,
 * //      ViewState: ViewState
 * // }
 */
export function VariantFactory(typeList: string[]): Object {
    return typeList
        .reduce((rr: Object, name: string): Object => {
            rr[name] = (value) => new Variant(value, name, typeList);
            return rr;
        }, {});
}


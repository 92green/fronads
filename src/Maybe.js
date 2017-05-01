// @flow

//
// Identities
//

export function Some(value: any): Maybe {
    return new Maybe(value, true);
}

export function None(): Maybe {
    return new Maybe(null, false);
}


//
// Monad
//

export default class Maybe {
    static fromNull(value: any): Maybe {
        return value == null ? None() : Some(value);
    }
    constructor(value: any, isSome: boolean) {
        this.isSome = isSome;
        this.val = value;
    }
    unit(value: any): Maybe {
        return Some(value);
    }
    map(fn: any): Maybe {
        return this.flatMap(value => this.unit(fn(value)));
    }
    flatMap(fn: Function): any {
        return this.isSome ? fn(this.val) : this;
    }
    value(defaultValue: any = null): any {
        return this.val == null ? defaultValue : this.val;
    }
}

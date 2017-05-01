// @flow

import {Some, None} from './Maybe';

//
// Identities
//

export function Right(value: any): Either {
    return new Either(value, true);
}

export function Left(value: any): Either {
    return new Either(value, false);
}

export function Try(func: Function): eitherWithFn {
    try  {
        return Right(func.call());
    } catch(error) {
        return Left(error);
    }
}


//
// Monad
//

export default class Either {
    constructor(value: any, isRight: boolean) {
        this.isRight = isRight;
        this.val = value;
    }
    unit(value: any): Either {
        return Right(value);
    }
    flatMap(fn: Function): Either {
        return this.isRight ? fn(this.val) : this;
    }
    map(fn: Function): Either {
        return this.flatMap(value => this.unit(fn(value)));
    }
    leftFlatMap(fn: Functon): Either {
        return this.isRight ? this : fn(this.val);
    }
    leftMap(fn: Function): Either {
        return this.leftFlatMap(value => Left(fn(value)));
    }
    ap(eitherWithFn: Either): Either {
        return this.isRight ? eitherWithFn.map(fn => fn(this.val)) : this;
    }
    cata(leftFn: Function, rightFn: Function): any {
        return this.isRight ? rightFn(this.val) : leftFn(this.val);
    }
    toMaybe(): Maybe {
        return this.isRight ? Some(this.val) : None();
    }
}

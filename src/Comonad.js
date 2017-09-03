// // @flow

// class CoIdentity<A> {
//     val: A;
//     constructor(val: A) {
//         this.val = val;
//     }
//     unit<B>(val: B): CoIdentity<B> {
//         return new CoIdentity(val);
//     }
//     extract(): A {
//         return this.val
//     }

//     flatMap<B>(fn: (A) => CoIdentity<B>) {
//         return fn(this.val);
//     }
//     extend(fn) {
//         return this.unit(fn(this)).extract()
//     }
//     map(fn) {
//         return this.unit(fn(this.val))
//     }
// }

// export function CoIdentityFactory<B>(value: B): CoIdentity<B> {
//     return new CoIdentity(value);
// }


// // 1. `w.extend(_w => _w.extract())` is equivalent to `w`
// // 2. `w.extend(f).extract()` is equivalent to `f(w)`

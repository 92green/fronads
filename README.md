# Fronads
[![fronads npm](https://img.shields.io/npm/v/fronads.svg?style=flat-square)](https://www.npmjs.com/package/stampy)

> Frontend monads with consistent and beginner-friendly naming conventions. 

[docs](https://blueflag.github.io/fronads/)

### What is a monad? 
Monads are function composers. They let you compose functions together to control your program flow.

* Monads let you map a function to a value. 
* Monads are only ever in one state at a time. Each of their methods returns either the same monad or a new one in a different state. 


### Almost monads
Monads are a specific combination of ideas that you probably already understand. Because of this it can be hard to understand the whole but easy to grasp the parts. 

Some almost monad things to help you understand:

* __Promises are almost monads__: They provide a consistent interface to structure the flow of async data
* __Promises are almost monads__: They can only ever be in one state at a time. Resolved, Rejected.
* __Arrays are almost monads__: They can always have a function mapped to their value, regardless of what they contain. 
* __Array.map is almost monadic__: It provides a level of immutability by returning a new array with the values changed.

### All monads 
All monads have these three methods. Some languages have different names for them, but their idea remains the same.

* Unit 
* flatMap 
* map

### Unit
Unit is the monad constructor. It takes a value and returns a new monad of that state.
Because monads deal with program flow and most monads have sort of sub types that represent one or more the states. The Unit's purpose is to let you declare a single monad of a specific state. E.g.

Some/None
Left/Right
Fetching/Error/Success

```js
function unitExample() {
    return test ? Some(value) : None();
}
```

The above function is consistent because it always returns a monad. However if `test` is true it will return a`Some` monad containing a value, otherwise it will return a `None`.

*9/10 times you'd use the specific unit constructor for the monad you want but each monad does have a `.unit` method*

### flatMap
The second core function of a monad is Flatmap. It's not however the flatter version of map, in fact flatMap provideds the basis for map. 
Flatmap says I'll pass the current value to your function, you return me another monad. 

Other terms: bind, chain

*Fronads chooses flatMap/map because they pair nicely.*
### map

Map builds off both unit and Flatmap, and  is essentially `value => flatMap(Unit(value))`.
Map is a convenient flatMap. It knows that you probably want the same monad again and so automatically creates the one you want. Letting you do things like:

```
Some(person).map(person => person.age) 
```

The above statement will return a new some containing the persons age. 






# request-state-monad

## example

```jsx
function MyComponent(props) {
    return props.requestState
        .fetchingMap(() => <Loader />)
        .errorMap(error => <div>Error code: {error.code}</div>)
        .map(data => {
            return <div>
                <h1>We have data!</h1>
                <pre>{JSON.stringify(data)}</pre>
            </div>

        })
        .orValue()
}
```

## api


## Types (imports)
```js
RequestState<value, fetching, error, success>;

RequestFetching(value: any): RequestState<V,true,false,false>
RequestError(value: any): RequestState<V,false,true,false>
RequestSuccess(value: any): RequestState<V,false,false,true>
RequestEmpty(): RequestState<V,false,false,false>
```

## Methods

### `map(fn: any): RequestState`
perform a map only on RequestSuccess

### `flatMap(fn: Function): any`
perform a flatMap only on RequestSuccess

### `fetchingMap(fn: Function): RequestState`
perform a map only on RequestFetching

### `fetchingFlatMap(fn: Function): RequestState`
perform a map only on RequestFetching

### `errorMap(fn: Function): RequestState`
perform a map only on RequestError

### `errorFlatMap(fn: Function): RequestState`
perform a map only on RequestError

### `orValue(defaultValue: any): any`
return the current value of the monad or defaultValue


### `toFetching(): RequestState`
return a new `RequestFetching` with the current value.
### `toError(): RequestState`
return a new `RequestError` with the current value.
### `toSuccess(): RequestState`
return a new `RequestSuccess` with the current value.
### `toEmpty(): RequestState`
return a new `RequestEmpty` with the current value.


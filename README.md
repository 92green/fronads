# Fronads

[docs](https://blueflag.github.io/fronads/)



# Examples

## Hock application

```
withData(withState(component))

Some(component)
    .map(withState)
    .map(withData)
    .value();

[withState, withData]
    .reduce((rr, ii) => rr.map(ii), Some(component))
    .value()

[withData, withState]
    .reverse()
    .reduce((rr, ii) => rr.map(ii), Some(component))
    .value()
```



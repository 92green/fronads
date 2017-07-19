// @flow

export function getIn(collection: Object, keyPath: string[]): * {
    var item: * = collection;
    for(let key of keyPath) {
        if(item == null || !item[key]) {
            return null;
        }
        item = item[key];
    }
    return item;
}

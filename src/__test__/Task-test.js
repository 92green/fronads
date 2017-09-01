import test from 'ava';
import {TaskFactory as Task, Reject, Resolve} from '../Task';

const delay = (value) => new Task((_, resolve) => setTimeout(() => resolve(value), 500));

test('Task', tt => {
    console.log('first');
    return delay('rad')

        // .leftFlatMap(data => Resolve(data + 2))
        // .map(data => console.log('recover', data))
        .map((a) => console.log('third', a) || a)
        .flatMap(delay)
        // .map((a) => console.log('fourth', a) || tt.end())
        .toPromise()
        .then(() => tt.pass());
        // .then((value) => console.log("promise", value))

});

import test from 'ava';
import {TaskFactory as Task, Reject, Resolve, TaskPromise} from '../Task';

// const delay = (value) => new Task((_, resolve) => setTimeout(() => resolve(value), 500));


//
// unit
//
test('Task.unit returns a new task', (tt: Object): Promise<string> => {
    return Resolve()
        .unit((_, resolve) => resolve('foo'))
        .toPromise()
        .then((data) => tt.is(data, 'foo'));
});


//
// flatMap
//
test('Task.flatMap will be called on resolved values.', (tt: Object): Promise<string> => {
    return Resolve()
        .flatMap(() => Resolve('foo'))
        .toPromise()
        .then((data) => tt.is(data, 'foo'));
});

test('Task.flatMap will be not called on rejected values.', (tt: Object): Promise<string> => {
    return Reject('foo')
        .flatMap(() => Resolve('bar'))
        .toPromise()
        .catch((data) => tt.is(data, 'foo'));
});

test('Task.flatMap will accept the new task that is returned', (tt: Object): Promise<string> => {
    return Resolve('foo')
        .flatMap(() => Reject('bar'))
        .toPromise()
        .catch((data) => tt.is(data, 'bar'));
});


//
// leftFlatMap
//
test('Task.leftFlatMap will be called on rejected values.', (tt: Object): Promise<string> => {
    return Reject()
        .leftFlatMap(() => Reject('foo'))
        .toPromise()
        .catch((data) => tt.is(data, 'foo'));
});

test('Task.leftFlatMap will be not called on resolved values.', (tt: Object): Promise<string> => {
    return Resolve('foo')
        .leftFlatMap(() => Reject('bar'))
        .toPromise()
        .then((data) => tt.is(data, 'foo'));
});

test('Task.leftFlatMap will accept the new task that is returned', (tt: Object): Promise<string> => {
    return Reject('foo')
        .leftFlatMap(() => Resolve('bar'))
        .map(() => 'baz')
        .toPromise()
        .then((data) => tt.is(data, 'baz'));
});


//
// map
//
test('Task.map will be called on resolved values.', (tt: Object): Promise<string> => {
    return Resolve()
        .map(() => 'foo')
        .toPromise()
        .then((data) => tt.is(data, 'foo'));
});

test('Task.map will be not called on rejected values.', (tt: Object): Promise<string> => {
    return Reject('foo')
        .map(() => 'bar')
        .toPromise()
        .catch((data) => tt.is(data, 'foo'));
});

test('Task.map will place the return value in a new task', (tt: Object): Promise<string> => {
    tt.plan(2);
    return Resolve()
        .map(() => Resolve('bar'))
        .map((data: Task): Task => {
            tt.is(data._type, 'Task');
            return data;
        })
        .toPromise()
        .then((data) => data.toPromise().then((data) => tt.is(data, 'bar')));
});


//
// leftMap
//
test('Task.leftMap will be called on rejected values.', (tt: Object): Promise<string> => {
    return Reject()
        .leftMap(() => 'foo')
        .toPromise()
        .catch((data) => tt.is(data, 'foo'));
});

test('Task.leftMap will be not called on resolved values.', (tt: Object): Promise<string> => {
    return Resolve('foo')
        .leftMap(() => 'bar')
        .toPromise()
        .then((data) => tt.is(data, 'foo'));
});

test('Task.leftMap will place the return value in a new task', (tt: Object): Promise<string> => {
    tt.plan(2);
    return Reject()
        .leftMap(() => Reject('bar'))
        .leftMap((data: Task): Task => {
            tt.is(data._type, 'Task');
            return data;
        })
        .toPromise()
        .catch((data) => data.toPromise().catch((data) => tt.is(data, 'bar')));
});



//
// run
//
test.cb('Tasks will not execute until run is called.', (tt: Object): Promise<string> => {
    Resolve().map(tt.fail);
    Resolve()
        .map(() => 'foo')
        .map(() => tt.pass())
        .map(() => tt.end())
        .run();
});

//
// toPromise
//
test('Task.toPromise will return a promise', (tt: Object): Promise<string> => {
    return Resolve('foo').toPromise().then((data) => tt.is(data, 'foo'));
});


//
// TaskFactory unit
//
test('Task factory lets the user create a resolved task from a callback', (tt: Object): Promise<string> => {
    return Task((_, resolve) => setTimeout(() => resolve('foo'), 2))
        .toPromise()
        .then((data) => tt.is(data, 'foo'));
});

test('Task factory lets the user create a rejected task from a callback', (tt: Object): Promise<string> => {
    return Task((reject) => setTimeout(() => reject('foo'), 2))
        .toPromise()
        .catch((data) => tt.is(data, 'foo'));
});



//
// Resolve/Reject unit
//
test('Resolve creates a resolved task', (tt: Object): Promise<string> => {
    return Resolve()
        .map(() => 'foo')
        .toPromise()
        .then((data) => tt.is(data, 'foo'));
});

test('Reject creates a rejected task', (tt: Object): Promise<string> => {
    return Reject()
        .leftMap(() => 'foo')
        .toPromise()
        .catch((data) => tt.is(data, 'foo'));
});


//
// TaskPromise
//
test('TaskPromise creates a rejected task from a rejected promise', (tt: Object): Promise<string> => {
    return TaskPromise(() => Promise.reject('foo'))
        .toPromise()
        .catch((data) => tt.is(data, 'foo'));
});

test('TaskPromise creates a resolved task from a resolved promise', (tt: Object): Promise<string> => {
    return TaskPromise(() => Promise.resolve('foo'))
        .toPromise()
        .then((data) => tt.is(data, 'foo'));
});



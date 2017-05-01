import test from 'ava';
import Maybe, {
    Some,
    None
} from '../Maybe';


const person = Some({
    child: Some({
        child: Some('harry')
    })
});

const noGrandChild = Some({
    child: Some({
        child: None()
    })
});

const getChild = (ii) => ii.child;

test('Some', tt => {
    tt.is(Some(1).map(() => 2).value(), 2);
    tt.is(person.flatMap(getChild).flatMap(getChild).value(), 'harry');
});

test('None', tt => {
    tt.is(noGrandChild.flatMap(getChild).flatMap(getChild).value(), null);
    tt.is(noGrandChild.flatMap(getChild).flatMap(getChild).flatMap(getChild).value(), null);
});


test('fromNull', tt => {
    tt.is(Maybe.fromNull(2).isSome, true);
    tt.is(Maybe.fromNull(null).isSome, false);
});


test('to', tt => {
    tt.is(Some(1).toEither().isRight, true);
    tt.is(None().toEither().isRight, false);
    tt.is(None().toEither('fail').val, 'fail');
});

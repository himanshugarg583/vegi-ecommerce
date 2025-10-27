import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../../Store/slice/counterSlice.js';


function Reduxtest() {
const count = useSelector((state) => state.counter.value);
const dispatch = useDispatch();


return (
<div style={{ textAlign: 'center', marginTop: '2rem' }}>
<h1>Redux Counter</h1>
<p>Count: {count}</p>
<button onClick={() => dispatch(increment())}>Increment</button>
<button onClick={() => dispatch(decrement())}>Decrement</button>
<button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
</div>
);
}


export default Reduxtest;
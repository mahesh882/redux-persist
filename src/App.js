import './App.css';
import { useSelector, useDispatch } from 'react-redux'

const NAMES = ["Tommy", "Pranav", "Allison", "Harry", "Don", "Mike", "Donna", "Emma", "Kristen"]

function App() {
  const fullState = useSelector(state => state);
  const dispatch = useDispatch();

  const chosenName = NAMES[Math.floor((Math.random() * 10))]; 

  return (
    <div className="App">
      {console.log(fullState.name)}
      <h1>Value from store: {fullState.name}</h1>
      <button onClick={() => dispatch({type: "NEW_NAME", payload: { name: chosenName }})}>Change Name</button>
    </div>
  );
}

export default App;

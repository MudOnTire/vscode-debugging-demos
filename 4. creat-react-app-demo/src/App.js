import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  function handleClick() {
    alert('Just Learn');
  }

  console.log('haha');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={handleClick}>
          Learn React
        </button>
      </header>
    </div>
  );
}

export default App;

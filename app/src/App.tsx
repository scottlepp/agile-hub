import React from 'react';
import './App.scss';
import '@primer/components'
import './Github.css';
import Board from './Board';
import NavBar from './NavBar';

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <main className="border border-top-0 p-3">
        <Board name="foo"/>
      </main>
    </div>
  );
}

export default App;

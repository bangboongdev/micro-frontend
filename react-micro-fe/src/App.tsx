import React from 'react';
// import { lazy, Suspense } from 'react';
// import logo from './logo.svg';
import './App.css';

// const ReactView1 = lazy(() => import('./views/ReactView1'));
// const ReactView2 = lazy(() => import('./views/ReactView2'));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

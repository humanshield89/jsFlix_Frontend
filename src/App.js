import React from 'react';
import './App.css';
import YifyContainer from "./Components/YifyContainer";
import {IOptions as classes} from "glob";


function App() {

  return (
    <div className="App">
        <header className="pageHeader">
          <h1>JSFlix</h1>
        </header>
      <YifyContainer />
        </div>
  );
}

export default App;

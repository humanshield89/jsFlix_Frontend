import React from 'react';
import './App.css';
import YifyContainer from "./Components/YifyContainer";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles} from "@material-ui/core/styles";
import {fade} from "@material-ui/core";
import MyAppBar from "./Components/MyAppBar";

function App() {

  return (
    <div className="App">
      <MyAppBar />
      <YifyContainer />
        </div>
  );
}

export default App;

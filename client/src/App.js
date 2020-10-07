import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import './App.css';

function App() {
  WebFontConfig = {
    typekit: {
      id: 'dwo8vrd'
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={CreateRoom} />
          <Route path="/room/:roomID" component={Room}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}


export default App;

import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import Test from "./routes/test";
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={CreateRoom} />
          <Route path="/test/" component={Test}>
            <h1>TESTING 123</h1>
          </Route>
          <Route path="/room/:roomID" component={Room}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

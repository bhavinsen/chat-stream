import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Join from "./components/Join";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Join} />
        <Route path="/chat/:user_nickName" component={Chat} />
      </Switch>
    </Router>
  );
};

export default App;

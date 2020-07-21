import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./app/pages/login";
import User from "./app/pages/user";
import CreateUser from "./app/pages/createUser";
import EditBedroom from "./app/pages/editBedroom";

class App extends Component {
  async componentDidMount() {}

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  state = {
    user: null,
    succesfullyCreatedUser: false,
    succesfulLogin: false,
    selectedBedroom: -1,
    editState: "",
    newBed: null,
    newDoor: null,
    newObject: null
  };

  render() {
    const App = () => (
      <div>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Login
                updateAppState={this.updateAppState}
                user={this.state.user}
                succesfulLogin={this.state.succesfulLogin}
                succesfullyCreatedUser={this.state.succesfullyCreatedUser}
              />
            )}
          />
          <Route
            exact
            path="/createUser"
            render={() => (
              <CreateUser updateAppState={this.updateAppState} user={this.state.user} />
            )}
          />
          <Route
            exact
            path="/user"
            render={() => (
              <User
                updateAppState={this.updateAppState}
                user={this.state.user}
                succesfulLogin={this.state.succesfulLogin}
              />
            )}
          />
          <Route
            exact
            path="/edit"
            render={() => (
              <EditBedroom
                updateAppState={this.updateAppState}
                user={this.state.user}
                selectedBedroom={this.state.selectedBedroom}
                editState={this.state.editState}
                newBed={this.state.newBed}
                newDoor={this.state.newDoor}
                newObject={this.state.newObject}
              />
            )}
          />
        </Switch>
      </div>
    );
    return (
      <Switch>
        <App />
      </Switch>
    );
  }

  updateAppState = async (key, become) => {
    await this.setState({ [key]: become });
  };
}

export default App;

import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

class CreateUser extends Component {
  async componentDidMount() {}

  componentWillUnmount() {}

  state = {
    wrongPassword: false,
    errorMessage: "",
    succes: false
  };

  render() {
    return !this.state.succes ? (
      <div className="loginContainer">
        <div className="loginSubContainer">
          <form action="" id="createUserForm">
            <div>
              Pick a username: <input type="text" name="username" id="username" />{" "}
            </div>
            <div>
              Pick a password: <input type="password" name="password1" id="password1" />
            </div>
            <div>
              Repeat password: <input type="password" name="password2" id="password2" />
            </div>
            <div className="alterButtons">
              <input
                type="submit"
                value="Create"
                onClick={this.createUser}
                id="createPassword"
                className="alterButton"
              />
              <Link className="button alterButton" to="/">
                Back
              </Link>
            </div>
          </form>
          {this.state.wrongPassword === true && <div>{this.state.errorMessage}</div>}
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    );
  }

  createUser = async e => {
    let formData = new FormData(document.getElementById("createUserForm"));
    e.preventDefault();
    let createUserData = {
      username: formData.get("username"),
      password1: formData.get("password1"),
      password2: formData.get("password2")
    };

    let data = await fetch("/createUserInformation", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify(createUserData)
    });

    let json = await data.json();

    console.log(json);
    if (json === "succes") {
      this.setState({ succes: true });
      await this.props.updateAppState("succesfullyCreatedUser", true);
    } else {
      this.setState({ wrongPassword: true, errorMessage: json });
    }
  };

  updateWindowDimensions = async () => {};
}

export default CreateUser;

import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./login.css";

class Login extends Component {
  async componentDidMount() {}

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  state = {
    wrongPassword: false,
    errorMessage: ""
  };

  render() {
    let { succesfulLogin, succesfullyCreatedUser } = this.props;
    return (
      <React.Fragment>
        <div className="loginContainer">
          <div className="loginSubContainer">
            {succesfulLogin ? (
              <Redirect to="/user" />
            ) : (
              <React.Fragment>
                {succesfullyCreatedUser && (
                  <div className="information">
                    You've succesfully created an account. Please log in below.
                  </div>
                )}
                <form action="" id="loginForm">
                  <div>
                    Username: <input type="text" name="username" id="username" />{" "}
                  </div>
                  <div>
                    Password: <input type="password" name="password" id="password" />
                  </div>
                  <div className="loginButtons">
                    <input type="submit" value="Log In" onClick={this.login} className="button" />
                    <Link to="/createUser">Create Account</Link>
                  </div>
                </form>

                {this.state.wrongPassword && <div>{this.state.errorMessage}</div>}
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }

  login = async e => {
    let formData = new FormData(document.getElementById("loginForm"));
    e.preventDefault();
    let loginData = {
      username: formData.get("username"),
      password: formData.get("password")
    };

    let data = await fetch("/getLoginInformation", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify(loginData)
    });

    let json = await data.json();

    if (json !== "Wrong password" && json !== "Username does not exist") {
      await this.props.updateAppState("user", json);
      await this.props.updateAppState("succesfulLogin", true);
    } else {
      await this.setState({ wrongPassword: true, errorMessage: json });
    }
  };

  updateWindowDimensions = async () => {};
}

export default Login;

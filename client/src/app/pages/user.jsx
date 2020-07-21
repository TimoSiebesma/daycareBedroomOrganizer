import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./user.css";

class User extends Component {
  async componentDidMount() {
    if (this.props.succesfulLogin) {
      const user = this.props.user;

      await this.setState({ user: user });
    }
  }

  componentWillUnmount() {}

  state = {
    user: null,
    showAddChildOptions: false,
    showRemoveChildOptions: false,
    showRemoveBedroom: false,
    errorMessage: "",
    childMessage: "",
    bedroomMessage: ""
  };

  render() {
    return (
      <React.Fragment>
        {!this.props.user ? (
          this.showError()
        ) : (
          <div className="userContainer">
            {this.showBedrooms()}
            {this.showChildren()}
          </div>
        )}
      </React.Fragment>
    );
  }

  showAddChildForm = () => (
    <React.Fragment>
      <div className="buttons">
        <form action="" id="addChildForm">
          <div>
            <div>
              First name: <input type="text" name="firstName" id="firstName" />
            </div>
            <div>
              Last name: <input type="text" name="lastName" id="lastName" />
            </div>
          </div>
          <div>
            <input type="submit" value="Add Child" onClick={this.addChild} />
          </div>
        </form>
        <button
          className="miniButtonRight"
          onClick={async () => await this.setState({ showAddChildOptions: false })}>
          Back
        </button>
      </div>
    </React.Fragment>
  );

  showBedrooms = () => {
    let { showRemoveBedroom } = this.state;
    let { user, updateAppState } = this.props;
    return (
      <div className="userBedroomsContainer">
        <div className="title">Bedrooms: {user.bedrooms.length}</div>
        <div className="content">
          {user.bedrooms.map(bedroom => (
            <React.Fragment key={user.bedrooms.indexOf(bedroom)}>
              {showRemoveBedroom ? (
                <div
                  key={user.bedrooms.indexOf(bedroom)}
                  className="specButton"
                  onClick={() => this.removeBedroom(bedroom)}>
                  Bedroom {user.bedrooms.indexOf(bedroom) + 1}
                </div>
              ) : (
                <Link
                  to="/edit"
                  className="specButton"
                  onClick={async () =>
                    await updateAppState("selectedBedroom", user.bedrooms.indexOf(bedroom))
                  }>
                  Bedroom {user.bedrooms.indexOf(bedroom) + 1}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
        {!showRemoveBedroom ? (
          <div className="buttons">
            <Link
              className="alterButton"
              to="/edit"
              key={-1}
              onClick={async () => await updateAppState("selectedBedroom", -1)}>
              +
            </Link>
            <button
              className="alterButton"
              onClick={() => this.setState({ showRemoveBedroom: true })}>
              -
            </button>
          </div>
        ) : (
          <React.Fragment>
            <div className={this.state.bedroomMessage === "" ? "information" : "alert"}>
              {this.state.bedroomMessage !== ""
                ? this.state.bedroomMessage
                : "Select the bed you wish to remove"}
            </div>
            <button
              className="miniButtonLeft"
              onClick={async () =>
                await this.setState({
                  showRemoveBedroom: false,
                  bedroomMessage: ""
                })
              }>
              Back
            </button>
          </React.Fragment>
        )}
      </div>
    );
  };

  showChildren = () => {
    let { showAddChildOptions, showRemoveChildOptions } = this.state;
    let { user } = this.props;
    return (
      <div className="userChildrenContainer">
        <div className="title">Children: {user.children.length}</div>
        <div className="content">
          {user.children.map(child => (
            <div
              key={child.firstName + child.lastName}
              className="specButton"
              onClick={() => {
                this.removeChild(child.firstName, child.lastName);
              }}>
              {child.firstName}
            </div>
          ))}
        </div>
        {!showAddChildOptions && !showRemoveChildOptions
          ? this.showRegularOptions()
          : showAddChildOptions
          ? this.showAddChildForm()
          : this.showRemoveChildMessage()}
      </div>
    );
  };

  showError = () => (
    <div className="loginContainer">
      <div className="loginSubContainer">
        <div>You must be logged in to see this page</div>
        <Link to="/" className="center">
          Log in
        </Link>
      </div>
    </div>
  );

  showRegularOptions = () => (
    <div className="buttons">
      <button className="alterButton" onClick={() => this.setState({ showAddChildOptions: true })}>
        +
      </button>
      <button
        className="alterButton"
        onClick={() => this.setState({ showRemoveChildOptions: true })}>
        -
      </button>
    </div>
  );

  showRemoveChildMessage = () => (
    <React.Fragment>
      <div className="buttons">
        <div className={this.state.childMessage === "" ? "information" : "alert"}>
          {this.state.childMessage !== ""
            ? this.state.childMessage
            : "Select the child you wish to remove"}
        </div>
        <button
          className="miniButtonRight"
          onClick={async () =>
            await this.setState({
              showRemoveChildOptions: false,
              childMessage: ""
            })
          }>
          Back
        </button>
      </div>
    </React.Fragment>
  );

  addChild = async e => {
    let { user } = this.props;

    let formData = new FormData(document.getElementById("addChildForm"));
    e.preventDefault();
    let childInfo = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      inBed: false
    };

    if (
      user.children.filter(
        child => child.firstName === childInfo.firstName && child.lastName === childInfo.lastName
      ).length === 0
    ) {
      user.children.push(childInfo);

      let data = await fetch("/updateUser", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },

        body: JSON.stringify(user)
      });

      let json = await data.json();

      await this.setState({ showAddChildOptions: false });

      await this.props.updateAppState("user", json);
    } else {
      this.setState({ errorMessage: "Child is already in the database" });
    }
  };

  updateSelectedBedroom = async number => {
    await this.props.updateAppState("selectedBedroom", number);
  };

  removeChild = async (firstName, lastName) => {
    if (this.state.showRemoveChildOptions === true) {
      let user = this.props.user;

      let child = this.props.user.children.filter(
        ch => "" + ch.firstName + ch.lastName === "" + firstName + lastName
      )[0];

      if (!child.inBed) {
        user.children = user.children.filter(
          child => "" + child.firstName + child.lastName !== "" + firstName + lastName
        );

        let data = await fetch("/updateUser", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },

          body: JSON.stringify(user)
        });

        let json = await data.json();

        await this.setState({ showRemoveChildOptions: false });
        await this.props.updateAppState("user", json);
      } else {
        await this.setState({
          childMessage: "Remove child from its bed first"
        });
      }
    }
  };

  removeBedroom = async bedroom => {
    if (this.state.showRemoveBedroom === true) {
      let user = this.props.user;

      if (bedroom.beds.filter(bed => bed.child !== -1).length <= 0) {
        user.bedrooms = user.bedrooms.filter(br => br !== bedroom);

        let data = await fetch("/updateUser", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },

          body: JSON.stringify(user)
        });

        let json = await data.json();

        await this.setState({ showRemoveBedroom: false });
        await this.props.updateAppState("user", json);
      } else {
        await this.setState({
          bedroomMessage: "Remove children from bed first"
        });
      }
    }
  };

  updateWindowDimensions = async () => {};
}

export default User;

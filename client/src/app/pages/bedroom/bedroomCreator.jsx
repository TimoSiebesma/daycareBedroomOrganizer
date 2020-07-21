import React, { Component } from "react";
import Bedroom from "../../bedroomObjects/bedroom";
import "./createBedroom.css";

class BedroomCreator extends Component {
  async componentDidMount() {}

  componentWillUnmount() {}

  state = {};

  render() {
    return (
      <div className="createBedroomContainer">
        <form id="dimensionsForm">
          <div className="formTitle">What are the dimensions of your bedroom (in meters)?</div>
          <div>
            Length: <input type="text" name="length" id="length" />{" "}
          </div>
          <div>
            Width: <input type="text" name="width" id="width" />{" "}
          </div>
          <button onClick={this.createNewBedroom} id="password">
            Create Bedroom
          </button>
        </form>
      </div>
    );
  }

  createNewBedroom = async e => {
    let { user } = this.props;

    let formData = new FormData(document.getElementById("dimensionsForm"));
    e.preventDefault();
    let dimensions = {
      width: parseFloat(formData.get("width")),
      length: parseFloat(formData.get("length"))
    };

    let bedroom = new Bedroom(dimensions, []);
    user.bedrooms.push(bedroom);

    await this.props.updateAppState("user", user);
    await this.props.updateAppState("selectedBedroom", user.bedrooms.length - 1);
    await this.saveToDatabase();

    await this.props.updateEditBedroomState("askAboutDimensions", false);
  };

  saveToDatabase = async () => {
    await fetch("/updateUser", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify(this.props.user)
    });
  };

  updateWindowDimensions = async () => {};
}

export default BedroomCreator;

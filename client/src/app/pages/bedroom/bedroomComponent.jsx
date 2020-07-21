import React, { Component } from "react";
import "./components/bedroom.css";
import Bed from "../../bedroomObjects/bed";
import Door from "../../bedroomObjects/door";
import CObject from "../../bedroomObjects/cObject";
import Canvas from "./components/canvas";
import Items from "./components/items";
import Children from "./components/children";
import { Link } from "react-router-dom";
import printJS from "print-js";

class BedroomComponent extends Component {
  async componentDidMount() {}

  constructor() {
    super();
    this.canvas = React.createRef();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  state = {
    canvasWidth: 0,
    canvasLength: 0,
    gridLength: 0,
    addingBedAllowed: false,
    beds: [],
    selectedChild: -1,
    mainContainerClass: "mainContainer",
    saveText: "Save"
  };

  render() {
    let { updateAppState, user, selectedBedroom, newBed } = this.props;
    let { canvasWidth, canvasLength, gridLength, selectedChild } = this.state;
    return (
      <React.Fragment>
        <div className={this.state.mainContainerClass}>
          <Items
            turnBedSideways={this.turnBedSideways}
            startAddingBeds={this.startAddingBeds}
            stopAddingBeds={this.stopAddingBeds}
            updateBedroomComponentState={this.updateBedroomComponentState}
            newBed={newBed}
            editState={this.props.editState}
            updateAppState={updateAppState}
            newDoor={this.props.newDoor}
            startAddingDoors={this.startAddingDoors}
            newObject={this.props.newObject}
            startAddingObjects={this.startAddingObjects}
            turnObjectSideways={this.turnObjectSideways}
          />
          <div
            className="canvasUpperContainer"
            id="toPrint"
            width={canvasWidth + "px"}
            height={canvasLength + "px"}>
            <Canvas
              gridLength={gridLength}
              canvasWidth={canvasWidth}
              canvasLength={canvasLength}
              user={user}
              updateBedroomComponentState={this.updateBedroomComponentState}
              updateAppState={updateAppState}
              selectedBedroom={selectedBedroom}
              beds={user.bedrooms[selectedBedroom].beds}
              objects={user.bedrooms[selectedBedroom].objects}
              newBed={newBed}
              getGridPos={this.getGridPos}
              getMousePos={this.getMousePos}
              selectedChild={selectedChild}
              saveUserToDatabase={this.saveUserToDatabase}
              newDoor={this.props.newDoor}
              editState={this.props.editState}
              newObject={this.props.newObject}
            />
          </div>
          <Children
            user={user}
            updateAppState={this.props.updateAppState}
            updateBedroomComponentState={this.updateBedroomComponentState}
            selectedChild={selectedChild}
            editState={this.props.editState}
          />
          <div className="specialButtons">
            <button className="spButton" onClick={this.saveUserToDatabase}>
              {this.state.saveText}
            </button>
            <Link
              to="/user"
              className="spButton"
              onClick={async () => {
                await this.props.updateAppState("editState", "");
                await this.props.updateAppState("newBed", null);
                await this.props.updateAppState("newDoor", null);
                await this.props.updateAppState("newObject", null);
              }}>
              Back
            </Link>
            <button className="spButton" onClick={this.print}>
              Print
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  getGridPos = mousePosition => {
    let x = Math.floor(mousePosition.x / this.state.gridLength);
    let y = Math.floor(mousePosition.y / this.state.gridLength);
    let gridPos = {
      x: x < 0 && x > -0.5 ? 0 : x,
      y: y < 0 && y > -0.5 ? 0 : y
    };
    return gridPos;
  };

  getMousePos = e => {
    if (document.getElementById("bedroom")) {
      let rect = document.getElementById("bedroom").getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    } else {
      return { x: 0, y: 0 };
    }
  };

  saveUserToDatabase = async userprop => {
    let { user } = this.props;

    await this.setState({ saveText: "Saved!" });
    let data = await fetch("/updateUser", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify(user)
    });

    let json = await data.json();

    await this.props.updateAppState("user", json);
    setTimeout(async () => {
      await this.setState({ saveText: "Save" });
    }, 4000);
  };

  print = () => {
    printJS("bedroom", "html");
  };

  startAddingBeds = async e => {
    let formData = new FormData(document.getElementById("bedSizeForm"));
    e.preventDefault();

    let dimensions = this.props.user.bedrooms[this.props.selectedBedroom].dimensions;

    let userWidth = Math.round(
      ((this.state.canvasWidth / parseFloat(dimensions.width)) *
        parseFloat(formData.get("width"))) /
        this.state.gridLength
    );
    let userLength = Math.round(
      ((this.state.canvasLength / parseFloat(dimensions.length)) *
        parseFloat(formData.get("length"))) /
        this.state.gridLength
    );

    let newBed = new Bed(
      0,
      Math.ceil(this.state.canvasLength / this.state.gridLength) / 3,
      userWidth,
      userLength,
      -1,
      formData.get("bunkbed") ? true : false
    );

    await this.props.updateAppState("newBed", newBed);
  };

  startAddingObjects = async e => {
    console.log("reached");
    let formData = new FormData(document.getElementById("objectSizeForm"));
    e.preventDefault();

    let dimensions = this.props.user.bedrooms[this.props.selectedBedroom].dimensions;

    let userLength = Math.round(
      ((this.state.canvasLength / parseFloat(dimensions.length)) *
        parseFloat(formData.get("length"))) /
        this.state.gridLength
    );

    let userWidth = Math.round(
      ((this.state.canvasWidth / parseFloat(dimensions.width)) *
        parseFloat(formData.get("width"))) /
        this.state.gridLength
    );

    let newObject = new CObject(0, 0, userWidth, userLength);

    await this.props.updateAppState("newObject", newObject);
  };

  startAddingDoors = async e => {
    let formData = new FormData(document.getElementById("doorSizeForm"));
    e.preventDefault();

    let dimensions = this.props.user.bedrooms[this.props.selectedBedroom].dimensions;

    let userLength = Math.round(
      ((this.state.canvasLength / parseFloat(dimensions.length)) *
        parseFloat(formData.get("length"))) /
        this.state.gridLength
    );

    let newDoor = new Door(0, 0, userLength);

    await this.props.updateAppState("newDoor", newDoor);
  };

  turnBedSideways = async e => {
    e.preventDefault();
    let newBed = this.props.newBed;
    let width = newBed.gridLength;
    let length = newBed.gridWidth;

    newBed.gridWidth = width;
    newBed.gridLength = length;

    await this.props.updateAppState("newBed", newBed);
  };

  turnObjectSideways = async e => {
    e.preventDefault();
    let newObject = this.props.newObject;
    let width = newObject.gridLength;
    let length = newObject.gridWidth;

    newObject.gridWidth = width;
    newObject.gridLength = length;

    await this.props.updateAppState("newObject", newObject);
  };

  updateBedroomComponentState = async (key, become) => {
    await this.setState({ [key]: become });
  };
}

export default BedroomComponent;

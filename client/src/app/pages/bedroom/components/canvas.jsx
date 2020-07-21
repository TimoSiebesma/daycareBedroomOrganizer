import React, { Component } from "react";
import "./bedroom.css";
import Grid from "../../../bedroomObjects/grid";
import Bed from "../../../bedroomObjects/bed";
import Door from "../../../bedroomObjects/door";
import Drawer from "../../../bedroomObjects/drawer";
import CObject from "../../../bedroomObjects/cObject";

class Canvas extends Component {
  async componentDidMount() {
    this.ctx = await this.canvas.current.getContext("2d");
    this.Beds = new Bed();
    this.Doors = new Door();
    this.Objects = new CObject();
    await this.update();

    window.addEventListener("resize", this.updateWindowDimensions);
    document.addEventListener("mousemove", this.updateMouseMove);
    document.addEventListener("mouseup", this.click);
  }

  constructor() {
    super();
    this.canvas = React.createRef();
    this.gridPos = { x: -1, y: -1 };
    this.grid = null;
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.updateMouseMove);
    document.removeEventListener("mouseup", this.click);

    window.removeEventListener("resize", this.updateWindowDimensions);

    this.setState = (state, callback) => {
      return;
    };
  }

  async componentDidUpdate(prevProps, prevState) {}

  state = {};

  render() {
    let { canvasWidth, canvasLength } = this.props;
    return (
      <React.Fragment>
        <canvas
          width={canvasWidth + "px"}
          height={canvasLength + "px"}
          className="canvasContainer"
          ref={this.canvas}
          id="bedroom"
        />
      </React.Fragment>
    );
  }

  async findCanvasDimensions(dimensions) {
    let canvasDim = {
      width: window.innerWidth * 0.6,
      length: ((window.innerWidth * 0.6) / dimensions.width) * dimensions.length
    };

    while (canvasDim.length > window.innerHeight * 0.95) {
      canvasDim =
        canvasDim.length > window.innerHeight * 0.95
          ? {
              width: canvasDim.width * 0.9,
              length: canvasDim.length * 0.9
            }
          : canvasDim;
    }

    while (canvasDim.width > window.innerWidth * 0.475) {
      canvasDim =
        canvasDim.width > window.innerWidth * 0.475
          ? {
              width: canvasDim.width * 0.9,
              length: canvasDim.length * 0.9
            }
          : canvasDim;
    }

    await this.props.updateBedroomComponentState("canvasWidth", canvasDim.width);
    await this.props.updateBedroomComponentState("canvasLength", canvasDim.length);
    await this.props.updateBedroomComponentState("gridLength", canvasDim.width / 40);
  }

  isOutSideOfGrid = () =>
    this.gridPos.x < 0 ||
    this.gridPos.y < 0 ||
    this.gridPos.x > Math.ceil(this.props.canvasWidth / this.props.gridLength) ||
    this.gridPos.y > Math.ceil(this.props.canvasLength / this.props.gridLength);

  isInCanvas = () =>
    this.gridPos.x >= 0 &&
    this.gridPos.y >= 0 &&
    this.gridPos.x < Math.ceil(this.props.canvasWidth / this.props.gridLength) &&
    this.gridPos.y < Math.ceil(this.props.canvasLength / this.props.gridLength);

  setGridPositions = async (obj, i, free, type) => {
    let { canvasWidth, canvasLength, gridLength } = this.props;
    if (this.grid) {
      await this.grid.setGridPositions(obj, i, free, type, canvasWidth, canvasLength, gridLength);
    }
  };

  update = async () => {
    let { user } = this.props;
    let bedroom = user.bedrooms[this.props.selectedBedroom];

    if (bedroom) {
      let { dimensions } = await bedroom;
      await this.findCanvasDimensions(dimensions);

      this.updateStatics();

      await this.Drawer.clearCanvas();

      await this.Drawer.drawGround();

      let { canvasWidth, canvasLength, gridLength, selectedBedroom, beds, objects } = this.props;

      this.grid = new Grid(canvasWidth, canvasLength, gridLength);

      await beds.map(async bed => {
        await this.Drawer.drawBedToGrid(bed, user.children[bed.child]);
        await this.setGridPositions(bed, beds.indexOf(bed), false, "bed");
      });

      await objects.map(async object => {
        await this.Drawer.drawObjectToGrid(object);
        await this.setGridPositions(object, objects.indexOf(object), false, "object");
      });

      await this.Drawer.drawBorder();

      await this.Doors.doorsMapping(this.props.user, selectedBedroom, this.Drawer);
    }
  };

  updateStatics = async () => {
    let { canvasWidth, canvasLength, gridLength, updateAppState } = this.props;
    let { grid, setGridPositions, Doors, Beds, Objects } = this;

    this.Drawer = new Drawer(this.ctx, gridLength, canvasWidth, canvasLength);

    Doors.update(updateAppState, setGridPositions, canvasWidth, canvasLength, gridLength, grid);
    Beds.update(updateAppState, setGridPositions, canvasWidth, canvasLength, gridLength, grid);
    Objects.update(updateAppState, setGridPositions, canvasWidth, canvasLength, gridLength, grid);

    [this.Doors, this.Beds] = [Doors, Beds];
  };

  //EVENTS
  click = async e => {
    if (this.isInCanvas()) {
      switch (this.props.editState) {
        case "removeBeds":
          await this.clickRemoveBeds();
          break;
        case "editBeds":
          await this.clickEditBeds();
          break;
        case "addChildren":
          await this.clickAddChildren();
          break;
        case "removeChildren":
          await this.clickRemoveChildren();
          break;
        case "addDoor":
          await this.clickAddDoor();
          break;
        case "removeDoor":
          await this.clickRemoveDoor();
          break;
        case "addObject":
          await this.clickAddObject();
          break;
        case "removeObject":
          await this.clickRemoveObject();
          break;
        default:
          break;
      }
    }

    this.update();
  };

  clickRemoveBeds = async () => {
    let index = await this.grid.findBedBasedOnGridPosition(this.gridPos);
    let { beds, user, selectedBedroom } = this.props;
    if (index > -1) {
      this.Beds.removeBedFromBeds(index, beds, user.children, user, selectedBedroom);
    }
  };

  clickEditBeds = async () => {
    if (this.props.newBed) {
      let { gridWidth, gridLength, isBunkbed } = this.props.newBed;
      let { user, beds, selectedBedroom, newBed } = this.props;
      let tempBed = await this.Beds.createBedBasedOnMousePos(this.gridPos, isBunkbed, newBed);
      let { x, y } = tempBed;

      if (await this.Beds.isAddingBedAllowed(tempBed)) {
        let bedArr = [tempBed];
        if (tempBed.isBunkbed) {
          bedArr = [
            new Bed(x, y, gridWidth, gridLength / 2, -1, false, "▲"),
            new Bed(x, y + gridLength / 2, gridWidth, gridLength / 2, -1, false, "▼")
          ];
        }
        await this.Beds.addBedToBeds(bedArr, user, beds, selectedBedroom);
      }
    }
  };

  clickAddChildren = async () => {
    if (this.props.selectedChild > -1) {
      let bedIndex = await this.grid.findBedBasedOnGridPosition(this.gridPos);

      if (bedIndex > -1 && this.props.beds[bedIndex].child === -1) {
        if (!this.props.user.children[this.props.selectedChild].inBed) {
          let [beds, children, user] = [this.props.beds, this.props.user.children, this.props.user];
          children[this.props.selectedChild].inBed = true;
          beds[bedIndex].child = this.props.selectedChild;
          user.bedrooms[this.props.selectedBedroom].beds = beds;
          user.children = children;
          await this.props.updateAppState("user", user);
        }
      }
    }
  };

  clickRemoveChildren = async () => {
    let bedIndex = await this.grid.findBedBasedOnGridPosition(this.gridPos);
    if (bedIndex > -1 && this.props.beds[bedIndex].child > -1) {
      let [beds, children, user] = [this.props.beds, this.props.user.children, this.props.user];

      children[beds[bedIndex].child].inBed = false;
      beds[bedIndex].child = -1;
      user.bedrooms[this.props.selectedBedroom].beds = beds;
      user.children = children;
      await this.props.updateAppState("user", user);
    }
  };

  clickAddDoor = async () => {
    if (this.props.newDoor) {
      let { selectedBedroom, user, updateAppState } = this.props;
      let newDoor = new Door(this.gridPos.x, this.gridPos.y, this.props.newDoor.gridLength);

      if (await this.Doors.isAddingDoorAllowed(newDoor)) {
        newDoor.direction = this.Doors.doorIsHorizontal(newDoor) ? "horizontal" : "vertical";

        await this.Drawer.drawDoorToGrid(newDoor);
        await this.Doors.addDoorToBedroom(newDoor, selectedBedroom, user, updateAppState);
      }
    }
  };

  clickRemoveDoor = async () => {
    let dIndex = await this.grid.findDoorBasedOnGridPosition(this.gridPos);
    if (dIndex > -1) {
      this.Doors.removeDoorFromDoors(
        dIndex,
        this.props.selectedBedroom,
        this.props.user.bedrooms[this.props.selectedBedroom].doors,
        this.props.user
      );
    }
  };

  clickAddObject = async () => {
    if (this.props.newObject) {
      let { user, selectedBedroom, newObject, objects } = this.props;
      let tempObject = await this.Objects.createObjectBasedOnMousePos(this.gridPos, newObject);

      if (await this.Objects.isAddingObjectAllowed(tempObject)) {
        await this.Objects.addObjectToObjects(tempObject, user, objects, selectedBedroom);
      }
    }
  };

  clickRemoveObject = async () => {
    let index = await this.grid.findObjectBasedOnGridPosition(this.gridPos);
    let { objects, user, selectedBedroom } = this.props;
    if (index > -1) {
      this.Objects.removeObjectFromObject(index, objects, user, selectedBedroom);
    }
  };

  updateWindowDimensions = async () => {
    await this.update();
  };

  updateMouseMove = async e => {
    let mousePos = this.props.getMousePos(e);
    this.gridPos = this.props.getGridPos(mousePos);

    await this.update();

    if (!this.isOutSideOfGrid()) {
      let { Drawer, Doors, Beds, Objects, gridPos } = this;

      switch (true) {
        case this.props.newBed !== null:
          let { isBunkbed } = this.props.newBed;
          let newBed = Beds.createBedBasedOnMousePos(gridPos, isBunkbed, this.props.newBed);

          if (await Beds.isAddingBedAllowed(newBed)) {
            await Drawer.drawBedToGrid(newBed, -1);
          }
          break;
        case this.props.newDoor !== null:
          let { gridLength } = this.props.newDoor;
          let newDoor = new Door(gridPos.x, gridPos.y, gridLength);

          if (await Doors.isAddingDoorAllowed(newDoor)) {
            let horizontal = Doors.doorIsHorizontal(newDoor);
            newDoor.direction = horizontal ? "horizontal" : "vertical";
            await Drawer.drawDoorToGrid(newDoor);
          }
          break;
        case this.props.newObject !== null:
          let [gw, gl] = [this.props.newObject.gridWidth, this.props.newObject.gridLength];
          let newObject = new CObject(gridPos.x, gridPos.y, gw, gl);

          if (await Objects.isAddingObjectAllowed(newObject)) {
            await Drawer.drawObjectToGrid(newObject);
          }
          break;
        default:
          break;
      }
    }
  };
}

export default Canvas;

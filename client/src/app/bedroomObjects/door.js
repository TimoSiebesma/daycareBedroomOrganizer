import Bed from "./bed";

export default class Door {
  constructor(x, y, length, direction) {
    this.x = x;
    this.y = y;
    this.gridLength = length;
    this.direction = direction;
  }

  update = (updateAppState, setGridPositions, canvasWidth, canvasLength, gridLength, grid) => {
    this.updateAppState = updateAppState;
    this.setGridPositions = setGridPositions;
    this.canvasWidth = canvasWidth;
    this.canvasLength = canvasLength;
    this.gridLength = gridLength;
    this.grid = grid;
  };

  addDoorToBedroom = async (door, selectedBedroom, user) => {
    let bedroom = await user.bedrooms[selectedBedroom];
    let doors = bedroom.doors;
    let u = user;
    doors.push(door);
    bedroom.doors = doors;
    u.bedrooms[selectedBedroom] = bedroom;
    await this.updateAppState("user", u);
  };

  doorIsVertical = door =>
    door.x === 0 || door.x === Math.ceil(this.canvasWidth / this.gridLength) - 1;

  doorIsHorizontal = door =>
    door.y === 0 || door.y === Math.ceil(this.canvasLength / this.gridLength) - 1;

  doorsMapping = async (user, selectedBedroom, drawer) => {
    if (await user.bedrooms[selectedBedroom]) {
      let { gridLength, canvasWidth, canvasLength } = this;

      await user.bedrooms[selectedBedroom].doors.map(async door => {
        await drawer.drawDoorToGrid(door, gridLength, canvasWidth, canvasLength);

        let doorObject =
          door.direction === "horizontal"
            ? new Bed(door.x, door.y, door.gridLength, 2)
            : new Bed(door.x, door.y, 2, door.gridLength);

        if (door.direction === "vertical" && door.x !== 0) {
          doorObject.x -= 1;
        } else if (door.direction === "horizontal" && door.y !== 0) {
          doorObject.y -= 1;
        }

        let index = user.bedrooms[selectedBedroom].doors.indexOf(door);
        await this.setGridPositions(doorObject, index, false, "door");
      });
    }
  };

  isAddingDoorAllowed = async door => {
    let vertical = this.doorIsVertical(door);
    let horizontal = this.doorIsHorizontal(door);
    let { canvasWidth, canvasLength, gridLength } = this;
    let [edgeL, edgeW] = [
      Math.ceil(canvasLength / gridLength),
      Math.ceil(canvasWidth / gridLength)
    ];

    console.log(horizontal);
    switch (true) {
      case (!horizontal && !vertical) || (horizontal && vertical):
        return false;
      case vertical && door.y + door.gridLength >= Math.ceil(canvasLength / gridLength):
        return false;
      case horizontal && door.x + door.gridLength >= Math.ceil(canvasWidth / gridLength):
        return false;
      case vertical === true:
        let i = door.x;
        for (let u = door.y; u < Math.min(door.y + door.gridLength, edgeL); u++) {
          if (this.grid.gridPositions[i][u].free === false) {
            return false;
          }
        }
        return true;
      case horizontal === true:
        let u = door.y;

        for (let i = door.x; i < Math.min(door.x + door.gridLength, edgeW); i++) {
          if (this.grid.gridPositions[i][u].free === false) {
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  removeDoorFromDoors = async (index, selectedBedroom, doors, user) => {
    await this.setGridPositions(doors[index], -1, true, "door");
    let d = doors.filter(door => doors.indexOf(door) !== index);
    let u = user;

    u.bedrooms[selectedBedroom].doors = d;
    await this.updateAppState("user", u);
  };
}

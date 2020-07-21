export default class Bed {
  constructor(x, y, width, length, child, bunkbed, bunkbedPosition, loaded) {
    this.x = x;
    this.y = y;
    this.gridWidth = width;
    this.gridLength = length;
    this.child = child;
    this.isBunkbed = bunkbed;
    this.bunkbedPosition = bunkbedPosition;
    this.loaded = loaded;
  }

  update = (updateAppState, setGridPositions, canvasWidth, canvasLength, gridLength, grid) => {
    this.updateAppState = updateAppState;
    this.setGridPositions = setGridPositions;
    this.canvasWidth = canvasWidth;
    this.canvasLength = canvasLength;
    this.gridLength = gridLength;
    this.grid = grid;
  };

  addBedToBeds = async (propbeds, user, beds, selectedBedroom) => {
    propbeds.map(bed => beds.push(bed));

    user.bedrooms[selectedBedroom].beds = beds;

    await this.updateAppState("user", user);
  };

  createBedBasedOnMousePos = (gridPos, isBunkbed, bed) =>
    new Bed(gridPos.x, gridPos.y, bed.gridWidth, bed.gridLength, -1, isBunkbed);

  isAddingBedAllowed = async bed => {
    switch (true) {
      case bed.x + bed.gridWidth > Math.ceil(this.canvasWidth / this.gridLength):
        return false;
      case bed.y + bed.gridLength > Math.ceil(this.canvasLength / this.gridLength):
        return false;
      default:
        for (let i = bed.x; i < bed.x + bed.gridWidth; i++) {
          for (let u = bed.y; u < bed.y + bed.gridLength; u++) {
            if (this.grid.gridPositions[i][u].free === false) {
              return false;
            }
          }
        }
        return true;
    }
  };

  removeBedFromBeds = async (index, beds, children, user, selectedBedroom) => {
    this.setGridPositions(beds[index], -1, true, "bed");

    if (beds[index].child > -1) {
      children[beds[index].child].inBed = false;
    }

    beds = beds.filter(bed => beds.indexOf(bed) !== index);
    user.bedrooms[selectedBedroom].beds = beds;
    user.children = children;

    await this.updateAppState("user", user);
  };
}

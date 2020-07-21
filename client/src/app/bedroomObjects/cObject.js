export default class CObject {
  constructor(x, y, gridWidth, gridLength) {
    this.x = x;
    this.y = y;
    this.gridWidth = gridWidth;
    this.gridLength = gridLength;
  }

  update = (updateAppState, setGridPositions, canvasWidth, canvasLength, gridLength, grid) => {
    this.updateAppState = updateAppState;
    this.setGridPositions = setGridPositions;
    this.canvasWidth = canvasWidth;
    this.canvasLength = canvasLength;
    this.gridLength = gridLength;
    this.grid = grid;
  };

  addObjectToObjects = async (obj, user, objects, selectedBedroom) => {
    objects.push(obj);

    user.bedrooms[selectedBedroom].objects = objects;

    await this.updateAppState("user", user);
  };

  createObjectBasedOnMousePos = (gridPos, obj) =>
    new CObject(gridPos.x, gridPos.y, obj.gridWidth, obj.gridLength);

  isAddingObjectAllowed = async obj => {
    switch (true) {
      case obj.x + obj.gridWidth > Math.ceil(this.canvasWidth / this.gridLength):
        return false;
      case obj.y + obj.gridLength > Math.ceil(this.canvasLength / this.gridLength):
        return false;
      default:
        for (let i = obj.x; i < obj.x + obj.gridWidth; i++) {
          for (let u = obj.y; u < obj.y + obj.gridLength; u++) {
            if (this.grid.gridPositions[i][u].free === false) {
              return false;
            }
          }
        }
        return true;
    }
  };

  removeObjectFromObject = async (index, objects, user, selectedBedroom) => {
    this.setGridPositions(objects[index], -1, true, "bed");

    objects = objects.filter(bed => objects.indexOf(bed) !== index);
    user.bedrooms[selectedBedroom].objects = objects;

    await this.updateAppState("user", user);
  };
}

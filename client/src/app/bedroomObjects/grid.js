import GridPosition from "./gridposition";

export default class Grid {
  constructor(canvasWidth, canvasLength, gridLength, gridPositions) {
    this.canvasWidth = canvasWidth;
    this.canvasLength = canvasLength;
    this.gridLength = gridLength;

    if (!gridPositions) {
      let positions = [];

      for (let i = 0, x = 0; i < canvasWidth; i += gridLength, x++) {
        let row = [];
        for (let u = 0, y = 0; u < canvasLength; u += gridLength, y++) {
          row.push(new GridPosition(x, y, gridLength, true));
        }
        positions.push(row);
      }
      this.gridPositions = positions;
    }
  }

  findBedBasedOnGridPosition = async gridPos =>
    await this.gridPositions[Math.round(gridPos.x)][Math.round(gridPos.y)].bedIndex;

  findDoorBasedOnGridPosition = async gridPos =>
    await this.gridPositions[Math.round(gridPos.x)][Math.round(gridPos.y)].doorIndex;

  findObjectBasedOnGridPosition = async gridPos =>
    await this.gridPositions[Math.round(gridPos.x)][Math.round(gridPos.y)].objectIndex;

  setGridPositions = async (object, index, free, type, canvasWidth, canvasLength, gridLength) => {
    let { x, y } = object;
    let [oGridWidth, oGridLength, edgeL, edgeW] = [
      object.gridWidth,
      object.gridLength,
      Math.ceil(canvasLength / gridLength),
      Math.ceil(canvasWidth / gridLength)
    ];
    for (let i = Math.round(x); i < Math.min(Math.round(x) + oGridWidth, edgeW); i++) {
      for (let u = Math.round(y); u < Math.min(Math.round(y) + oGridLength, edgeL); u++) {
        this.gridPositions[Math.round(i)][Math.round(u)].free = free;

        if (type === "bed") {
          this.gridPositions[Math.round(i)][Math.round(u)].bedIndex = index;
        } else if (type === "door") {
          this.gridPositions[Math.round(i)][Math.round(u)].doorIndex = index;
        } else if (type === "object") {
          this.gridPositions[Math.round(i)][Math.round(u)].objectIndex = index;
        }
      }
    }
  };
}

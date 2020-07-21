export default class Drawer {
  constructor(ctx, gridLength, canvasWidth, canvasLength) {
    this.ctx = ctx;
    this.gridLength = gridLength;
    this.canvasWidth = canvasWidth;
    this.canvasLength = canvasLength;
  }

  clearCanvas = async () => {
    await this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasLength);
  };

  drawBedToGrid = async (bed, child) => {
    let { gridLength } = this;
    let beginPosition = {
      x: bed.x * gridLength,
      y: bed.y * gridLength
    };

    let [trueWidth, trueLength] = [bed.gridWidth * gridLength, bed.gridLength * gridLength];

    await this.fillBedWithColor(beginPosition, trueWidth, trueLength);

    await this.ctx.strokeRect(beginPosition.x, beginPosition.y, trueWidth, trueLength);

    [this.ctx.textAlign, this.ctx.textBaseline, this.ctx.font] = ["center", "middle", "20px Arial"];

    if (bed.child > -1) {
      this.drawChildName(child, trueWidth, trueLength, beginPosition);
    }

    if (bed.bunkbedPosition) {
      this.drawBunkBedArrows(bed, beginPosition, trueWidth, trueLength);
    }
  };

  drawObjectToGrid = async obj => {
    let { gridLength } = this;
    let beginPosition = {
      x: obj.x * gridLength,
      y: obj.y * gridLength
    };

    let [trueWidth, trueLength] = [obj.gridWidth * gridLength, obj.gridLength * gridLength];

    this.ctx.fillStyle = "gray";
    await this.ctx.fillRect(beginPosition.x, beginPosition.y, trueWidth, trueLength);

    this.ctx.fillStyle = "black";
    await this.ctx.strokeRect(beginPosition.x, beginPosition.y, trueWidth, trueLength);
  };

  drawBorder = async () => {
    await this.ctx.strokeRect(0 + 0.5, 0 + 0.5, this.canvasWidth - 1.5, this.canvasLength - 1.5);
  };

  drawDoorToGrid = async door => {
    let { gridLength } = this;
    let [vertical, horizontal] = [door.direction === "vertical", door.direction === "horizontal"];
    let [trueLength, trueWidth] = [0, 0];

    let beginPosition = {
      x: door.x * gridLength,
      y: door.y * gridLength
    };

    if (vertical) {
      [trueLength, trueWidth] = [door.gridLength * gridLength, 2 * gridLength];
    } else if (horizontal) {
      [trueWidth, trueLength] = [door.gridLength * gridLength, 2 * gridLength];
    }

    await this.clearSurfaceOfDoor(beginPosition, trueWidth, trueLength);

    this.drawDoor(beginPosition, vertical, door, horizontal, trueWidth, trueLength);
  };

  drawGround = async () => {
    this.ctx.fillStyle = "white";
    await this.ctx.fillRect(0 + 0.5, 0 + 0.5, this.canvasWidth - 1, this.canvasLength - 1);

    this.ctx.fillStyle = "black";
  };

  drawDoor(beginPosition, vertical, door, horizontal, trueWidth, trueLength) {
    this.ctx.beginPath();
    beginPosition.x -= vertical && door.x !== 0 ? this.gridLength : 0;
    beginPosition.y -= horizontal && door.y !== 0 ? this.gridLength : 0;

    // if (beginPosition.x + trueWidth > this.canvasWidth) {
    //   trueWidth -= this.canvasWidth - beginPosition.x + trueWidth;
    // }

    trueLength =
      beginPosition.y + trueLength > this.canvasLength
        ? this.canvasLength - beginPosition.y
        : trueLength;

    if (Math.abs(door.x - door.y) < this.canvasLength / this.gridLength / 2) {
      this.ctx.moveTo(beginPosition.x + trueWidth, beginPosition.y + trueLength);
      this.ctx.lineTo(beginPosition.x - 2.5, beginPosition.y);
    } else {
      this.ctx.moveTo(beginPosition.x + trueWidth, beginPosition.y);
      this.ctx.lineTo(beginPosition.x - 2.5, beginPosition.y + trueLength);
    }
    this.ctx.stroke();
  }

  async clearSurfaceOfDoor(beginPosition, trueWidth, trueLength) {
    this.ctx.fillStyle = "white";
    await this.ctx.fillRect(beginPosition.x, beginPosition.y, trueWidth, trueLength);
    this.ctx.fillStyle = "black";
  }

  async fillBedWithColor(beginPosition, trueWidth, trueLength) {
    this.ctx.fillStyle = "#b6c7d8";
    await this.ctx.fillRect(
      beginPosition.x + 1,
      beginPosition.y + 1,
      trueWidth - 1,
      trueLength - 1
    );
    this.ctx.fillStyle = "black";
  }

  drawBunkBedArrows(bed, beginPosition, trueWidth, trueLength) {
    this.ctx.font = "14px Arial";

    this.ctx.fillStyle = "black";
    if (bed.x < 40 / 2 - bed.gridWidth) {
      this.ctx.fillText(
        bed.bunkbedPosition,
        beginPosition.x + trueWidth,
        beginPosition.y + trueLength / 2
      );
    } else {
      this.ctx.fillText(bed.bunkbedPosition, beginPosition.x, beginPosition.y + trueLength / 2);
    }
  }

  drawChildName(child, trueWidth, trueLength, beginPosition) {
    let firstName = child.firstName;
    this.ctx.fillStyle = "black";
    if (trueWidth > trueLength) {
      this.ctx.fillText(
        firstName,
        beginPosition.x + trueWidth / 2,
        beginPosition.y + trueLength / 2
      );
    } else {
      let name = firstName.split(" ");
      name.forEach(n => {
        this.ctx.fillText(
          n.substring(0, 11),
          beginPosition.x + trueWidth / 2,
          beginPosition.y + trueLength / 2 + name.indexOf(n) * 18 - ((name.length - 1) / 2) * 18
        );
      });
    }
  }
}

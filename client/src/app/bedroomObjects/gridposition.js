export default class GridPosition {
  constructor(x, y, length, free) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.free = free;
    this.bedIndex = -1;
    this.doorIndex = -1;
  }
}

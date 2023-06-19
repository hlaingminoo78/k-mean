class Node {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.label = null;
    this.color = color;
  }

  // show circle
  show() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, DIAMETER);
  }

  // function to calculate euclidean distance
  getDistance(node) {
    return dist(this.x, this.y, node.x, node.y);
  }
}

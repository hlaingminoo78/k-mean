const WIDTH = 500;
const HEIGHT = 500;
const DIAMETER = 20;
const DEFAULTCOLOR = [0, 0, 0, 70];

let dataset = [];
let noOfKInput, startButton, resetButton;
let k;
let colors = ["#FF00FF", "#40E0D0", "#DFFF00", "#6495ED", "#DE3163"];
let centroids = [];
let centroids_old = [];
let errors = [];
let minx, maxx, miny, maxy;
let found;

function reset() {
  background(255);

  // reset all variables
  found = false;
  k = 0;
  dataset = [];
  minx = 99999;
  maxx = 0;
  miny = 99999;
  maxy = 0;
  noLoop();
}

function setup() {
  // create p5 canvas
  const canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvas_container");

  // select input elements
  noOfKInput = select("#noOfKInput");
  startButton = select("#startButton");
  resetButton = select("#resetButton");

  // show default k value
  select("#noOfK").html(noOfKInput.value());

  reset();

  // event handling
  canvas.mousePressed(addNewNode);
  resetButton.mousePressed(reset);
  startButton.mousePressed(start);
  noOfKInput.changed(() => select("#noOfK").html(noOfKInput.value()));

  noLoop();
}

function draw() {
  background(255);

  // show data points
  for (const node of dataset) node.show();

  // show centroids
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < centroids.length; i++) {
    let current = centroids[i];
    line(current.x - 10, current.y - 10, current.x + 10, current.y + 10);
    line(current.x + 10, current.y - 10, current.x - 10, current.y + 10);
  }

  // if there is no errors between old centroids and new centroids, then stop
  if (errors.length > 0 && errors.every((err) => err === 0)) {
    console.log(centroids);
    found = true;
    noLoop();
    return;
  }

  // assign samples to nearest centroid
  for (let i = 0; i < dataset.length; i++) {
    // calculate distance with one point and each centroids
    let distances = new Array(k).fill(0);
    for (let j = 0; j < k; j++) {
      distances[j] = dataset[i].getDistance(centroids[j]);
    }
    // assign label to nearest centroids
    let label = distances.indexOf(min(distances));

    dataset[i].label = label;

    // update nodes color based on their current clusters
    dataset[i].color = colors[label];
  }

  // copy old centroids
  centroids_old = [...centroids];

  // calculate the average position of each clusters
  for (let i = 0; i < k; i++) {
    let total_x = 0;
    let total_y = 0;
    let count = 0;
    for (let j = 0; j < dataset.length; j++) {
      if (dataset[j].label === i) {
        total_x += dataset[j].x;
        total_y += dataset[j].y;
        count++;
      }
    }
    // update centroids
    // if (count === 0) count++;
    if (count === 0) {
      centroids[i] = {
        x: random(minx, maxx),
        y: random(miny, maxy),
      };
    } else {
      centroids[i] = {
        x: total_x / count,
        y: total_y / count,
      };
    }
  }

  // calculate errors (old_centroids vs new centroids)
  for (let i = 0; i < k; i++) {
    errors[i] = dist(
      centroids[i].x,
      centroids[i].y,
      centroids_old[i].x,
      centroids_old[i].y
    );
  }
}

function addNewNode() {
  // populate dataset
  let newNode = new Node(mouseX, mouseY, DEFAULTCOLOR);

  // show node on canvas
  newNode.show();

  // calculate min and max of x,y
  if (newNode.x < minx) minx = newNode.x;
  if (newNode.x > maxx) maxx = newNode.x;
  if (newNode.y < miny) miny = newNode.y;
  if (newNode.y > maxy) maxy = newNode.y;

  dataset.push(newNode);
}

function start() {
  if (found) {
    alert("Already Found! Please reset");
    return;
  }

  if (dataset.length === 0) {
    alert("Please add nodes to the canvas");
    return;
  }

  // get k value from user input
  k = noOfKInput.value();

  // initialize centroids and errors
  centroids = new Array(k);
  centroids_old = new Array(k);
  errors = new Array(k).fill(1);

  // place K random centroids
  for (let i = 0; i < k; i++) {
    centroids[i] = {
      x: random(minx, maxx),
      y: random(miny, maxy),
    };
    centroids_old[i] = { x: 0, y: 0 };
  }

  loop();
}

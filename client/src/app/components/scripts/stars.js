// "undefined" === typeof _trfq || (window._trfq = []);
// "undefined" === typeof _trfd && (window._trfd = []),
//   _trfd.push({ "tccl.baseHost": "$BASEHOST" }),
//   _trfd.push({ ap: "$AP" }, { server: "$HOSTNAME" }, { id: "$ID" });
// // Monitoring performance to make your website faster. If you want to opt-out, please contact web hosting support.
("use strict");
function randRange(min, max) {
  return Math.random() * (max - min) + min;
}
function mapRange(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}
function distance(dot1, dot2) {
  let [x1, y1, x2, y2] = [dot1[0], dot1[1], dot2[0], dot2[1]];
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
function limitToCircle(x, y, a, b, r) {
  let dist = distance([x, y], [a, b]);
  if (dist <= r) {
    return [x, y];
  } else {
    x = x - a;
    y = y - b;
    let radians = Math.atan2(y, x);
    return [Math.cos(radians) * r + a, Math.sin(radians) * r + b];
  }
}
function isInEllipse(mouseX, mouseY, ellipseX, ellipseY, ellipseW, ellipseH) {
  let dx = mouseX - ellipseX;
  var dy = mouseY - ellipseY;
  return (
    (dx * dx) / (ellipseW * ellipseW) + (dy * dy) / (ellipseH * ellipseH) <= 1
  );
}
const IS_HIGH_RES = window.matchMedia(`
    (-webkit-min-device-pixel-ratio: 2),
    (min--moz-device-pixel-ratio: 2),
    (-moz-min-device-pixel-ratio: 2),
    (-o-min-device-pixel-ratio: 2/1),
    (min-device-pixel-ratio: 2),
    (min-resolution: 192dpi),
    (min-resolution: 2dppx)
  `);
const IS_MOBILE =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const IS_HIGH_RES_AND_MOBILE = IS_HIGH_RES.matches && IS_MOBILE;
class Star {
  constructor(container) {
    let [size, depth] = container;
    this.FORWARD_SPEED = 500;
    this.SIDEWAYS_SPEED = 100;
    if (IS_HIGH_RES_AND_MOBILE) {
      this.FORWARD_SPEED *= 2;
      this.SIDEWAYS_SPEED *= 2;
    }
    this.container = container;
    this.x = randRange(-size, size);
    this.y = randRange(-size, size);
    this.z = randRange(0, depth);
    this.px = this.x;
    this.py = this.y;
    this.pz = this.z;
    this.color = `rgb(${randRange(110, 200)},${randRange(110, 240)},${randRange(
      230,
      255
    )})`;
  }
  resetX() {
    let [size, _] = this.container;
    this.x = randRange(-size, size);
    this.px = this.x;
  }
  resetY() {
    let [size, _] = this.container;
    this.y = randRange(-size, size);
    this.py = this.y;
  }
  resetZ() {
    let [_, depth] = this.container;
    this.z = randRange(0, depth);
    this.pz = this.z;
  }
  update(deltaTime, container, xSpeed, zSpeed) {
    this.container = container;
    let [size, depth] = container;
    let sizeAndAQuarter = size + size / 4;
    let depthMinusAQuarter = depth - depth / 4;
    let defaultSpeed = this.FORWARD_SPEED;
    let defaultSideSpeed = this.SIDEWAYS_SPEED;
    if (zSpeed > 0) {
      let slowBy = mapRange(this.z, 0, depth, 1, 0.01);
      defaultSpeed *= slowBy;
    } else if (zSpeed < 0) {
      let slowBy = mapRange(this.z, 0, depth, 1, 0.1);
      defaultSpeed *= slowBy;
    }
    if (Math.abs(xSpeed) > 0) {
      let slowBy = mapRange(this.z, 0, size, 0.3, 0.4);
      defaultSideSpeed *= slowBy;
    }
    this.z -= defaultSpeed * zSpeed * deltaTime;
    this.x -= defaultSideSpeed * xSpeed * deltaTime;
    let fuzzyDepth = randRange(depth, depthMinusAQuarter);
    let fuzzySize = randRange(size, sizeAndAQuarter);
    if (this.z < 1) {
      this.z = fuzzyDepth;
      this.pz = this.z;
      this.resetX();
      this.resetY();
    } else if (this.z > depth) {
      this.z = 0;
      this.pz = this.z;
      this.resetX();
      this.resetY();
    } else if (this.x < -fuzzySize) {
      this.x = size;
      this.px = this.x;
      this.resetY();
      this.resetZ();
    } else if (this.x > fuzzySize) {
      this.x = -size;
      this.px = this.x;
      this.resetY();
      this.resetZ();
    } else if (this.y < -fuzzySize) {
      this.y = size;
      this.py = this.y;
      this.resetX();
      this.resetZ();
    } else if (this.y > fuzzySize) {
      // y positive
      this.y = -size;
      this.py = this.y;
      this.resetX();
      this.resetZ();
    }
  }
  draw(context, container, screen, mouseX, mouseY) {
    let [width, height] = screen;
    let [size, depth] = container;
    let sx = mapRange(this.x / this.z, 0, 1, 0, width);
    let sy = mapRange(this.y / this.z, 0, 1, 0, height);
    let px = mapRange(this.px / this.pz, 0, 1, 0, width);
    let py = mapRange(this.py / this.pz, 0, 1, 0, height);
    const maxRadius = IS_HIGH_RES.matches && IS_MOBILE ? 4 : 2;
    let radius = Math.min(
      Math.abs(mapRange(this.z, 0, depth, maxRadius, 0.01)),
      maxRadius
    );
    // star point
    context.beginPath();
    context.arc(sx, sy, radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    this.px = this.x;
    this.py = this.y;
    this.pz = this.z;
    // star trail
    context.beginPath();
    context.moveTo(px, py);
    context.lineTo(sx, sy);
    context.lineWidth = radius;
    context.strokeStyle = this.color;
    context.stroke();
  }
}
const getPointerInput = (callback, element = document, delay = 600) => {
  // use a noop if there's no callback, but like, there should be a callback lol
  callback =
    callback ||
    ((pointer) => {
      console.error(`PointerInput is missing a callback as the first argument`);
    });
  let pointer = {
    x: false,
    y: false,
    hasMoved: false,
    isMoving: false,
    wasMoving: false,
  };
  let timer = false;
  let animFrame = false;
  const handlePointer = (event) => {
    if (animFrame) {
      animFrame = window.cancelAnimationFrame(animFrame);
    }
    animFrame = window.requestAnimationFrame(() => {
      let x, y;
      if (event.touches) {
        [x, y] = [event.touches[0].clientX, event.touches[0].clientY];
      } else {
        [x, y] = [event.clientX, event.clientY];
      }
      pointer.x = x;
      pointer.y = y;
      if (!pointer.hasMoved) {
        pointer.hasMoved = true;
      }
      pointer.wasMoving = pointer.isMoving;
      pointer.isMoving = true;
      // send the current pointer data to it's consumers
      callback(pointer);
      // if timer already exists, clear it
      if (timer) {
        timer = clearTimeout(timer);
      }
      // start a new timer and store it
      timer = setTimeout(() => {
        // pointer is no longer moving
        pointer.wasMoving = pointer.isMoving;
        pointer.isMoving = false;
        // send the current pointer data to it's consumers again because we stopped moving
        callback(pointer);
      }, delay);
    });
  };
  // set up the handlers ^.^
  element.addEventListener("touchstart", (e) => handlePointer(e), true);
  element.addEventListener("touchmove", (e) => handlePointer(e), true);
  element.addEventListener("mousemove", (e) => handlePointer(e), true);
  return false;
};
class StarField {
  constructor(howManyStars, canvas, depth = 2, UIFadeDelay = 1) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.resizeTimer = false;
    this.isResizing = false;
    this.wasResizing = false;
    this.containerDepth = depth;
    this.setCanvasSize();
    this.howManyStars = howManyStars;
    this.stars = new Array(howManyStars);
    this.populateStarField();
    this.prevTime = 0;
    this.deltaTime = 0.1;
    this.xSpeed = 0;
    this.zSpeed = 1;
    this.mouseX = 0;
    this.mouseY = canvas.offsetHeight * 0.25 - 66;
    this.UIFadeDelay = UIFadeDelay;
    // this is where the pointer data affects the animation via xSpeed and zSpeed
    let handlePointer = (pointer) => {
      let [width, height] = this.screen;
      this.mouseX = pointer.x - width / 2;
      this.mouseY = pointer.y - height / 2;
      this.mouseMoved = pointer.hasMoved;
      this.mouseMoving = pointer.isMoving;
      this.zSpeed = mapRange(pointer.y, 0, height, 12, -4);
      this.xSpeed = mapRange(pointer.x, 0, width, -10, 10);
      if (Math.abs(this.xSpeed) > 2) {
        this.zSpeed /= Math.abs(this.xSpeed) / 2;
      }
      if (this.mouseY > 0) {
        this.zSpeed /= 2;
      }
    };
    // getPointerInput doesn't control the animation, just passes pointer data to the callback
    getPointerInput(handlePointer);
    this.mouseMoved = false;
    this.mouseMoving = false;
    this.mouseControlAlpha = 0.1;
    this.showMouseControls = true;
    this.pauseAnimation = false;
    // just the initial render, doesn't start the loop
    this.render();
    window.addEventListener("resize", () => this.handleResize(), true);
    // helps when you navigate away from the page for a while, prevents stars grouping up into one big wall
    // #fuckthewall lol
    window.addEventListener("beforeunload", () => this.rePopulateStarField());
    // not in use yet
    // document.addEventListener("deviceorientation", (e) => this.handleOrientation(e), true);
  }
  // where the magic happens
  startRenderLoop() {
    const renderLoop = (timestamp) => {
      timestamp *= 0.001; // convert to seconds
      this.deltaTime = timestamp - this.prevTime;
      this.prevTime = timestamp;
      if (!this.pauseAnimation) {
        this.clearCanvas();
        this.render();
      }
      window.requestAnimationFrame(renderLoop);
    };
    window.requestAnimationFrame(renderLoop);
  }
  pause() {
    this.pauseAnimation = true;
  }
  play() {
    this.pauseAnimation = false;
  }
  setCanvasSize() {
    // fit canvas to parent
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = window.innerHeight;
    let width = canvas.offsetWidth,
      height = canvas.offsetHeight,
      size = Math.max(width, height),
      depth = size * this.containerDepth,
      screen = [width, height],
      container = [size, depth];
    // set latest sizes
    this.container = container;
    this.screen = screen;
    // center
    this.context.translate(width / 2, height / 2);
  }
  populateStarField() {
    // fill an array with Star instances
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i] = new Star(this.container);
    }
  }
  emptyStarField() {
    this.stars = new Array(this.howManyStars);
  }
  rePopulateStarField() {
    this.emptyStarField();
    this.populateStarField();
    return null;
  }
  clearCanvas() {
    let [size, depth] = this.container;
    this.context.clearRect(-size / 2, -size / 2, size, size);
  }
  drawMouseControl() {
    let context = this.context;
    let [width, height] = this.screen;
    let ellipseX = 0,
      ellipseY = height * 0.25;
    let ellipseW = 50,
      ellipseH = 21;
    ellipseH *= mapRange(
      this.mouseY,
      -height / 2 + ellipseY,
      height / 2 + ellipseY,
      0.8,
      1.2
    );
    let pointIsInEllipse = isInEllipse(
      this.mouseX,
      this.mouseY,
      ellipseX,
      ellipseY,
      ellipseW,
      ellipseH
    );
    if (pointIsInEllipse) {
      this.xSpeed = 0;
      this.zSpeed = 0;
    }
    let xSpin = this.mouseX / width;
  }
  render() {
    if (this.showMouseControls) {
      if (!this.mouseMoved || this.mouseMoving) {
        // when mouse is moving, make controls visible instantly
        this.mouseControlAlpha = 0.3;
        this.drawMouseControl();
      } else {
        this.mouseControlAlpha -= (0.25 * this.deltaTime) / this.UIFadeDelay;
        this.drawMouseControl();
      }
    }
    // update and draw all the stars
    for (let i = 0; i < this.stars.length; i++) {
      if (!this.pauseAnimation) {
        this.stars[i].update(
          this.deltaTime,
          this.container,
          this.xSpeed,
          this.zSpeed
        );
      }
      this.stars[i].draw(
        this.context,
        this.container,
        this.screen,
        this.mouseX,
        this.mouseY
      );
    }
  }
  rePopOnResizeStop() {
    if (this.isResizing && !this.wasResizing) {
      // console.log('started');
    }
    if (!this.isResizing && this.wasResizing) {
      // console.log('stopped');
      this.rePopulateStarField();
    }
  }
  handleResize() {
    this.pause();
    // if a resizing timer exists already clear it out
    if (this.resizeTimer) {
      this.resizeTimer = clearTimeout(this.resizeTimer);
    }
    this.wasResizing = this.isResizing;
    if (!this.isResizing) {
      this.isResizing = true;
    }
    this.rePopOnResizeStop();
    if (this.pauseAnimation) {
      window.requestAnimationFrame(() => {
        this.setCanvasSize();
        this.render();
      });
    }
    this.resizeTimer = setTimeout(() => {
      this.wasResizing = this.isResizing;
      this.isResizing = false;
      this.rePopOnResizeStop();
      this.setCanvasSize();
      this.play();
    }, 200);
  }
  handleOrientation(event) {
    // TODO: uh, implement this lol
  }
}
function setup() {
  let canvas = document.getElementById("canvas");
  let howManyStars = 1500;
  if (IS_MOBILE) howManyStars = 500;
  let starfield = new StarField(howManyStars, canvas);
  starfield.startRenderLoop();
}
window.onload = setup();

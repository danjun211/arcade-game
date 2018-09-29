// Enemies our player must avoid
var Enemy = function(y, speed, id) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.id = id;
  this.x = -1 * Math.floor(Math.random() * 6 + 2) * 101;
  this.y = y;
  this.speed = speed;
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "images/enemy-bug.png";
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += dt * this.speed;
  
  // check whether this collide player
  if((player.x - 60 <= this.x  && this.x <= player.x + 60 ) 
        && (this.y - 10 <= player.y && player.y <= this.y + 10)) {
    player.reset();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player() {
  this.x = 202;
  this.y = 400;
  this.sprite = "images/char-boy.png";
}
Player.prototype.reset = function update() {
  this.x = 202;
  this.y = 400;
};
Player.prototype.update = function update() {};
Player.prototype.render = function render() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function handleInput(key) {
  switch (key) {
    case "left":
      if (this.x > 0) {
        this.x -= 101;
      }
      break;
    case "right":
      if (this.x < 404) {
        this.x += 101;
      }
      break;
    case "up":
      if (this.y >= 60) {
        this.y -= 83;
      }
      break;
    case "down":
      if (this.y < 400) {
        this.y += 83;
      }
      break;
    default:
      break;
  }
  // if player reach destination, change level and reset position of player.
  if(this.y < 0 && !GameInfo.isProcessing) {
    GameInfo.isProcessing = true;
    setTimeout(() => {
      this.reset()
      if(GameInfo.MAX_LEVEL > GameInfo.level) {
        GameInfo.level++;
        allEnemies = changeLevel(allEnemies, GameInfo.level);
      } else {
        alert("Clear!");
      }
      GameInfo.isProcessing = false;
      GameInfo.setLevelView();
    }, 100);
  }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

function createEnemies(num) {
  var array = [];
  var yPositions = [72, 155, 238]; // y points of enemies
  var levels = [200, 300, 400, 500, 600];

  // place enemies on the map depends on yPositions, and give them diffent speed.
  for(var i = 1; i <= num; i++) {
    array.push(new Enemy(yPositions[i % 3], levels[Math.floor((i - 1)/ 3)], i));
  }

  return array;
}

const modalSelectChar = document.querySelector(".select-char");
const shadow = document.querySelector(".shadow");
const characterList = document.querySelector(".character-list");
const btnStart = document.getElementById("btn-start");
const infoContainer = document.getElementById("info-container");
const h1LevelNum = infoContainer.querySelector(".num");

let allEnemies, player, enemiesIntervalId;

const GameInfo = {
  challenge: 0,
  fail: 0,
  level: 1,
  isProcessing: false,
  MAX_LEVEL: 5,

  setLevelView: function setLevelView() {
    h1LevelNum.textContent = this.level;
  }
};

// character select event
characterList.addEventListener("change", e => {
  if(e.target.classList.value === "rdo-player") {
    player.sprite = e.target.previousElementSibling.getAttribute("src");
  }
});

// change game level
function changeLevel(enemies, level) {

  enemies = createEnemies(level * 2); // set enemies depends on current level 

  return enemies;
}

// Game Start!
btnStart.addEventListener("click", (e) => {
  // Now instantiate your objects.
  // Place all enemy objects in an array called allEnemies
  // Place the player object in a variable called player

  // init player that you selected
  player = new Player();

  // init enemies
  allEnemies = changeLevel(allEnemies, GameInfo.level);  

  // Execute game engine
  engine = Engine(window);

  // hide intro modal
  modalSelectChar.classList.add("hide");
  shadow.classList.add("hide");
  // show canvas
  infoContainer.classList.remove("hide");
});

var engine;
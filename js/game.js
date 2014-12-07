(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

// FPS variables
var time = new Date().getTime();
var savedTime;
var difficultyTimer;
var mobSpawnTime;
var fpsCount = 0;
var fps = 0;
var showFPS = false;
var tileSize = 48;
var lastMutePress = false;
var gameOver = false;
var gamePaused = false;
var soundMuted = false;
var mainMenu = true;
var helpScreen = false;

var menu = false;

var lastESCPress = false;
var lastF2Press = false;

var healthAmount = 50;

var c = document.getElementById("game");
var ctx = c.getContext("2d");

var htmlTurrets;

var snowmenKilled = 0;
var mobSpawnRate = 1500;

// Button co-ords
var playButton = [(c.width / 2) / 2 - 100, 300],
helpButton = [(c.width / 2) / 2 - 100, 360],
muteAudioMainMenuButton = [(c.width / 2) / 2 - 100, 420],
mainMenuButton = [c.width / 2 - 100, c.height / 2 + 100],
muteAudioButton = [c.width / 2 - 100, c.height / 2 + 25],
backButton = [c.width - 220, c.height - 70];

var keys = [];
var mousePos = {
	x : 0,
	y : 0
}
// Init map
var map = 
[[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
var mapStartX = 2;
var mapStartY = 0;
var mapEndX = 4;
var mapEndY = 10;
// Init turrets array
var turrets = new Array(11);
for(var i = 0; i < turrets.length; i++) {
	turrets[i] = new Array(20);
}
var enemies = [];
var bullets = [];

// Init images
var images = {
	grass : new Image(), 
	snow : new Image(), 
	path : new Image(), 
	cannonTurret : new Image(),
	toxicTurret : new Image(),
	iceTurret : new Image(),
	magmaTurret : new Image(),
	evilSnowman : new Image(),
	regularBullet : new Image(),
	toxicBullet : new Image(),
	magmaBullet : new Image(),
	mainMenuBackground : new Image(),
	logo : new Image(),
	help : new Image(),
	playButton : new Image(),
	playButtonSelect : new Image(),
	helpButton : new Image(),
	helpButtonSelect : new Image(),
	backButton : new Image(),
	backButtonSelect : new Image(),
	mainMenuButton : new Image(),
	mainMenuButtonSelect : new Image(),
	muteAudioButton : new Image(),
	muteAudioButtonSelect : new Image(),
	snowball : new Image(),
	menu : new Image(),
	helpScreen : new Image(),
}

images.path.src = 'img/game/tiles/path.png';
images.snow.src = 'img/game/tiles/snow.png';
images.grass.src = 'img/game/tiles/grass.png';
images.cannonTurret.src = 'img/game/turrets/cannon-turret.png';
images.toxicTurret.src = 'img/game/turrets/toxic-turret.png';
images.iceTurret.src = 'img/game/turrets/ice-turret.png';
images.magmaTurret.src = 'img/game/turrets/magma-turret.png';
images.evilSnowman.src = 'img/game/mobs/evil-snowman.png';
images.regularBullet.src = 'img/game/bullets/regular-bullet.png';
images.toxicBullet.src = 'img/game/bullets/toxic-bullet.png';
images.magmaBullet.src = 'img/game/bullets/magma-bullet.png';
images.mainMenuBackground.src = 'img/menu/main-menu.png';
images.logo.src = 'img/menu/logo.png';
images.help.src = 'img/menu/help.png';
images.playButton.src = 'img/menu/play-button.png';
images.playButtonSelect.src = 'img/menu/play-button-selected.png';
images.helpButton.src = 'img/menu/help-button.png';
images.helpButtonSelect.src = 'img/menu/help-button-selected.png';
images.backButton.src = 'img/menu/back-button.png';
images.backButtonSelect.src = 'img/menu/back-button-selected.png';
images.mainMenuButton.src = 'img/menu/main-menu-button.png';
images.mainMenuButtonSelect.src = 'img/menu/main-menu-button-selected.png';
images.muteAudioButton.src = 'img/menu/mute-audio-button.png';
images.muteAudioButtonSelect.src = 'img/menu/mute-audio-button-selected.png';
images.snowball.src = 'img/menu/snowball.png';
images.menu.src = 'img/menu/menu.png';
images.helpScreen.src = 'img/menu/help-screen.png';

var sounds = {
	cannonTurretShoot : new Audio("sound/CannonTurretShoot.wav"),
	toxicTurretShoot : new Audio("sound/ToxicTurretShoot.wav"),
	magmaTurretShoot : new Audio("sound/MagmaTurretShoot.wav"),
	enemyHit : new Audio("sound/EnemyHit.wav"),
	enemyHit2 : new Audio("sound/EnemyHit2.wav"),
	enemyHit3 : new Audio("sound/EnemyHit3.wav"),
	theme : new Audio("sound/SnowmanInvasionTheme.mp3")
}

// Init player
var player = {
	health : 25,
	cash : 350
}

function newGame() {
	snowmenKilled = 0;
	menu = false;
	htmlTurrets.className = "";
	gameOver = false;
	gamePaused = false;
	time = new Date().getTime();
	difficultyTimer = new Date().getTime();
	mobSpawnTime = new Date().getTime();
	tileSize = 48;

	c = document.getElementById("game");
	ctx = c.getContext("2d");
	keys = [];
	mousePos;
	// Init map
	map = 
	[[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
	[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

	// Init turrets array
	turrets = new Array(11);
	for(var i = 0; i < turrets.length; i++) {
		turrets[i] = new Array(20);
	}	
	enemies = [];
	bullets = [];

	player = {
		health : 25,
		cash : 350
	}
}

function turret(type, fireRate, damage, radius) {
	this.x = 0,
	this.y = 0,
	this.type = type,
	this.fireRate = fireRate,
	this.damage = damage,
	this.radius = radius,
	this.rotation = 0,
	this.moveTime = new Date().getTime(),
	this.hasFired = false;
	this.update = function(x, y) {
		// To stop turret saving up shots and throwing out a burst
		if(new Date().getTime() > this.moveTime + (500 / this.fireRate)) {
			this.hasFired = false;
		}

		if(enemies.length != 0 && this.type != 2 && this.type != 3) {
			for(var e = 0; e < enemies.length; e++) {
				var r1 = this.radius;
				var r2 = 24;
				var bb = (x * tileSize + tileSize / 2) - (enemies[e].x + tileSize / 2);
				bb = bb * bb;
				var cc = (y * tileSize + tileSize / 2) - (enemies[e].y + tileSize / 2);
				cc = cc * cc;
				var d = Math.sqrt(bb + cc);
				if(r1 + r2 > d) {
					var angleRadians = Math.atan2(enemies[e].y - y * tileSize, enemies[e].x - x * tileSize);
					this.rotation = angleRadians * (180/Math.PI);
					if(this.hasFired == false) {
						bullets.push(new bullet(new Date().getTime(), type, damage, angleRadians, x * tileSize + tileSize / 2 - 4, y * tileSize + tileSize / 2 - 4, 100000));
						this.hasFired = true;
						this.moveTime = new Date().getTime();
/*						if(this.type == 0) {
							sounds.cannonTurretShoot.play();
						} else if(this.type == 1) {
							sounds.toxicTurretShoot.play();
						} else if(this.type == 3) {
							sounds.magmaTurretShoot.play();
						}*/
					} else {
						if(new Date().getTime() > this.moveTime + (500 / this.fireRate)) {
							this.moveTime += (500 / this.fireRate);
							bullets.push(new bullet(new Date().getTime(), type, damage, angleRadians, x * tileSize + tileSize / 2 - 4, y * tileSize + tileSize / 2 - 4, 100000));
/*							if(this.type == 0) {
								sounds.cannonTurretShoot.play();
							} else if(this.type == 1) {
								sounds.toxicTurretShoot.play();
							} else if(this.type == 3) {
								sounds.magmaTurretShoot.play();
							}*/
						}
					}
					break;
				}
			}
		}

		if(this.type == 2) {
			if(this.rotation < 360) {
				this.rotation += 1;
			} else {
				this.rotation = 0;
			}
			for(var e = 0; e < enemies.length; e++) {
				var r1 = this.radius;
				var r2 = 24;
				var bb = (x * tileSize + tileSize / 2) - (enemies[e].x + tileSize / 2);
				bb = bb * bb;
				var cc = (y * tileSize + tileSize / 2) - (enemies[e].y + tileSize / 2);
				cc = cc * cc;
				var d = Math.sqrt(bb + cc);
				if(r1 + r2 > d) {
					enemies[e].speed = 1;
					enemies[e].slowed = true;
				} else if(enemies[e].slowed == false) {
					enemies[e].speed = 2;
				}
			}
		} else if(this.type == 3) {
			for(var e = 0; e < enemies.length; e++) {
				var r1 = this.radius;
				var r2 = 24;
				var bb = (x * tileSize + tileSize / 2) - (enemies[e].x + tileSize / 2);
				bb = bb * bb;
				var cc = (y * tileSize + tileSize / 2) - (enemies[e].y + tileSize / 2);
				cc = cc * cc;
				var d = Math.sqrt(bb + cc);
				if(r1 + r2 > d) {
					var theAngle = Math.random() * 360;
					bullets.push(new bullet(new Date().getTime(), type, damage, theAngle, x * tileSize + tileSize / 2 - 4, y * tileSize + tileSize / 2 - 4, 10000));
					break;
				}
			}	
		}


	},
	this.render = function(x, y) {
		// Saves canvas
		ctx.save();
		// Moves origin point
		ctx.translate(x * tileSize, y * tileSize);
		ctx.translate(tileSize / 2, tileSize / 2);
		// Rotates around origin point
		ctx.rotate(this.rotation*Math.PI/180);
		if(this.type == 0) {
			ctx.drawImage(images.cannonTurret, -tileSize/2, -tileSize/2);
		} else if(this.type == 1) {
			ctx.drawImage(images.toxicTurret, -tileSize/2, -tileSize/2);
		} else if(this.type == 2) {
			ctx.drawImage(images.iceTurret, -tileSize/2, -tileSize/2);
		} else if(this.type == 3) {
			ctx.drawImage(images.magmaTurret, -tileSize/2, -tileSize/2);
		}
		// Restores canvas
		ctx.restore();
	},
	this.renderRadius = function(x, y) {
		if(mousePos.x >= x * tileSize && mousePos.x <= x * tileSize + tileSize && 
			mousePos.y >= y * tileSize && mousePos.y <= y * tileSize + tileSize) {
			ctx.beginPath();
			ctx.fillStyle = "rgba(118, 255, 255, .5)";
			ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, this.radius,0,2*Math.PI);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
	}
}

function enemy(arrayIndex, name, x, y, health) {
	this.arrayIndex = arrayIndex,
	this.name = name,
	this.x = x,
	this.y = y,
	this.speed = 2,
	this.tileX = 0,
	this.tileY = 0,
	this.rotation = 0,
	this.health = health,
	this.index = 0,
	this.slowed = false,
	this.lastDir = 0,
	this.dir = 0,
	this.update = function(x, y) {
		this.slowed = false;
		if(this.tileX == 0) {
			var graph = new Graph(map);
			var start = graph.grid[0][2];
			var end = graph.grid[10][4];
			result = astar.search(graph, start, end);
		}

		if(this.health <= 0) {
			player.cash += 5;
			enemies.splice(this, 1);
		}

		if(this.dir != this.lastDir) {
			if(this.dir == 0) {
				this.rotation = 0;
			} else if(this.dir == 1) {
				this.rotation = 3.14159266 * (180/Math.PI);
			} else if(this.dir == 2) {
				this.rotation = -1.57079633 * (180/Math.PI);
			} else if(this.dir == 3) {
				this.rotation = 1.57079633 * (180/Math.PI);
			}
		}
		this.lastDir = this.dir;
		for(var i = 0; i < this.speed; i++) {
			if(this.index < result.length - 1) {
				// THIS WORKS DO NOT REMOVE
				if(!(this.y == result[this.index+1]['x'] * tileSize)) {
					if(this.y <= result[this.index+1]['x'] * tileSize) {
						this.y+=0.5;
						this.dir = 0;
					} else {
						this.y-=0.5;
						this.dir = 1;	
					}
				} else if(!(this.x == result[this.index+1]['y'] * tileSize )){
					if(this.x <= result[this.index+1]['y'] * tileSize) {
						this.x+=0.5;
						this.dir = 2;
					} else {
						this.x-=0.5;
						this.dir = 3;	
					}
				} else if(this.x == result[this.index+1]['y'] * tileSize && this.y == result[this.index+1]['x'] * tileSize){
					this.index += 1;
				}

			} else {
				player.health -= 1;
				enemies.splice(this, 1);
				break;
			}
		}



		this.tileX = Math.floor(this.x / tileSize);
		this.tileY = Math.floor(this.y / tileSize);


	},
	this.render = function() {

		// Saves canvas
		ctx.save();
		// Moves origin point
		ctx.translate(this.x, this.y);
		ctx.translate(tileSize / 2, tileSize / 2);
		// Rotates around origin point
		ctx.rotate(this.rotation*Math.PI/180);
		ctx.drawImage(images.evilSnowman, -tileSize / 2, -tileSize / 2);
		// Restores canvas
		ctx.restore();

	}
}



function bullet(id, type, damage, angle, x, y, lifespan) {
	this.id = id,
	this.type = type;
	this.damage = damage;
	this.x = x,
	this.y = y,
	this.lifespan = lifespan,
	this.speed = 4,
	this.markedForDeletion = false;
	this.update = function() {
		if(this.lifespan <= 0) {
			this.markedForDeletion = true;
		}

		if((this.x <= 0 || this.x >= c.width) && (this.y <= 0 || this.y >= c.height)) {
			this.markedForDeletion = true;
		}

		for(var e = 0; e < enemies.length; e++) {
			var r1 = 8;
			var r2 = 24;
			var bb = (this.x + r1) - (enemies[e].x + r2);
			bb = bb * bb;
			var cc = (this.y + r1) - (enemies[e].y + r2);
			cc = cc * cc;
			var d = Math.sqrt(bb + cc);

			if(r1 + r2 > d) {
				if(soundMuted == false) {
					if(this.type == 0) {
						sounds.enemyHit.play();
					} else if(this.type == 1) {
						sounds.enemyHit2.play();
					} else if(this.type == 3) {
						sounds.enemyHit3.play();
					}
				}
				enemies[e].health -= damage;
				if(enemies[e].health <= 0) {
					player.cash += 10;
					enemies.splice(e, 1);
					snowmenKilled++;
				}
				this.markedForDeletion = true;
			}
		}

		this.x += Math.round(this.speed * Math.cos(angle));
		this.y += Math.round(this.speed * Math.sin(angle));	

		if(this.x <= 0 && this.y <= 0) {
			this.lifespan += this.x + this.y;
		} else if(this.x <= 0 && this.y >= 0) {
			this.lifespan += this.x;
			this.lifespan -= this.y;
		} else if(this.x >= 0 && this.y <= 0) {
			this.lifespan -= this.x;
			this.lifespan += this.y;
		} else {
			this.lifespan -= this.x + this.y;
		}	


	},
	this.render = function() {
		if(this.type == 0) {
			ctx.drawImage(images.regularBullet, this.x, this.y);
		} else if(this.type == 1) {
			ctx.drawImage(images.toxicBullet, this.x, this.y);
		} else if(this.type == 3) {
			ctx.drawImage(images.magmaBullet, this.x, this.y);
		}
	}
}

function snowball(x, y, speed) {
	this.x = x,
	this.y = y,
	this.speed = speed
}

var snowballs = [];
for(var s = 0; s < 1000; s++) {
	snowballs.push(new snowball((Math.random() * 960), -(Math.random() * 2000), Math.random() * 1 + 0.5));
}

function update() {
	fpsCount++;

	if(keys[113] == true && lastF2Press != keys[113]) {
		lastF2Press = keys[113];
		if(showFPS == true) {
			showFPS = false;
		} else {
			showFPS = true;
		}
	} else {
		lastF2Press = keys[113];
	}

	if(mainMenu == true) {
		htmlTurrets = document.getElementById("turrets");
		htmlTurrets.className = " hidden";
	} else {
		if(keys[27] == true && lastESCPress != keys[27]) {
			lastESCPress = keys[27];
			if(menu == false) {
				menu = true;
				gamePaused = true;
				savedTime = new Date().getTime();
			} else {
				var tempTime = new Date().getTime() - savedTime;
				difficultyTimer += tempTime;
				mobSpawnTime += tempTime;
				menu = false;
				gamePaused = false;
			}
		} else {
			lastESCPress = keys[27];
		}

		if(player.cash < 75) {
			var docTurret = document.getElementById("cannon-turret");
			docTurret.className = "turret red";
		} else {
			var docTurret = document.getElementById("cannon-turret");
			docTurret.className = "turret green";
		}

		if(player.cash < 200) {
			var docTurret = document.getElementById("toxic-turret");
			docTurret.className = "turret red";
		} else {
			var docTurret = document.getElementById("toxic-turret");
			docTurret.className = "turret green";
		}

		if(player.cash < 400) {
			var docTurret = document.getElementById("ice-turret");
			docTurret.className = "turret red";
		} else {
			var docTurret = document.getElementById("ice-turret");
			docTurret.className = "turret green";
		}

		if(player.cash < 450) {
			var docTurret = document.getElementById("magma-turret");
			docTurret.className = "turret red";
		} else {
			var docTurret = document.getElementById("magma-turret");
			docTurret.className = "turret green";
		}

		if(player.health <= 0) {
			menu = true;
			gameOver = true;
		}

		if(gamePaused == false && gameOver == false) {
			// update the bullets
			for(var b = 0; b < bullets.length; b++) {
				bullets[b].update();
				if(bullets[b].markedForDeletion == true) {
					bullets.splice(b, 1);
				}
			}

			// update the enemies
			for(var e = 0; e < enemies.length; e++) {
				enemies[e].update();
			}

			// update the allied turrets
			for(var y = 0; y < 11; y++) {
				for(var x = 0; x < 20; x++) {
					if(turrets[y][x] != null) {
						turrets[y][x].update(x, y);
					}
				}
			}
			// Changes the difficulty based on time
			if(new Date().getTime() > difficultyTimer + 20000) {
				difficultyTimer += 20000;
				healthAmount += 25;
			}

			// Mob spawn rate
			if(new Date().getTime() > mobSpawnTime + mobSpawnRate) {
				mobSpawnTime += mobSpawnRate;
				enemies.push(new enemy(enemies.length, "Evil Snowman", 2 * tileSize, 0 * tileSize, healthAmount));
			}
		}

	}

	render();

	if(new Date().getTime() > time + 1000) {
		time += 1000;
		fps = fpsCount;
		fpsCount = 0;
	}

	requestAnimationFrame(update);
	
}

function render() {

	if(mainMenu == true) {
		ctx.drawImage(images.mainMenuBackground, 0, 0);
		for(var s = 0; s < snowballs.length; s++) {
			snowballs[s].y += 3 * snowballs[s].speed;
			if(snowballs[s].y >= 1000) {
				snowballs[s].y = -(Math.random() * 2000);
			}
			ctx.drawImage(images.snowball, snowballs[s].x, snowballs[s].y);
		}

		if(helpScreen == true) {			
			ctx.drawImage(images.helpScreen, (c.width - 940) / 2, (c.height - 509) / 2);

			// Back Button
			if(mousePos.x >= backButton[0] && mousePos.x <= backButton[0] + 200) {
				if(mousePos.y >= backButton[1] && mousePos.y <= backButton[1] + 50) {
					ctx.drawImage(images.backButtonSelect, backButton[0], backButton[1]);
				} else {
					ctx.drawImage(images.backButton, backButton[0], backButton[1]);
				}
			} else {
				ctx.drawImage(images.backButton, backButton[0], backButton[1]);
			}
		} else {
			ctx.drawImage(images.logo, (c.width / 2) / 2 - 200, 0);

			// Play Button
			if(mousePos.x >= playButton[0] && mousePos.x <= playButton[0] + 200) {
				if(mousePos.y >= playButton[1] && mousePos.y <= playButton[1] + 50) {
					ctx.drawImage(images.playButtonSelect, playButton[0], playButton[1]);
				} else {
					ctx.drawImage(images.playButton, playButton[0], playButton[1]);
				}
			} else {
				ctx.drawImage(images.playButton, playButton[0], playButton[1]);
			}
			// Help Button
			if(mousePos.x >= helpButton[0] && mousePos.x <= helpButton[0] + 200) {
				if(mousePos.y >= helpButton[1] && mousePos.y <= helpButton[1] + 50) {
				ctx.drawImage(images.helpButtonSelect, helpButton[0], helpButton[1]);
				} else {
					ctx.drawImage(images.helpButton, helpButton[0], helpButton[1]);
				}
			} else {
				ctx.drawImage(images.helpButton, helpButton[0], helpButton[1]);
			}

			// Mute Audio
			if(mousePos.x >= muteAudioMainMenuButton[0] && mousePos.x <= muteAudioMainMenuButton[0] + 200) {
				if(mousePos.y >= muteAudioMainMenuButton[1] && mousePos.y <= muteAudioMainMenuButton[1] + 50) {
					ctx.drawImage(images.muteAudioButtonSelect, muteAudioMainMenuButton[0], muteAudioMainMenuButton[1]);
				} else {
					ctx.drawImage(images.muteAudioButton, muteAudioMainMenuButton[0], muteAudioMainMenuButton[1]);
				}
			} else {
				ctx.drawImage(images.muteAudioButton, muteAudioMainMenuButton[0], muteAudioMainMenuButton[1]);
			}
		}

	} else {
		// Draw the map (background)
		for(var y = 0; y < 11; y++) {
			for(var x = 0; x < 20; x++) {
				if(map[y][x] == 0) {
					ctx.drawImage(images.grass, x * tileSize, y * tileSize);
				} else if(map[y][x] == 1) {
					ctx.drawImage(images.snow, x * tileSize, y * tileSize);
				}
			}
		}

		// Draw the bullets
		for(var b = 0; b < bullets.length; b++) {
			bullets[b].render();
		}

		// Draw the enemies
		for(var e = 0; e < enemies.length; e++) {
			enemies[e].render();
		}

		// Draw turret textures
		for(var y = 0; y < 11; y++) {
			for(var x = 0; x < 20; x++) {
				if(turrets[y][x] != null) {
					turrets[y][x].render(x, y);
				}
			}
		}

		// Render radius hover effect
		for(var y = 0; y < 11; y++) {
			for(var x = 0; x < 20; x++) {
				if(turrets[y][x] != null) {
					turrets[y][x].renderRadius(x, y);
				}
			}
		}

		ctx.fillStyle = "white";
		ctx.font = "bold 16px Arial";
		// Game text
		ctx.fillText("Health: " + player.health, c.width - 110, 25);
		ctx.fillText("Cash: " + player.cash, c.width - 110, 50);
		if(menu == true) {
			ctx.drawImage(images.menu, c.width / 2 - 150, c.height / 2 - 200);
			// Main Menu Button
			if(mousePos.x >= mainMenuButton[0] && mousePos.x <= mainMenuButton[0] + 200) {
				if(mousePos.y >= mainMenuButton[1] && mousePos.y <= mainMenuButton[1] + 50) {
					ctx.drawImage(images.mainMenuButtonSelect, mainMenuButton[0], mainMenuButton[1]);
				} else {
					ctx.drawImage(images.mainMenuButton, mainMenuButton[0], mainMenuButton[1]);
				}
			} else {
				ctx.drawImage(images.mainMenuButton, mainMenuButton[0], mainMenuButton[1]);
			}

			// Mute Audio
			if(mousePos.x >= muteAudioButton[0] && mousePos.x <= muteAudioButton[0] + 200) {
				if(mousePos.y >= muteAudioButton[1] && mousePos.y <= muteAudioButton[1] + 50) {
					ctx.drawImage(images.muteAudioButtonSelect, muteAudioButton[0], muteAudioButton[1]);
				} else {
					ctx.drawImage(images.muteAudioButton, muteAudioButton[0], muteAudioButton[1]);
				}
			} else {
				ctx.drawImage(images.muteAudioButton, muteAudioButton[0], muteAudioButton[1]);
			}
		}

		if(gamePaused == true) {
			ctx.fillStyle = "white";
			ctx.font = "bold 25px Arial";
			// Game text
			ctx.fillText("Game Paused", c.width / 2 - 82, c.height / 2 - 100);	
		} else if(gameOver == true) {
			ctx.fillStyle = "white";
			ctx.font = "bold 25px Arial";
			// Game text
			ctx.fillText("Game Over", c.width / 2 - 70, c.height / 2 - 100);	
			ctx.fillText("Snowmen Killed:", c.width / 2 - 103, c.height / 2 - 40);	
			var theLength = snowmenKilled.toString().length;
			ctx.fillText(snowmenKilled, c.width / 2 - theLength * 7, c.height / 2 - 10);	
		}
	}

	if(showFPS == true) {
		// FPS counter
		ctx.fillStyle = "#00f6ff";
		ctx.font = "bold 16px Arial";
		ctx.fillText("FPS: " + fps, 25, 25);
	}

}

function audioFilter() {
	lastMutePress = true;
	if(soundMuted == true) {
		soundMuted = false;
		sounds.theme.volume = 1;
		sounds.cannonTurretShoot.volume = 1;
		sounds.toxicTurretShoot.volume = 1;
		sounds.magmaTurretShoot.volume = 1;
		sounds.enemyHit.volume = 1;
		sounds.enemyHit2.volume = 1;
		sounds.enemyHit3.volume = 1;
	} else {
		soundMuted = true;
		sounds.theme.volume = 0;
		sounds.cannonTurretShoot.volume = 0;
		sounds.toxicTurretShoot.volume = 0;
		sounds.magmaTurretShoot.volume = 0;
		sounds.enemyHit.volume = 0;
		sounds.enemyHit2.volume = 0;
		sounds.enemyHit3.volume = 0;
	}
}

// Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
       	y: evt.clientY - rect.top
    };
}

// Saves mouse position to variable
c.addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(c, evt);
}, false);

// Checks for mouse click
c.addEventListener("mousedown", function(evt) {
	lastMutePress = false;
	if(mainMenu == true) {
		// Play Button
		if(mousePos.x >= playButton[0] && mousePos.x <= playButton[0] + 200) {
			if(mousePos.y >= playButton[1] && mousePos.y <= playButton[1] + 50) {
				mainMenu = false;
				newGame();
			}
		}
		// Help Button
		if(mousePos.x >= helpButton[0] && mousePos.x <= helpButton[0] + 200) {
			if(mousePos.y >= helpButton[1] && mousePos.y <= helpButton[1] + 50) {
				helpScreen = true;
			}
		}

		// Audio Filter
		if(mousePos.x >= muteAudioMainMenuButton[0] && mousePos.x <= muteAudioMainMenuButton[0] + 200) {
			if(mousePos.y >= muteAudioMainMenuButton[1] && mousePos.y <= muteAudioMainMenuButton[1] + 50
				&& lastMutePress != true) {
				audioFilter();
			}
		}

		if(helpScreen == true) {
			// Back Button
			if(mousePos.x >= backButton[0] && mousePos.x <= backButton[0] + 200) {
				if(mousePos.y >= backButton[1] && mousePos.y <= backButton[1] + 50) {
					helpScreen = false;
				} 
			}
		}
	} else if(gamePaused == false && gameOver == false) {
		if(document.getElementById("cannon-turret-rad").checked) {
			if(player.cash >= 75) {
				if(map[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] != 1 &&
				turrets[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] == null) {
					turrets[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] = new turret(0, 1, 10, 200);
					player.cash -= 75;
				}
			}
		} else if(document.getElementById("toxic-turret-rad").checked) {
			if(player.cash >= 200) {
				if(map[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] != 1 &&
				turrets[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] == null) {
					turrets[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] = new turret(1, 5, 5, 160);
					player.cash -= 200;
				}
			}
		} else if(document.getElementById("ice-turret-rad").checked) {
			if(player.cash >= 400) {
				if(map[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] != 1 &&
				turrets[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] == null) {
					turrets[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] = new turret(2, 0, 3, 80);
					player.cash -= 400;
				}
			}
		} else if(document.getElementById("magma-turret-rad").checked) {
			if(player.cash >= 450) {
				if(map[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] != 1 &&
				turrets[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] == null) {
					turrets[Math.floor(mousePos.y / tileSize)][Math.floor(mousePos.x / tileSize)] = new turret(3, 15, 3, 100);
					player.cash -= 450;
				}
			}
		}
	} else if(menu == true) {

		// Main Menu
		if(mousePos.x >= mainMenuButton[0] && mousePos.x <= mainMenuButton[0] + 200) {
			if(mousePos.y >= mainMenuButton[1] && mousePos.y <= mainMenuButton[1] + 50) {
				mainMenu = true;
				snowballs = [];
				for(var s = 0; s < 1000; s++) {
					snowballs.push(new snowball((Math.random() * 960), -(Math.random() * 2000), Math.random() * 1 + 0.5));
				}
			}	
		}

		// Mute Audio
		if(mousePos.x >= muteAudioButton[0] && mousePos.x <= muteAudioButton[0] + 200) {
			if(mousePos.y >= muteAudioButton[1] && mousePos.y <= muteAudioButton[1] + 50 
				&& lastMutePress != true) {
				audioFilter();
			}
		}
	}

}, false);

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});
 
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load",function(){
    update();
});

sounds.theme.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

sounds.theme.play();
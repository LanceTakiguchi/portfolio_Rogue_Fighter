/**
 * Created by Weizguy on 10/18/2016.
 * Prototype to show proof of collision
 * ie. bullets kill tie fighter, and ship
 * collides with tie fighter, both die and
 * ship re-spawns
 */

// declaration of game engine
    // this is where you can change the board size
var game = new Phaser.Game(600, 900, Phaser.AUTO, 'C10_game', { preload: preload, create: create, update: update });

    // declare all globals
    var background = null;
    var foreground = null;
    var cursors = null;
    var speed = 300;
    var xwing;
    var enemies;
    var bullets;
    var bulletTime = 0;
    var bullet;

function preload() {

    // add the images to the game
    game.load.image('background', 'back.png');
    game.load.image('foreground', 'deathstar.png');
    game.load.image('xwing', 'xwing.png');
    game.load.spritesheet('tieFighter', 'tie.png');
    game.load.image('bullet', 'bullet0.png');
}


function create() {

    background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
    // this is where you set the speed of the scroll (and the direction)
    background.autoScroll(0, 60);

    // the image is set super wide to not show up over and over again
    foreground = game.add.tileSprite(0, 0, 1600, 250, 'foreground');
    // here it is set to scroll left
    foreground.autoScroll(-20, 0);

    //  This will check Group vs. Group collision (bullets vs. enemies)
    // Collision for xwing vs enemies as well
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    xwing = game.add.group();
    xwing.enableBody = true;
    xwing.physicsBodyType = Phaser.Physics.ARCADE;

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    // creating enemies in a random position on screen
    for (var i = 0; i < 3; i++)
    {
        var c = enemies.create(Math.random() * 500, Math.random() * 500, 'tieFighter');
        c.name = 'tieFighter' + i;
        c.body.immovable = true;
    }

    for (var i = 0; i < 20; i++)
    {
        var b = bullets.create(40, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }

    // create the xwing
    xwing = game.add.sprite(250, 750, 'xwing');
    game.physics.enable(xwing, Phaser.Physics.ARCADE);
    xwing.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function update() {

    // add the collsion handlers
    game.physics.arcade.collide(bullets, enemies, collisionHandler, null, this);
    game.physics.arcade.collide(xwing, enemies, enemyKillPlayer, null, this);

    // make the xwing controllable
    xwing.body.velocity.x = 0;
    xwing.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        xwing.body.velocity.x = -speed;
    }
    else if (cursors.right.isDown)
    {
        xwing.body.velocity.x = speed;
    }
    else if (cursors.up.isDown)
    {
        xwing.body.velocity.y = -speed;
    }
    else if (cursors.down.isDown)
    {
        xwing.body.velocity.y = speed;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }
}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(xwing.x +  30, xwing.y - 5);
            bullet.body.velocity.y = -300;
            bulletTime = game.time.now + 150;
        }
    }

}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {

    bullet.kill();

}

// called if enemy and player collide
function enemyKillPlayer (player, enemy) {

    player.kill();
    enemy.kill();

    player.reset(250, 750);
}

//  Called if the bullet hits one of the enemies
function collisionHandler (bullet, enemy) {

    bullet.kill();
    enemy.kill();
}
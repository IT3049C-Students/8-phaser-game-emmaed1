var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#bfcc00',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var snake;
var food;
var cursors;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var game = new Phaser.Game(config);

function preload(){
    this.load.image('food', 'gameFolder/img/food.png');
    this.load.image('body', 'gameFolder/img//body.png');
}

function create(){
    var Food = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:

        function Food(scene, x, y){
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);
            this.total = 0;
            scene.children.add(this);
        },
        eat: function(){
            this.total++;
            var x = Phaser.Math.Between(0, 39);
            var y = Phaser.Math.Between(0, 29);
            this.setPosition(x * 16, y * 16);
        }
    });
    var Snake = new Phaser.Class({
        initialize:

        function Snake (scene, x, y){
            this.headPosition = new Phaser.Geom.Point(x, y);
            this.body = scene.add.group();
            this.head = this.body.create(x * 16, y * 16, 'body');
            this.head.setOrigin(0);
            this.alive = true;
            this.speed = 100;
            this.moveTime = 0;
            this.tail = new Phaser.Geom.Point(x, y);
            this.heading = RIGHT;
            this.direction = RIGHT;
        },
        update: function(time){
            if(time >= this.moveTime){
                return this.move(time);
            }
        },
        faceLeft: function(){
            if(this.direction === UP || this.direction === DOWN){
                this.heading = LEFT;
            }
        },
        faceRight: function(){
            if(this.direction === UP || this.direction === DOWN){
                this.heading = RIGHT;
            }
        },
        faceUp: function(){
            if(this.direction === LEFT || this.direction === RIGHT){
                this.heading = UP;
            }
        },
        faceDown: function(){
            if(this.direction === LEFT || this.direction === RIGHT){
                this.heading = DOWN;
            }
        },
        move: function(time){
            switch(this.heading){
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                    break;
                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                    break;
                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                    break;
                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                    break;
            }
            this.direction = this.heading;
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);
            this.moveTime = time + this.speed;
            return true;
        },
        grow: function (){
            var newPart = this.body.create(this.tail.x, this.tail.y, 'body');
            newPart.setOrigin(0);
        },
        collideWithFood: function(food){
            if (this.head.x === food.x && this.head.y === food.y){
                this.grow();
                food.eat();
                return true;
            }else{
                return false;
            }
        }
    });
    food = new Food(this, 3, 4);
    snake = new Snake(this, 8, 8);
    cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta){
    if(!snake.alive){
        return;
    }
    if(cursors.left.isDown){
        snake.faceLeft();
    }else if(cursors.right.isDown){
        snake.faceRight();
    }else if(cursors.up.isDown){
        snake.faceUp();
    }else if (cursors.down.isDown){
        snake.faceDown();
    }
    if (snake.update(time)){
        snake.collideWithFood(food);
    }
}
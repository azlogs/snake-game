const MOVE_TYPE = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
}

const KEY_MOVE = {
    UP : 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight'
};

const snake = {
    length: 3,
    width: 20,
    position: {
        top: 100,
        left: 100
    },
    speed: 10,
    step: 25,
    currentMove: 'NONE',
    isDead: false,
    init: function(x,y){
        this.currentMove = MOVE_TYPE.RIGHT;
        this.render();
        this.run();
    },
    snakeInternal: null,
    run: function(){
        this.snakeInternal = setInterval(() => {
            this.moving();
        }, 600 - this.speed);
    },

    moving: function(){
        switch  (this.currentMove){
            case MOVE_TYPE.UP:
                this.position.top -= this.step;
                break;
            case MOVE_TYPE.DOWN:
                this.position.top += this.step;
                break;
            case MOVE_TYPE.LEFT:
                this.position.left -= this.step;
                break;
            case MOVE_TYPE.RIGHT:
                this.position.left += this.step;
                break;
            default:
                break;
        }

        let curentPosition = {
            left: this.position.left,
            top: this.position.top
        }

        for(var i = 0; i < this.length; i++){
            const snakePart = document.getElementById("snake-part" + i);

            const tmpPosition = {
                left: parseInt(snakePart.style.left),
                top: parseInt(snakePart.style.top)
            } 

            snakePart.style.left = curentPosition.left + 'px';
            snakePart.style.top = curentPosition.top + 'px';

            curentPosition = tmpPosition;
        }
    },

    stop: function(){
        if (this.snakeInternal){
            clearInterval(this.snakeInternal);
        }
    },

    die: function(){

    },

    eat: function(obstacle, size){
        const snakeHeaderPoistions = [
            {top: this.position.top + this.width/2, left: this.position.left},
            {top: this.position.top, left: this.position.left + this.width /2},
            {top: this.position.top + this.width, left: this.position.left + this.width /2},
            {top: this.position.top + this.width/2, left: this.position.left + this.width},
            {top: this.position.top + this.width/2, left: this.position.left + this.width/2},
            {top: this.position.top, left: this.position.left},
            {top: this.position.top + this.width, left: this.position.left},
            {top: this.position.top, left: this.position.left + this.width},
            {top: this.position.top + this.width, left: this.position.left + this.width}
        ];

        for(let i = 0; i < 4; i++){
            const point = snakeHeaderPoistions[i];
            if (this.colide(point, obstacle, size)){
                return true;
            }
        }

        return false;
    },


    colide: function(point, obstacle, size){
        if (point.top >= obstacle.top && point.top <= (obstacle.top + size)){
            if (point.left >= obstacle.left && point.left <= (obstacle.left + size)){
                return true;
            }
        }

        return false;
    },


    render : function (){
        const snake = document.getElementById("snake");
        snake.innerHTML = '';
        for(var i = 0; i < this.length; i++){
            var element = document.createElement("div");
            element.className = "snake-body";
            element.id = "snake-part" + i;
            if (i === 0){
                element.style.backgroundColor = "red";
                element.style.borderRadius = '50%';
                element.style.zIndex = "999";
            }
            element.style.top = this.position.top + 'px';
            element.style.left = (this.position.left - i*25) + 'px'
            snake.append(element);
        }
    },

    increateBody: function(){
        var element = document.createElement("div");
        element.className = "snake-body";
        element.id = "snake-part" + this.length;
        element.style.top = this.position.top + 'px';
        element.style.left = (this.position.left - this.length*25) + 'px'
        const snake = document.getElementById("snake");
        snake.append(element);
    }
}

const cage = {
    length: 1000,
    width: 500,
    cage: document.getElementById("cage"),
    init: function(){
        this.cage.style.width = this.length + 'px';  
        this.cage.style.height = this.width + 'px';  
    },
}

const obstacle = {
    obstacle: document.getElementById("obstacles"),
    position: {
        left: 500,
        top: 240
    },
    size:{
        width: 20,
        height: 20,
    },
    init: function(){
        this.render();
    },
    render: function(){
        this.obstacle.style.width = this.size.width + 'px';
        this.obstacle.style.height = this.size.height + 'px';
        this.obstacle.style.left = this.position.left + 'px';
        this.obstacle.style.top = this.position.top + 'px';
    },
    randomPosition: function(){
        this.position = {
            left: Math.floor(Math.random() * 70 + 25),
            top: Math.floor(Math.random() * 480 + 25)
        }
        this.render();
    }
}

const gamePlay = {
    point: 0,
    level: 1,
    checkingInterval: null,
    pointComponent : document.getElementById("point"),
    levelComponent : document.getElementById("level"),
    init: function(){
        cage.init();
        snake.init();
        obstacle.init();
        this.handleControl();
        this.listingEvents();
        this.update();
    },

    handleControl: function(){
        document.onkeydown = function(e){
            if (e.code === KEY_MOVE.UP)
            {
                if (snake.currentMove !== MOVE_TYPE.DOWN) {
                    snake.currentMove = MOVE_TYPE.UP;
                }
            } 
            else if (e.code === KEY_MOVE.DOWN)
            {
                if (snake.currentMove !== MOVE_TYPE.UP) {
                    snake.currentMove = MOVE_TYPE.DOWN;
                }
            } 
            else if (e.code === KEY_MOVE.LEFT)
            {
                if (snake.currentMove !== MOVE_TYPE.RIGHT) {
                    snake.currentMove = MOVE_TYPE.LEFT;
                }
            } 
            else if (e.code === KEY_MOVE.RIGHT)
            {
                if (snake.currentMove !== MOVE_TYPE.LEFT) {
                    snake.currentMove = MOVE_TYPE.RIGHT;
                }
            }
        }
    },
    
    listingEvents: function(){
        let timer = 0;
        this.checkingInterval = setInterval(() => {
            timer++;
             if (snake.eat(obstacle.position, obstacle.size.width)){
                
                snake.stop();
                snake.increateBody();
                snake.length++;
                if (timer > 2000){
                    this.point += 10;
                } else {
                    this.point += 2000 - timer + 10;
                }
                timer = 0;
                this.level++;
                this.update();
                snake.speed += 10;
                if (snake.speed > 550){
                    snake.speed = 550;
                }
                obstacle.randomPosition();
                snake.run();
             }

             if (snake.position.left > cage.length - 25 || 
                snake.position.left < 0 ||
                snake.position.top < 0 ||
                snake.position.top > cage.width - 25){
                    snake.isDead = true;
            }

            if (snake.isDead){
                snake.stop();
            }
          
        }, 10);
    },
    update: function(){
        this.pointComponent.innerHTML = "Point: " + this.point;
        this.levelComponent.innerHTML = "Level: " + this.level;
    }
}

gamePlay.init();
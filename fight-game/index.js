
const canvas = document.querySelector('canvas');
var cx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
cx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;


const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./imgs/background2.png"

})

const shop = new Sprite({
    position: {
        x: 640,
        y: 162
    },
    imageSrc: "./imgs/decorations/shop_anim.png",    
    scale: 2.5,
    framesMax: 6,
    frameCurrent: 1

})


const player = new Fighter({
    position: {
        x: 60,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    scale: 2.1,
    framesMax: 8,
    offset: {
        x:190,
        y:110
    },
    sprites: {
        idle: {
            imageSrc: "./imgs/Martial Hero/Sprites/Idle.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./imgs/Martial Hero/Sprites/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./imgs/Martial Hero/Sprites/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./imgs/Martial Hero/Sprites/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./imgs/Martial Hero/Sprites/Attack1.png",
            framesMax: 6
        },
        takeHit: {
            imageSrc: "./imgs/Martial Hero/Sprites/Take Hit - white silhouette.png",
            framesMax: 4
        }
    },
    attackBox: {
            offset:{
                x: 30,
                y: 70,
            },
            width: 170,
            height: 50
    }
}); 

const enemy = new Fighter({
    position: {
        x: 900,
        y: 200
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset:{ 
        x: -50,
        y: 0
    },
    color: "blue",
    imageSrc: "./imgs/Martial Hero 2/Sprites/Idlereverse.png",
    scale: 2.1,
    framesMax: 4,
    offset: {
        x:190,
        y:120
    },
    sprites: {
        idle: {
            imageSrc: "./imgs/Martial Hero 2/Sprites/Idlereverse.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./imgs/Martial Hero 2/Sprites/Runreverse.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./imgs/Martial Hero 2/Sprites/Jumpreverse.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./imgs/Martial Hero 2/Sprites/Fallreverse.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./imgs/Martial Hero 2/Sprites/Attack1reverse.png",
            framesMax: 4
        },
        takeHit: {
            imageSrc: "./imgs/Martial Hero 2/Sprites/Take hit.png",
            framesMax: 3
        }
    },
    attackBox: {
        offset:{
            x: -130,
            y: 50,
        },
        width: 170,
        height: 50
}
}); 




const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
};


decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    cx.fillStyle = "black"; 
    cx.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();
    player.update();
    enemy.update();

   player.velocity.x = 0; 
   enemy.velocity.x = 0;

   //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -7;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 7;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0){
        player.switchSprite('jump');
    } else if (player.velocity.y > 0){
        player.switchSprite('fall');
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -7;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 7;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    //jumpning animation
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall');
    }


    //player hit enemy
    if (
        reactangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && 
        player.isAttacking &&
        player.framesCurrent === 4
        ) {
        
        player.isAttacking = false;
        enemy.takeHit();
        console.log("hit player 1");
        document.querySelector('#enemyHealth').style.width = enemy.health + "%"; 
    }
    // enemy hit player
    if (
        reactangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && 
        enemy.isAttacking &&
        enemy.framesCurrent === 2
        ){
        
        enemy.isAttacking = false;
        player.takeHit();
        console.log("hit player 2");
        document.querySelector('#playerHealth').style.width = player.health + "%";
    }

    //if enemy miss attack

    if (player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false;
    }
    if (enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false;
    }

    // end game based on health

    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId});
        
    }
}

animate();



window.addEventListener('keydown', (event) => {

    console.log(event.key);
    switch (event.key){
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            keys.w.pressed = true;
            player.velocity.y = -20;
            break;
        case ' ':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            keys.w.pressed = true;
            enemy.velocity.y = -20;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    }
    
});

window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;        
    }

    // enemy keys

    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.w.pressed = false;
            break;        
    }
    
});
init();

function init() {
    autowin = false; //c;
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    ASPECT_RATIO = WIDTH / HEIGHT;
    FOV = 70;
    NEAR = 0.1;
    FAR = 3000;
    FPS = 1000 / 60;
    mouse = new THREE.Vector2(WIDTH / 2, HEIGHT / 2);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    })

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR);
    camera.position.set(0, 100, 425);
    camera.rotation.set(-0.5, 0, 0);

    renderer.domElement.onmousemove = function(event) {
        mouse.set(event.clientX, event.clientY);
    }
    worldLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(worldLight);

    light1 = new THREE.PointLight(0xFFFFFF, 0.5);
    light1.position.y = 200;
    scene.add(light1)
    board = new THREE.Mesh(
        new THREE.BoxBufferGeometry(300, 5, 700),
        new THREE.MeshLambertMaterial({
            color: 0xd7dbe2,
            wireframe: true
        })
    )
    scene.add(board);

    player = new THREE.Mesh(
        new THREE.BoxBufferGeometry(50, 16, 3),
        new THREE.MeshLambertMaterial({
            color: 0x025bea
                //wireframe: true,
                //wireframeLinewidth: 5,
        })
    )
    playerScore = 0;
    player.position.set(0, 12, 320); //z-347
    scene.add(player);


    ai = new THREE.Mesh(
        new THREE.BoxBufferGeometry(50, 16, 3),
        new THREE.MeshLambertMaterial({
            color: 0xff0a33 //,
                // wireframe: true
        })
    )
    aiScore = 0;
    ai.position.set(0, 12, -320); //z-347
    scene.add(ai);

    ball = new THREE.Mesh(
        new THREE.SphereGeometry(15, 100, 100),
        new THREE.MeshBasicMaterial({
            color: 0xFFFFFF, //0xff114d,
            //wireframe: true,
        })
    )
    resetBall();
    scene.add(ball);
    setInterval(update, FPS);
}

function update() {
    ball.position.x += ballVelocityX;
    ball.position.z += ballVelocityZ;
    ball.angle += 0.03;

    //player collision
    if (ball.position.z + 15 >= player.position.z && ball.position.x > player.position.x - 50 / 2 && ball.position.x < player.position.x + 50 / 2) {
        ballVelocityZ = -ballVelocityZ;
    }
    //ai movement
    ai.position.x += (ball.position.x - ai.position.x) * 0.12

    //ai collision
    if (ball.position.z - 15 < ai.position.z && ball.position.x < ai.position.x + 50 / 2 && ball.position.x > ai.position.x - 50 / 2) {
        ballVelocityZ = -ballVelocityZ;
    }

    //wall collision
    if (ball.position.x + 15 + ballVelocityX > 150 || ball.position.x - 15 + ballVelocityX < -150) {
        ballVelocityX = -ballVelocityX;
    }
    //score
    if (ball.position.z + 15 + ballVelocityZ > 350) {
        aiScore++;
        document.getElementById("aiScore").innerHTML = "AI: " + aiScore;
        resetBall();
    }
    if (ball.position.z - 15 + ballVelocityX < -350) {
        playerScore++;
        document.getElementById("playerScore").innerHTML = "player: " + playerScore;
        resetBall();
    }
    ball.rotation.set(0, ball.angle, 0);

    if (autowin == true) {
        mouse.x = (ball.position.x / 300) - 150
        console.log(mouse.x);
    }
    camera.position.x = -150 + (mouse.x / WIDTH) * 300;
    camera.rotation.z = 0.25 + (mouse.x / WIDTH) * -0.5;
    player.position.x += (camera.position.x - player.position.x);
    render();

}

function render() {

    renderer.render(scene, camera);

}

function resetBall() {
    ball.position.set(0, 15, 0);
    ball.angle = 0;
    ballVelocityX = (Math.random() * 10 - 5);
    ballVelocityZ = (Math.random() * 15 - 5);
    if (ballVelocityX < 2 && ballVelocityX > -2) {
        //ballVelocityX *= 3
        resetBall();
    }
    if (ballVelocityZ < 2 && ballVelocityZ > -2) {
        //ballVelocityZ *= 3
        resetBall();

    }
}
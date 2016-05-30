/// <reference path="src/body/Car3D.ts"/>
/// <reference path="src/body/CPUCar.ts"/>
/// <reference path="src/Tracks/Track.ts"/>
/// <reference path="src/ChaseCamera.ts"/>
/// <reference path="src/Background.ts"/>


var scene = new THREE.Scene(); // Create a Three.js scene object.

let clock = new THREE.Clock();
let container = document.getElementById('container');
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the WebGL viewport.
renderer.setClearColor(new THREE.Color(0xefefef));//背景色
container.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.



// 環境光
let _ambient = new THREE.AmbientLight(0x888888);
scene.add(_ambient);

let backgournd = new Background(scene);



let track = new RacingGame.Tracks.Track(scene);
var testCar = new Car3D(scene, track);
var cpuCar = new CPUCar(scene, track);

var chaseCamera = new ChaseCamera(testCar._group, new THREE.Vector3(0, -20, 10));//new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define the perspective camera's attributes.

// スポットライト
let _spot = new THREE.SpotLight(0xFFFFFF, 2, 3000, Math.PI / 1, 20);
_spot.position.set(0, 0, 2000);
_spot.castShadow = true;
_spot.target = testCar._group;
//if (IS_DEBUG_MODE) _spot.shadowCameraVisible = true;
scene.add(_spot);

init();

// FUNCTIONS     
function init() {
    window.addEventListener('resize', () => {
        console.log("resize");
        chaseCamera.camera.aspect = window.innerWidth / window.innerHeight;
        chaseCamera.camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}
function render() {
    requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).

    var delta = clock.getDelta();
    testCar.Update(delta);
    cpuCar.Update(delta);
    chaseCamera.Update(delta);

    if (right) {
        testCar.SteerAngle = Math.min(testCar.SteerAngle + 0.014, +0.4);
    } else if (left) {
        testCar.SteerAngle = Math.max(testCar.SteerAngle - 0.014, -0.4);
    } else {
        testCar.SteerAngle *= 0.5;
    }

    renderer.render(scene, chaseCamera.camera); // Each time we change the position of the cube object, we must re-render it.
};

render(); // Start the rendering of the animation frames.

let left = false;
let right = false;
document.onkeydown = function (e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 32:
            //testCar.Brake = 2;
            break;//return false;
        case 38:
            testCar.Throttle = 1;
            break;//return false;
        case 40:
            testCar.Brake = 1;
            break;//return false;
        case 37:
            left = true;
            break;//return false;
        case 39:
            right = true;
            break;//return false;
        case 67: // 'C' - pick the next car model
        case 82: // 'R' - reset the car
            break;//return false;
    }
};


document.onkeyup = function (e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 32:
            //testCar.Brake = 0;
            break;//return false;
        case 38:
            testCar.Throttle = 0;
            break;//return false;
        case 40:
            testCar.Brake = 0;
            break;//return false;
        case 37:
            left = false;
            break;//return false;
        case 39:
            right = false;
            break;//return false;
    }
};





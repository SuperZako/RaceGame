/// <reference path="src/body/TestCar.ts"/>
/// <reference path="src/track/TestTrack.ts"/>
/// <reference path="src/ChaseCamera.ts"/>


var scene = new THREE.Scene(); // Create a Three.js scene object.

let clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the WebGL viewport.
renderer.setClearColor(new THREE.Color(0xefefef));//背景色
document.body.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.

//GridHelper(大きさ, １マスの大きさ)
var grid = new THREE.GridHelper(1000, 10);




// 環境光
let _ambient = new THREE.AmbientLight(0x888888);
scene.add(_ambient);

//シーンオブジェクトに追加
scene.add(grid);


let testTrack = new TestTrack(scene);
var testCar = new TestCar(scene, testTrack);


var chaseCamera = new ChaseCamera(testCar._group, new THREE.Vector3(0, 5, 10));//new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define the perspective camera's attributes.

// スポットライト
let _spot = new THREE.SpotLight(0xFFFFFF, 10, 3000, Math.PI / 1, 20);
_spot.position.set(0, 2000, 0);
_spot.castShadow = true;
_spot.target = testCar._group;
//if (IS_DEBUG_MODE) _spot.shadowCameraVisible = true;
scene.add(_spot);



let render = () => {
    //controls.update();
    requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).

    var delta = clock.getDelta();

    testCar.Update(delta);
    chaseCamera.Update(delta);



    renderer.render(scene, chaseCamera.camera); // Each time we change the position of the cube object, we must re-render it.

    if (left) {
        testCar.SteerAngle = Math.min(testCar.SteerAngle + 0.014 , +0.4);
    } else if (right) {
        testCar.SteerAngle = Math.max(testCar.SteerAngle - 0.014 , -0.4);
    } else {
        testCar.SteerAngle *= 0.5;//0.9;
    }
};

render(); // Start the rendering of the animation frames.

let left = false;
let right = false;
document.onkeydown = function (e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 32:
            //testCar.Brake = 2;
            return false;
        case 38:
            testCar.Throttle = 1;
            return false;
        case 40:
            testCar.Brake = 1;
            return false;
        case 37:
            left = true;
            return false;
        case 39:
            right = true;
            return false;
        case 67: // 'C' - pick the next car model
        case 82: // 'R' - reset the car
            return false;
    }
};


document.onkeyup = function (e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 32:
            //testCar.Brake = 0;
            return false;
        case 38:
            testCar.Throttle = 0;
            return false;
        case 40:
            testCar.Brake = 0;
            return false;
        case 37:
            left = false;
            return false;
        case 39:
            right = false;
            return false;
    }
};
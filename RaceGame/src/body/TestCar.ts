/// <reference path="Car2D.ts"/>
/// <reference path="Formula1Car2D.ts"/>

class TestCar extends Formula1Car2D {

    _group: THREE.Object3D = null;
    _meshBody: THREE.Mesh = null;
    _meshBody2: THREE.Mesh = null;
    _meshWheelFrontLeft: THREE.Mesh = null;
    _meshWheelFrontRight: THREE.Mesh = null;
    _meshWheelBackLeft: THREE.Mesh = null;
    _meshWheelBackRight: THREE.Mesh = null;



    constructor(scene: THREE.Scene, private track: RacingGame.Tracks.Track) {
        super();

        // 車
        this._group = new THREE.Object3D();
        this._group.position.set(0, 0.5, 0);
        scene.add(this._group);
        // 車（ボディ）
        let geometry: THREE.Geometry = new THREE.CubeGeometry(2, 5, 1);
        let material = new THREE.MeshPhongMaterial({ color: 0xFF0000, specular: 0xFFFFFF, shininess: 100 });
        this._meshBody = new THREE.Mesh(geometry, material);
        this._meshBody.castShadow = true;
        this._meshBody.position.set(0, 0.5, 0);
        this._group.add(this._meshBody);
        //
        //geometry = new THREE.CubeGeometry(2, 0.5, 3);
        //this._meshBody2 = new THREE.Mesh(geometry, material);
        //this._meshBody2.castShadow = true;
        //this._meshBody2.position.set(0, 1.25, -0.5);
        //this._group.add(this._meshBody2);
        //// 車（タイヤ）
        //geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
        //material = new THREE.MeshPhongMaterial({ color: 0x000000 });
        //this._meshWheelFrontLeft = new THREE.Mesh(geometry, material);
        //this._meshWheelFrontLeft.rotation.x = getAngleByRotation(90);
        //this._meshWheelFrontLeft.rotation.z = getAngleByRotation(90);
        //this._meshWheelFrontLeft.position.set(1.1, 0.25, 1.5);
        //this._group.add(this._meshWheelFrontLeft);
        ////
        //geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
        //this._meshWheelFrontRight = new THREE.Mesh(geometry, material);
        //this._meshWheelFrontRight.rotation.x = getAngleByRotation(90);
        //this._meshWheelFrontRight.rotation.z = getAngleByRotation(90);
        //this._meshWheelFrontRight.position.set(-1.1, 0.25, 1.5);
        //this._group.add(this._meshWheelFrontRight);
        ////
        //geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
        //this._meshWheelBackLeft = new THREE.Mesh(geometry, material);
        //this._meshWheelBackLeft.rotation.x = getAngleByRotation(90);
        //this._meshWheelBackLeft.rotation.z = getAngleByRotation(90);
        //this._meshWheelBackLeft.position.set(1.1, 0.25, -1.5);
        //this._group.add(this._meshWheelBackLeft);
        ////
        //geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
        //this._meshWheelBackRight = new THREE.Mesh(geometry, material);
        //this._meshWheelBackRight.rotation.x = getAngleByRotation(90);
        //this._meshWheelBackRight.rotation.z = getAngleByRotation(90);
        //this._meshWheelBackRight.position.set(-1.1, 0.25, -1.5);
        //this._group.add(this._meshWheelBackRight);
        this.Position.x = track.StartPosition.x;
        this.Position.y = track.StartPosition.y;
        let m = track.GetTrackPositionMatrix(0);
        let euler = new THREE.Euler().setFromRotationMatrix(m);
        this.Angle = -euler.z;
    }

    euler = new THREE.Euler();
    public Update(dt: number) {
        super.Update(dt);

        let result = track.ApplyCheckForCollisions(this.Position.x, this.Position.y, this.VelocityWorld.x, this.VelocityWorld.y);

        if (result !== null) {
            this.Angle = -(result.angle-MathHelper.PiOver2);
            this.Position.x = result.x;
            this.Position.y = result.y;
            this.VelocityWorld.multiplyScalar(0.7);
        }
        this._group.position.set(this.Position.x, this.Position.y, 0);
        //var a = new THREE.Euler(0, 0, -this.Angle, 'XYZ');
        this.euler.z = -this.Angle;
        this._group.setRotationFromEuler(this.euler);
    }
}

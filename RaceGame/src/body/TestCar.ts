/// <reference path="Car2D.ts"/>
/// <reference path="Formula1Car2D.ts"/>

/* ---------- 共通関数 ---------- */

function getAngleByRotation(rot: number) {
    return rot * Math.PI / 180;
}


class TestCar extends Formula1Car2D {

    _group: THREE.Object3D = null;
    _meshBody: THREE.Mesh = null;
    _meshBody2: THREE.Mesh = null;
    _meshWheelFrontLeft: THREE.Mesh = null;
    _meshWheelFrontRight: THREE.Mesh = null;
    _meshWheelBackLeft: THREE.Mesh = null;
    _meshWheelBackRight: THREE.Mesh = null;



    constructor(scene: THREE.Scene, private track: Track) {
        super();

        track.setSegmentIndex(this);


        // 車
        this._group = new THREE.Object3D();
        this._group.position.set(0, 0.5, 0);
        scene.add(this._group);
        // 車（ボディ）
        let geometry: THREE.Geometry = new THREE.CubeGeometry(2, 1, 5);
        let material = new THREE.MeshPhongMaterial({ color: 0xFF0000, specular: 0xFFFFFF, shininess: 100 });
        this._meshBody = new THREE.Mesh(geometry, material);
        this._meshBody.castShadow = true;
        this._meshBody.position.set(0, 0.5, 0);
        this._group.add(this._meshBody);
        //
        geometry = new THREE.CubeGeometry(2, 0.5, 3);
        this._meshBody2 = new THREE.Mesh(geometry, material);
        this._meshBody2.castShadow = true;
        this._meshBody2.position.set(0, 1.25, -0.5);
        this._group.add(this._meshBody2);
        // 車（タイヤ）
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
        material = new THREE.MeshPhongMaterial({ color: 0x000000 });
        this._meshWheelFrontLeft = new THREE.Mesh(geometry, material);
        this._meshWheelFrontLeft.rotation.x = getAngleByRotation(90);
        this._meshWheelFrontLeft.rotation.z = getAngleByRotation(90);
        this._meshWheelFrontLeft.position.set(1.1, 0.25, 1.5);
        this._group.add(this._meshWheelFrontLeft);
        //
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
        this._meshWheelFrontRight = new THREE.Mesh(geometry, material);
        this._meshWheelFrontRight.rotation.x = getAngleByRotation(90);
        this._meshWheelFrontRight.rotation.z = getAngleByRotation(90);
        this._meshWheelFrontRight.position.set(-1.1, 0.25, 1.5);
        this._group.add(this._meshWheelFrontRight);
        //
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
        this._meshWheelBackLeft = new THREE.Mesh(geometry, material);
        this._meshWheelBackLeft.rotation.x = getAngleByRotation(90);
        this._meshWheelBackLeft.rotation.z = getAngleByRotation(90);
        this._meshWheelBackLeft.position.set(1.1, 0.25, -1.5);
        this._group.add(this._meshWheelBackLeft);
        //
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
        this._meshWheelBackRight = new THREE.Mesh(geometry, material);
        this._meshWheelBackRight.rotation.x = getAngleByRotation(90);
        this._meshWheelBackRight.rotation.z = getAngleByRotation(90);
        this._meshWheelBackRight.position.set(-1.1, 0.25, -1.5);
        this._group.add(this._meshWheelBackRight);
    }


    //public getPosition() {
    //    return new THREE.Vector3(-this.Position.x, 0, -this.Position.y);
    //}

    public Forward() {
        return new THREE.Vector2(this.Position.x, this.Position.y);
    }


    public calcHeight() {
        let xAxis = new THREE.Vector3();
        let yAxis = new THREE.Vector3();
        let zAxis = new THREE.Vector3();

        let matrix = this._group.matrixWorld.clone();
        matrix.extractBasis(xAxis, yAxis, zAxis);
        yAxis.negate();
        var localVertex = this._group.position.clone();//this._meshWheelFrontLeft.position.clone();
        var globalVertex = matrix.multiplyVector3(localVertex);
        //var directionVector = globalVertex.subSelf(Player.position);

        var ray = new THREE.Raycaster(globalVertex, yAxis);
        var collisionResults = ray.intersectObjects(RoadSegment.collidableMeshList);
        if (collisionResults.length > 0 /*&& collisionResults[0].distance < directionVector.length()*/) {
            return collisionResults[0].point.y;
            // a collision occurred... do something...
        }
    }

    public Update(dt: number) {
        super.Update(dt);



        let h = this.track.adjustPosition(this);

        this._group.position.set(-this.Position.x, 0, -this.Position.y);

        this.Angle = MathHelper.WrapAngle(this.Angle);
        //document.getElementById('info').innerHTML = "angle:" + MathHelper.ToDegrees(h.theta);
        var a = new THREE.Euler(/*-h.theta*/0, this.Angle, 0, 'XYZ');
        this._group.setRotationFromEuler(a);

    }
}

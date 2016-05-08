

class ChaseCamera {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define the perspective camera's attributes.
    dummyCamera: THREE.PerspectiveCamera;
    lastlastPosition = new THREE.Vector3();
    lastPosition = new THREE.Vector3();

    constructor(private target: THREE.Object3D, private positionOffset: THREE.Vector3) {
        this.dummyCamera = this.camera.clone();
    }

    public Update(dt: number) {
        let target = this.target;
        let v = this.positionOffset.clone();
        v.applyMatrix4(target.matrixWorld);
        this.lastlastPosition = this.lastPosition.clone();
        this.lastPosition = this.dummyCamera.position.clone();

        this.lastPosition.lerp(this.lastlastPosition, 0.5);
        v.lerp(this.lastPosition, 0.5);

        this.dummyCamera.position.set(v.x, v.y, v.z);
        this.dummyCamera.lookAt(target.position);


        this.camera.quaternion.slerp(this.dummyCamera.quaternion, 0.5);
        this.camera.position.lerp(this.dummyCamera.position, 0.5);
    }

}


class ChaseCamera {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define the perspective camera's attributes.
    dummyCamera: THREE.PerspectiveCamera;
    lastlastPosition = new THREE.Vector3();
    lastPosition = new THREE.Vector3();


    positions: THREE.Vector3[] = [];

    constructor(private target: THREE.Object3D, private positionOffset: THREE.Vector3) {
        this.camera.up.set(0, 0, 1);
        this.dummyCamera = this.camera.clone();


        for (let i = 0; i < 10; ++i)
            this.positions.push(new THREE.Vector3());
    }

    private averagePosition() {
        let positions = this.positions;
        let v = new THREE.Vector3();
        for (let position of positions) {
            v.add(position);
        }

        v.x /= 10;
        v.y /= 10;
        v.z /= 10;

        return v;
    }

    public Update(dt: number) {
        let target = this.target;
        let v = this.positionOffset.clone();
        v.applyMatrix4(target.matrixWorld);

        //this.positions.shift();
        //this.positions.push(this.dummyCamera.position.clone());

        //this.lastlastPosition = this.lastPosition.clone();
        this.lastlastPosition.set(this.lastPosition.x, this.lastPosition.y, this.lastPosition.z);

        this.lastPosition = this.dummyCamera.position.clone();

        this.lastPosition.lerp(this.lastlastPosition, 0.5);
        v.lerp(this.lastPosition, 0.5);
        //let average = this.averagePosition();

      
        this.dummyCamera.up.set(0, 0, 1);
        this.dummyCamera.position.set(v.x, v.y, v.z);
        this.dummyCamera.lookAt(target.position);
        


        this.camera.quaternion.slerp(this.dummyCamera.quaternion, 0.5);
        this.camera.position.lerp(this.dummyCamera.position, 0.5);
    }

}
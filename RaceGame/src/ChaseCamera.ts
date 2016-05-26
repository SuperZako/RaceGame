/// <reference path="Helpers/Vector3D.ts"/>

class ChaseCamera {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000); // Define the perspective camera's attributes.
    dummyCamera: THREE.PerspectiveCamera;

    positions: IVector3D[] = [];

    constructor(private target: THREE.Object3D, private positionOffset: THREE.Vector3) {
        this.camera.up.set(0, 0, 1);
        this.dummyCamera = this.camera.clone();


        for (let i = 0; i < 5; ++i)
            this.positions.push({ x: 0, y: 0, z: 0 });
    }

    private averagePosition(vector: IVector3D) {
        let positions = this.positions;

        positions.pop();
        positions.unshift(vector);

        let x = 0;
        let y = 0;
        let z = 0;
        for (let position of positions) {
            x += position.x;
            y += position.y;
            z += position.z;
        }
        x /= 5;
        y /= 5;
        z /= 5;

        return { x, y, z };
    }

    public Update(dt: number) {
        let target = this.target;
        let v = this.positionOffset.clone();
        v.applyMatrix4(target.matrixWorld);

        let pos = this.averagePosition({ x: v.x, y: v.y, z: v.z });

        this.dummyCamera.up.set(0, 0, 1);
        this.dummyCamera.position.set(pos.x, pos.y, pos.z);
        this.dummyCamera.lookAt(target.position);



        this.camera.quaternion.slerp(this.dummyCamera.quaternion, 0.5);
        this.camera.position.lerp(this.dummyCamera.position, 0.5);
    }

}
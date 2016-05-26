class Background {
    private _scene: THREE.Scene = null;
    private _field: THREE.Mesh = null;
    private _sky: THREE.Mesh = null;



    constructor(scene: THREE.Scene) {
        this._scene = scene;
        //
        this._createField();
        this._createSky();
    }


    private _createField() {
        var geometry = new THREE.PlaneGeometry(5000, 5000);
        let texture = new THREE.TextureLoader().load("textures/grass.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = 100;
        texture.repeat.y = 100;
        var material = new THREE.MeshBasicMaterial({ map: texture });
        var plane = new THREE.Mesh(geometry, material);
        plane.position.z = -0.1;
        scene.add(plane);
    }

    private _createSky() {
        let height = 2000;
        var geometry = new THREE.CylinderGeometry(2500, 2500, height, 30, 1, true);
        var texture = new THREE.TextureLoader().load("textures/sky.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        this._sky = new THREE.Mesh(geometry, material);
        this._sky.rotateX(MathHelper.PiOver2);
        this._sky.position.z = height / 2;
        //this._sky.position.set(imjcart.logic.map.value.MapConst.MAP_CENTER_X, 375, imjcart.logic.map.value.MapConst.MAP_CENTER_Z);
        this._scene.add(this._sky);
    }


}
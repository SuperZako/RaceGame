
namespace RacingGame.Tracks {
    export class TrackLine {
        protected splinePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-40, -40, 0),
            new THREE.Vector3(40, -40, 0),
            new THREE.Vector3(140, -40, 0),
            new THREE.Vector3(40, 40, 0),
            new THREE.Vector3(-40, 40, 0),
        ]);

        constructor(scene: THREE.Scene) {
            let splinePath = this.splinePath;
            (<any>splinePath).closed = true;

            var geometry = new THREE.Geometry();
            geometry.vertices = splinePath.getPoints(50);

            var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
            var splineObject = new THREE.Line(geometry, material);

            scene.add(splineObject);
        }
    }
}
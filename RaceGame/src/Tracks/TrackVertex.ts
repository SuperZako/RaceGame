namespace RacingGame.Tracks {
    export class TrackVertex {
        public constructor(
            public pos: THREE.Vector3,
            public right: THREE.Vector3,
            public up: THREE.Vector3,
            public dir: THREE.Vector3) {

            right.normalize();
            up.normalize();
            dir.normalize();
        }
    }
}
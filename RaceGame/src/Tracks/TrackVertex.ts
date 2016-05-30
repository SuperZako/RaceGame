namespace RacingGame.Tracks {
    export class TrackVertex {

        public get Position() {
            return this.position;
        }


        public constructor(
            private position: THREE.Vector3,
            public right: THREE.Vector3,
            public up: THREE.Vector3,
            public dir: THREE.Vector3) {

            right.normalize();
            up.normalize();
            dir.normalize();
        }
    }
}
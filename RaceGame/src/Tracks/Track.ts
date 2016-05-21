/// <reference path="TrackLine.ts"/>

namespace RacingGame.Tracks {
    export class Track extends TrackLine {
        public get StartPosition() {

            return this.splinePath.getPoint(0);
        }

        constructor(scene: THREE.Scene) {
            super(scene);
        }
    }
}
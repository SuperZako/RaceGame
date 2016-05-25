/// <reference path="TrackLine.ts"/>

namespace RacingGame.Tracks {
    export class Track extends TrackLine {
        public get StartPosition() {

            return this.splinePath.getPoint(0);
        }

        constructor(scene: THREE.Scene) {
            super(scene);
        }


        public GetTrackPositionMatrix(trackPositionPercent: number) {
            return new THREE.Matrix4().makeBasis(this.points[0].right, this.points[0].dir, this.points[0].up);
        }

        //ApplyGravityAndCheckForCollisions
        public ApplyCheckForCollisions(x: number, y: number, vx: number, vy: number) {
            let maxDistance = Number.MAX_VALUE;
            let segments = this.segments;
            let index = -1;
            for (let i = 0; i < segments.length; ++i) {
                let distance = MathHelper.GetDistance(segments[i].pos.x, segments[i].pos.y, x, y);
                if (distance < maxDistance) {
                    index = i;
                    maxDistance = distance;
                }
            }

            let segment = segments[index];

            let result = segment.clamp(new THREE.Vector3(x, y, 0), 20);
            let sign = segment.sign(vx, vy);
            let angle = segment.angle;

            if (sign < 0)
                angle -= MathHelper.Pi; 

            if (result !== null) {
                return { x: result.x, y: result.y, angle: angle };
            }
            return null;
        }
    }
}
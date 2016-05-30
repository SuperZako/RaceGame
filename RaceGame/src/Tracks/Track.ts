/// <reference path="TrackLine.ts"/>

namespace RacingGame.Tracks {
    export class Track extends TrackLine {

        public get StartPosition() {
            //return this.splinePath.getPoint(0);
            return this.points[0].Position;
        }

        constructor(scene: THREE.Scene) {
            super(scene);
        }


        public GetTrackPositionMatrix(trackPositionPercent: number) {
            return new THREE.Matrix4().makeBasis(this.points[0].right, this.points[0].dir, this.points[0].up);
        }

        public GetCurrentSegmentAndIndex(x: number, y: number, z: number) {
            let maxDistance = Number.MAX_VALUE;
            let segments = this.segments;
            let index = -1;
            for (let i = 0; i < segments.length; ++i) {
                let distance = Vector3D.Distance({ x: segments[i].pos.x, y: segments[i].pos.y, z: segments[i].pos.z }, { x, y, z });
                if (distance < maxDistance) {
                    index = i;
                    maxDistance = distance;
                }
            }

            return { segment: segments[index], index: index };

        }

        public ApplyGravityAndCheckForCollisions(x: number, y: number, z: number, vx: number, vy: number) {
            let segmentAndIndex = this.GetCurrentSegmentAndIndex(x, y, z);

            let segment = segmentAndIndex.segment;

            let right = new THREE.Vector3(vx, vy, 0);
            right.projectOnVector(segment.Start.right);

            let dir = new THREE.Vector3(vx, vy, 0);
            dir.projectOnVector(segment.Start.dir);

            x = x + right.x + dir.x;
            y = y + right.y + dir.y;
            z = z + right.z + dir.z;

            let result = segment.clamp(new THREE.Vector3(x, y, z), 20);
            let sign = segment.sign(vx, vy);
            let angle = segment.angle;

            if (result === null) {
                return { x: x, y: y, z: z, angle: null };
            }
            return {
                x: result.x,
                y: result.y,
                z: result.z,
                angle: angle,
            };
        }


        public ApplyCheckForCollisions(x: number, y: number, z: number, vx: number, vy: number) {
            let segmentAndIndex = this.GetCurrentSegmentAndIndex(x, y, z);

            let segment = segmentAndIndex.segment;//segments[index];

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


        //ApplyGravityAndCheckForCollisions
        public nextPoint(x: number, y: number, z: number) {
            let maxDistance = Number.MAX_VALUE;
            let points = this.points;
            let index = -1;
            for (let i = 0; i < points.length; ++i) {
                let point = points[i];
                let dX = point.Position.x - x;
                let dY = point.Position.y - y;
                let distance = Vector3D.Distance({ x: point.Position.x, y: point.Position.y, z: point.Position.z }, { x, y, z });
                if (distance < 50) {
                    continue;
                }
                let dot = point.dir.x * dX + point.dir.y * dY;
                if (dot > 0) {
                    if (distance < maxDistance) {
                        index = i;
                        maxDistance = distance;
                    }

                }
            }

            return points[index].Position;
        }
    }
}
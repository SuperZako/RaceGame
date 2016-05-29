/// <reference path="TrackVertex.ts"/>

namespace RacingGame.Tracks {
    export class TrackSegment {
        line: THREE.Line3;
        pos: THREE.Vector3;
        angle: number;
        delta: THREE.Vector3;

        public get Start() {
            return this.start;
        }

        public get End() {
            return this.end;
        }

        constructor(private start: TrackVertex, private end: TrackVertex) {
            this.line = new THREE.Line3(start.pos.clone(), end.pos.clone());
            this.pos = start.pos.clone().add(end.pos).multiplyScalar(0.5);
            this.delta = this.line.delta();
            this.angle = Math.atan2(end.pos.y - start.pos.y, end.pos.x - start.pos.x);


            //var geometry = new THREE.Geometry();
            //geometry.vertices.push(this.line.start);
            //geometry.vertices.push(this.line.end);

            //var lineMesh = new THREE.Line(
            //    geometry,//the line3 geometry you have yet
            //    new THREE.LineBasicMaterial({ color: 0x0000ff })//basic blue color as material
            //);
            //scene.add(lineMesh);
        }

        public closestPoint(point: THREE.Vector3) {
            let side = this.side({ x: point.x, y: point.y });

            let closestPoint = this.line.closestPointToPoint(point);
            return { point: closestPoint, side: side };
        }

        public clamp(point: THREE.Vector3, max: number) {
            let closestPoint = this.line.closestPointToPoint(point);
            let d = point.clone().sub(closestPoint);

            if (d.length() > max) {
                d.clampLength(0, max - 0.1);
                return closestPoint.add(d);
            }

            return null;
        }

        public side(p1: { x: number, y: number }) {

            let p2 = this.line.start; // 有向線分 e の始点
            let p3 = this.line.end; // 有向線分 e の終点

            // 有向線分 (p2,p1), (p2,p3) の外積の z 成分を求める
            const n = p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y);

            if (n > 0)
                return 1; // 左
            else if (n < 0)
                return -1; // 右

            return 0; // 線上
        }

        public sign(vx: number, vy: number) {
            return this.delta.x * vx + this.delta.y * vy;
        }
    }
}
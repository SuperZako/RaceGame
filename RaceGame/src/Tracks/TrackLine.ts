/// <reference path="TrackVertex.ts"/>

namespace RacingGame.Tracks {
    export class TrackSegment {
        line: THREE.Line3;
        pos: THREE.Vector3;
        angle: number;
        delta: THREE.Vector3;
        constructor(start: THREE.Vector3, end: THREE.Vector3) {
            this.line = new THREE.Line3(start, end);
            this.pos = start.clone().add(end).multiplyScalar(0.5);
            this.delta = this.line.delta();
            this.angle = Math.atan2(end.y - start.y, end.x - start.x);


            //var geometry = new THREE.Geometry();
            //geometry.vertices.push(this.line.start);
            //geometry.vertices.push(this.line.end);

            //var lineMesh = new THREE.Line(
            //    geometry,//the line3 geometry you have yet
            //    new THREE.LineBasicMaterial({ color: 0x0000ff })//basic blue color as material
            //);
            //scene.add(lineMesh);
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

        public sign(vx: number, vy: number) {
            return this.delta.x * vx + this.delta.y * vy;
        }
    }

    export class TrackLine {
        protected splinePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-400, -400, 0),
            new THREE.Vector3(400, -400, 0),
            new THREE.Vector3(1400, -400, 0),
            new THREE.Vector3(400, 400, 0),
            new THREE.Vector3(-400, 400, 0),
        ]);

        geometry = new THREE.Geometry();

        points: TrackVertex[] = [];
        segments: TrackSegment[] = [];

        constructor(scene: THREE.Scene) {
            let splinePath = this.splinePath;
            let geometry = this.geometry;
            let vertices = geometry.vertices;
            (<any>splinePath).closed = true;


            for (let point of splinePath.getPoints(50)) {
                vertices.push(point);
            }


            var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
            var splineObject = new THREE.Line(geometry, material);



            for (let i = 0; i < vertices.length - 1; ++i) {
                let length = vertices.length;
                let vertex = vertices[i].clone();
                let nextVertex = vertices[i + 1].clone();

                var axis = new THREE.AxisHelper(5);
                axis.position.set(vertex.x, vertex.y, vertex.z);

                let dir = nextVertex.clone().sub(vertex);
                let up = new THREE.Vector3(0, 0, 1);
                let right = new THREE.Vector3();
                dir.normalize();
                up.normalize();
                right.crossVectors(dir, up);
                right.normalize();



                this.points.push(new TrackVertex(vertex.clone(), right.clone(), up.clone(), dir.clone()));
                this.segments.push(new TrackSegment(vertex.clone(), nextVertex.clone()));

                axis.setRotationFromMatrix(new THREE.Matrix4().makeBasis(right, dir, up));


                splineObject.add(axis);
            }

            let vertices2: THREE.Vector3[] = [];
            for (let point of this.points) {
                vertices2.push(point.pos.clone().add(point.right.clone().multiplyScalar(20)));
            }
            let path = new THREE.CatmullRomCurve3(vertices2);
            (<any>path).closed = true;

            let right = new THREE.Geometry();


            for (let point of path.getPoints(5000)) {
                right.vertices.push(point);
            }

            var lineMesh = new THREE.Line(
                right,//the line3 geometry you have yet
                new THREE.LineBasicMaterial({ color: 0x0000ff })//basic blue color as material
            );

            scene.add(lineMesh);


            let vertices3: THREE.Vector3[] = [];
            for (let point of this.points) {
                vertices3.push(point.pos.clone().add(point.right.clone().multiplyScalar(-20)));
            }
            let path2 = new THREE.CatmullRomCurve3(vertices3);
            (<any>path2).closed = true;

            let left = new THREE.Geometry();
            let leftTop = new THREE.Geometry();

            for (let point of path2.getPoints(5000)) {
                left.vertices.push(point);
                leftTop.vertices.push(new THREE.Vector3(point.x, point.y, point.z + 3));
            }

            var lineMesh2 = new THREE.Line(
                leftTop,//the line3 geometry you have yet
                new THREE.LineBasicMaterial({ color: 0x0000ff })//basic blue color as material
            );

            scene.add(lineMesh2);


            //----------------------------------------------------------------
            // パラメトリック関数の定義
            let length = left.vertices.length;
            let i = 0;
            var paramFunc = (u: number, v: number) => {
                if (i % 2 === 0) {
                    let index = i / 2;
                    ++i;
                    return left.vertices[index];
                } else {
                    let index = (i - 1) / 2;
                    ++i;
                    return right.vertices[index];
                }

            };             

            let texture = new THREE.TextureLoader().load("textures/Road.png");
            //let texture = new THREE.TextureLoader().load("textures/grdrla.jpg");
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.x = 1;
            texture.repeat.y = 100;
            var param = new THREE.Mesh(
                new THREE.ParametricGeometry(paramFunc, 1, length - 1),
                // paramFuncに従って、uは8段階、vは32段階でパラメトリック曲面を作成
                new THREE.MeshLambertMaterial({
                    //color: 0x00ff00,
                    map: texture,
                })
            );
            scene.add(param);
            //----------------------------------------------------------------
            length = left.vertices.length;
            i = 0;
            var paramFunc = (u: number, v: number) => {
                if (i % 2 === 0) {
                    let index = i / 2;
                    ++i;
                    return leftTop.vertices[index];
                } else {
                    let index = (i - 1) / 2;
                    ++i;
                    return left.vertices[index];
                }

            };

            let texturegrdrla = new THREE.TextureLoader().load("textures/grdrla.jpg");
            texturegrdrla.wrapS = texturegrdrla.wrapT = THREE.RepeatWrapping;
            texturegrdrla.repeat.x = 1;
            texturegrdrla.repeat.y = 10;
            var param = new THREE.Mesh(
                new THREE.ParametricGeometry(paramFunc, 1, length - 1),
                // paramFuncに従って、uは8段階、vは32段階でパラメトリック曲面を作成
                new THREE.MeshLambertMaterial({
                    //color: 0x00ff00,
                    map: texturegrdrla,
                    side: THREE.DoubleSide
                })
            );
            scene.add(param);


            scene.add(splineObject);
        }
    }
}
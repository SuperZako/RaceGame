
/// <reference path="RoadSegment.ts"/>

class Turn extends RoadSegment {

    private xc: number;
    private yc: number;

    constructor(scene: THREE.Scene, private startAngle: number, private endAngle: number, private radius: number, private width: number) {
        super();


        this.xc = RoadSegment.end.x - radius * Math.cos(startAngle);
        this.yc = RoadSegment.end.y - radius * Math.sin(startAngle);

        // パラメトリック関数の定義
        var paramFunc = (u: number, v: number) => {
            let r = radius + (u - 0.5) * width;
            let theta = v * (endAngle - startAngle) + startAngle;

            let z = 0;

            if (u === 0.0) {
                z = 2.0;
            }

            if (u === 1.0) {
                z = 2.0;
            }

            // 作ったX・Y・Z座標のベクトルを返す。
            return new THREE.Vector3(r * Math.cos(theta) + this.xc, r * Math.sin(theta) + this.yc, z);
        };

        var param = new THREE.Mesh(
            new THREE.ParametricGeometry(paramFunc, 32, 32),
            // paramFuncに従って、uは8段階、vは32段階でパラメトリック曲面を作成
            new THREE.MeshLambertMaterial({ color: 0x00ff00 })
        );



        param.rotateX(-MathHelper.Pi / 2);

        scene.add(param);

        let v = this.getWorldCoordinate(radius, endAngle);
        RoadSegment.end.set(v.x, v.y);
        RoadSegment.collidableMeshList.push(param);
    }


    public getWorldCoordinate(r: number, theta: number) {
        let x0 = this.xc;
        let y0 = this.yc;
        let x = x0 + r * Math.cos(theta);
        let y = y0 + r * Math.sin(theta);
        return { x, y }
    }

    public getTrackCoordinate(x: number, y: number) {
        let dx = x - this.xc;
        let dy = y - this.yc;
        let r = Math.sqrt(dx * dx + dy * dy);
        let theta = Math.atan2(dy, dx);

        if (theta < 0)
            theta += MathHelper.TwoPi;

        if (this.endAngle > theta && theta >= this.startAngle)
            return { r, theta };
        else
            return null;
    }

    public adjustPosition(car: Car2D) {

        let v = this.getTrackCoordinate(-car.Position.x, car.Position.y);

        

        let radius = this.radius;
        if (v.r > radius + this.width / 2) {
            v.r = radius + this.width / 2;
            car.VelocityWorld.multiplyScalar(0.9);

            car.Angle = v.theta + 0.2;
        }
        if (v.r < radius - this.width / 2) {
            v.r = radius - this.width / 2;
            car.VelocityWorld.multiplyScalar(0.9);

            car.Angle = v.theta;
        }



        let point = this.getWorldCoordinate(v.r, v.theta);
        car.Position.x = -point.x;
        car.Position.y = point.y;

        return { distance: 0, fromCenter: 0, height: 0, theta: 0 };
    }
}
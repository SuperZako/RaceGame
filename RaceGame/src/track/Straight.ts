/// <reference path="../geometry/BSpline.ts"/>
/// <reference path="RoadSegment.ts"/>

class Straight extends RoadSegment {

    private x0: number;
    private y0: number;

    constructor(
        scene: THREE.Scene,
        private distance: number,
        private width: number,
        private angle: number,
        private startHeight: number,
        private endHeight: number,
        private tolerance = 2.0) {
        super();

        var points = [[0, startHeight], [distance * 1 / 3, startHeight], [distance * 2 / 3, endHeight], [distance, endHeight]];
        var spline = new BSpline(points, 2); //making BSpline

        this.x0 = RoadSegment.end.x;
        this.y0 = RoadSegment.end.y;

        RoadSegment.angle += angle;


        let x0 = this.x0;
        let y0 = this.y0;

        // パラメトリック関数の定義
        var paramFunc = (u: number, v: number) => {

            let x = (u - 0.5) * width;
            let y = v * distance;
            let p = this.getWorldCoordinate(y, x);


            //let t = 2 * v - 1; 
            //t *= 6;
            let h = this.getHeight(v);//(endHeight - startHeight) / (1 + Math.pow(Math.E, -t)) + startHeight;
            let z = spline.calcAt(v)[1];

            if (u === 0.0) {
                z = 2.0 + spline.calcAt(v)[1];
            }

            if (u === 1.0) {
                z = 2.0 + spline.calcAt(v)[1];
            }

            // 作ったX・Y・Z座標のベクトルを返す。
            return new THREE.Vector3(p.x, p.y, /*z*/h);
        };

        var param = new THREE.Mesh(
            new THREE.ParametricGeometry(paramFunc, 32, 32),
            // paramFuncに従って、uは8段階、vは32段階でパラメトリック曲面を作成
            new THREE.MeshLambertMaterial({ color: 0x00ff00 })
        );



        param.rotateX(-MathHelper.Pi / 2);

        scene.add(param);

        let v = this.getWorldCoordinate(distance, 0);
        RoadSegment.end.set(v.x, v.y);
    }

    public getHeight(t: number) {
        // t:0 to 1
        t = 2 * t - 1;
        t *= 6;
        return (this.endHeight - this.startHeight) / (1 + Math.pow(Math.E, -t)) + this.startHeight;
    }

    public getNormalAngle(t: number) {
        let h1 = this.getHeight(t);
        let h2 = this.getHeight(t + 0.01);
        let x = 0.01 * this.distance;
        return Math.atan2(h2 - h1, x);
    }
    public getWorldCoordinate(distance: number, fromCenter: number) {
        let angle = this.angle;

        let x0 = this.x0;
        let y0 = this.y0;

        let x = x0 + fromCenter * Math.cos(angle) - distance * Math.sin(angle);
        let y = y0 + fromCenter * Math.sin(angle) + distance * Math.cos(angle);

        return { x, y }
    }

    public getTrackCoordinate(x: number, y: number) {
        let angle = this.angle;

        let x0 = this.x0;
        let y0 = this.y0;

        let fromCenter = (x - x0) * Math.cos(angle) + (y - y0) * Math.sin(angle);
        let distance = -(x - x0) * Math.sin(angle) + (y - y0) * Math.cos(angle);
        let height = this.getHeight(distance / this.distance);
        let theta = this.getNormalAngle(distance / this.distance);
        if (this.distance > distance && distance >= 0 && (Math.abs(fromCenter) - this.width / 2) < this.tolerance)
            return { distance, fromCenter, height, theta };
        else
            return null;
    }

    public adjustPosition(car: Car2D) {
        //console.log("x:" + car.Position.x + " y:" + car.Position.y);
        let angle = this.angle - car.Angle;
        //console.log("angle:" + angle);
        let v = this.getTrackCoordinate(-car.Position.x, car.Position.y);

        if (v.fromCenter > this.width / 2) {
            v.fromCenter = this.width / 2;

            car.VelocityWorld.multiplyScalar(0.7);
            if (-MathHelper.PiOver2 <= angle && angle <= MathHelper.PiOver2) {
                car.Angle = this.angle + 0.1;
            } else {
            }
        }
        if (v.fromCenter < -this.width / 2) {
            v.fromCenter = -this.width / 2;

            car.VelocityWorld.multiplyScalar(0.7);
            if (-MathHelper.PiOver2 <= angle && angle <= MathHelper.PiOver2) {
                car.Angle = this.angle;
            } else {
            }
        }



        let point = this.getWorldCoordinate(v.distance, v.fromCenter);
        car.Position.x = -point.x;
        car.Position.y = point.y;

        return v;
    }
}
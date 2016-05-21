
/// <reference path="Track.ts"/>
/// <reference path="Straight.ts"/>
/// <reference path="Turn.ts"/>

class TestTrack extends Track {
    constructor(scene: THREE.Scene) {
        super();
        this.addSegment(new Straight(scene, 400, 40, 0, 0, 0));
        //this.addSegment(new Straight(scene, 200, 40, -MathHelper.Pi / 8));
        this.addSegment(new Turn(scene, 0, MathHelper.Pi, 100, 40));
        this.addSegment(new Straight(scene, 400, 40, MathHelper.Pi, 100, 0));
        this.addSegment(new Turn(scene, MathHelper.Pi, MathHelper.TwoPi, 100, 40));
    }

    public setSegmentIndex(car: Car2D) {
        let segments = this.segments;

        for (let i = 0; i < segments.length; ++i) {
            let v = segments[i].getTrackCoordinate(-car.Position.x, car.Position.y);

            if (v !== null) {
                this.segmentIndex = i;
                return;
            }
        }
    }

    public getTrackPositionMatrix(car: TestCar) {
        let segments = this.segments;

        var index = this.segmentIndex;

        let segment = segments[index];
        let v = segment.getTrackCoordinate(-car.Position.x, car.Position.y);


    }

    public adjustPosition(car: Car2D) {
        let segments = this.segments;
        {
            if (this.segmentIndex - 1 > 0)
                var index = this.segmentIndex - 1;
            else
                var index = segments.length - 1;

            let segment = segments[index];
            let v = segment.getTrackCoordinate(-car.Position.x, car.Position.y);
            if (v !== null) {
                let h = segment.adjustPosition(car);
                this.segmentIndex = index;
                return h;
            }
        }

        {
            let index = this.segmentIndex;
            let segment = segments[index];
            let v = segment.getTrackCoordinate(-car.Position.x, car.Position.y);
            if (v !== null) {
                let h = segment.adjustPosition(car);

                this.segmentIndex = index;
                return h;
            }
        }



        {
            if (this.segmentIndex + 1 < this.segments.length)
                var index = this.segmentIndex + 1;
            else
                var index = 0;

            let segment = segments[index];
            let v = segment.getTrackCoordinate(-car.Position.x, car.Position.y);
            if (v !== null) {
                let h = segment.adjustPosition(car);
                this.segmentIndex = index;
                return h;
            }
        }
        //for (let segment of this.segments) {
        //    let v = segment.getTrackCoordinate(-car.Position.x, car.Position.y);

        //    if (v !== null) {
        //        segment.adjustPosition(car);
        //    }
        //}
    }
}

/// <reference path="Track.ts"/>
/// <reference path="Straight.ts"/>
/// <reference path="Turn.ts"/>

class TestTrack extends Track {
    constructor(scene: THREE.Scene) {
        super();
        this.addSegment(new Straight(scene, 200, 40, MathHelper.Pi / 8));
        this.addSegment(new Straight(scene, 200, 40, -MathHelper.Pi / 8));
        this.addSegment(new Turn(scene, 0, MathHelper.Pi / 2, 100, 40));
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

    public adjustPosition(car: Car2D) {
        let segments = this.segments;
        if (this.segmentIndex - 1 > 0) {
            let index = this.segmentIndex - 1;
            let segment = segments[index];
            let v = segment.getTrackCoordinate(-car.Position.x, car.Position.y);
            if (v !== null) {
                segment.adjustPosition(car);
                this.segmentIndex = index;
                return;
            }
        }

        {
            let index = this.segmentIndex;
            let segment = segments[index];
            let v = segment.getTrackCoordinate(-car.Position.x, car.Position.y);
            if (v !== null) {
                segment.adjustPosition(car);
                this.segmentIndex = index;
                return;
            }
        }
       


        if (this.segmentIndex + 1 < this.segments.length) {
            let index = this.segmentIndex + 1;
            let segment = segments[index];
            let v = segment.getTrackCoordinate(-car.Position.x, car.Position.y);
            if (v !== null) {
                segment.adjustPosition(car);
                this.segmentIndex = index;
                return;
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
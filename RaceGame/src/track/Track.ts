

class Track {
    protected segments: RoadSegment[] = [];
    protected segmentIndex = 0;

    public addSegment(segment: RoadSegment) {
        let segments = this.segments;
        segments.push(segment);
    }

    public getTrackCoordinate(position: THREE.Vector3) {
        return <THREE.Vector2>null;
    }

    public setSegmentIndex(car: Car2D) {

    }

    public adjustPosition(car: Car2D) {
        return { distance: 0, fromCenter: 0, height: 0, theta: 0 };
    }
}



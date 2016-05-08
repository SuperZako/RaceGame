

class Track {
    public addSegment(segment: RoadSegment) {
        let segments = this.segments;
        segments.push(segment);
    }
    private segments: RoadSegment[] = [];
}



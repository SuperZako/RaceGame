﻿

class RoadSegment {

    static end = new THREE.Vector2();
    static angle = 0;

    public getTrackCoordinate(x: number, y: number) {
    }

    public getWorldCoordinate(distance: number, fromCenter: number) {
    }

    public adjustPosition(car: Car2D) {
        return { distance: 0, fromCenter: 0, height: 0, theta: 0 };
    }
}
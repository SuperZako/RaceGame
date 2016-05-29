/// <reference path="Car3D.ts"/>


class CPUCar extends Car3D {


    constructor(scene: THREE.Scene, track: RacingGame.Tracks.Track) {
        super(scene, track);
    }

    public Update(dt: number) {
        let point = this.track.nextPoint(this._group.position.x, this._group.position.y);

        let x = (point.x - this._group.position.x);
        let y = (point.y - this._group.position.y);

        let angle = -this.Angle;
        let deltaX = x * Math.cos(angle) + y * Math.sin(angle);
        let deltaY = -x * Math.sin(angle) + y * Math.cos(angle);


        if (Math.abs(deltaX) < 5) {
            this.SteerAngle *= 0.5;
        } else if (deltaX > 0) {
            this.SteerAngle = Math.min(this.SteerAngle + 0.014, +0.4);
            
        } else if (deltaX < 0) {
            this.SteerAngle = Math.max(this.SteerAngle - 0.014, -0.4);
            //} else {
            //    this.SteerAngle *= 0.5;
        }




        if (this.IsFrontSlipping || this.IsRearSlipping) {
            this.Brake = 1;
            this.Throttle = 0.0;
        } else {
            this.Throttle = 0.1;
            this.Brake = 0;
        }

        //document.getElementById("info").innerHTML = "Speed:" + this.Speed;


        if (this.Speed > 180) {
            this.Brake = 1;
            this.Throttle = 0.0;
        } 

        super.Update(dt);


    }
}
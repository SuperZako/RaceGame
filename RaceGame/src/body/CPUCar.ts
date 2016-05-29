/// <reference path="Car3D.ts"/>


class CPUCar extends Car3D {


    constructor(scene: THREE.Scene, track: RacingGame.Tracks.Track) {
        super(scene, track);
    }

    public Update(dt: number) {
        let point = this.track.nextPoint(this.Position.x, this.Position.y);



        let x = (point.x - this.Position.x);
        let y = (point.y - this.Position.y);

        let angle = -this.Angle;
        let deltaX = x * Math.cos(angle) + y * Math.sin(angle);
        let deltaY = -x * Math.sin(angle) + y * Math.cos(angle);

        this._meshWheelFrontLeft.position.set(this.Position.x + deltaX, this.Position.y + deltaY, point.z);

        //document.getElementById("info").innerHTML = "deltaY:" + deltaY;
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

        document.getElementById("info").innerHTML = "Speed:" + this.Speed;


        if (this.Speed > 180) {
            this.Brake = 1;
            this.Throttle = 0.0;
        } 

        super.Update(dt);


    }
}
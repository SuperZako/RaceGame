


class Formula1Car2D extends Car2D {
    constructor() {
        super();
        this.Mass = 1500;
        this.WheelRadius = 1;
        this.WheelLength = this.WheelRadius * 6.283185;
        this.FrontAxleDistance = 4.47;
        this.RearAxleDistance = 4.5;
        this.WheelBase = this.FrontAxleDistance + this.RearAxleDistance;
        this.Height = 4;
        this.FrontWeight = this.RearAxleDistance / this.WheelBase * this.Mass * 9.81;
        this.RearWeight = this.FrontAxleDistance / this.WheelBase * this.Mass * 9.81;
        this.Inertia = 2800;
        this.MaxGripFront = 24;
        this.MaxGripRear = 24.1;
        this.TireMu = 2;
        this.DragFront = 0.3;
        this.DragSide = 0.3;
        this.FrontCornerStiffness = -40;
        this.RearCornerStiffness = -40;
        this.DownforceDouble = 600;
        this.GearRatios = [2.33, 3.6, 2.3, 1.71, 1.39, 1.16, 0.94, 0.8];
        this.DifferentialRatio = 4.42;
        this.CoeffBraking = 200000;
        this.TorqueStart = 60000;
        this.TorqueMax = 65000;
        this.TorqueEnd = 0.0;
        this.RpmStart = 6000;
        this.RpmChangeDown = 11000;
        this.RpmOptimal = 16000;
        this.RpmChangeUp = 16000;
        this.RpmRedLine = 18000;
        this.CurrentGear = 1;
        this.IsAutomatic = true;
    }
}

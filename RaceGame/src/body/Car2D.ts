/// <reference path="../Helpers/MathHelper.ts"/>

class Car2D {
    public DownforceDouble = 600;
    public Efficiency = 0.7;
    public GearRatios = [2.9, 2.66, 1.78, 1.3, 1, 0.74];
    public DifferentialRatio = 5.42;
    public CoeffBraking = 12000;
    public TorqueStart = 395;
    public TorqueMax = 475;
    public TorqueEnd = 390;
    public RpmStart = 1000;
    public RpmOptimal = 4400;
    public RpmRedLine = 6000;
    public RpmChangeDown = 3000;
    public RpmChangeUp = 5500;
    private _currentGear = 1;
    public AccelerationLocal = new THREE.Vector2();//Vector2.Zero;
    public AccelerationWorld = new THREE.Vector2();//Vector2.Zero;
    public VelocityLocal = new THREE.Vector2();//Vector2.Zero;
    public VelocityWorld = new THREE.Vector2();//Vector2.Zero;
    public CoeffDrag = 0.42;
    public CoeffRollingResistance = 12.8;
    public Mass = 0;
    public WheelRadius = 0;
    public WheelLength = 0;
    public IsAutomatic: boolean;
    public FrontAxleDistance = 0;
    public RearAxleDistance = 0;
    public Height = 0;
    public FrontWeight = 0;
    public RearWeight = 0;
    public WheelBase = 0;
    public Inertia = 0;
    public MaxGripFront = 0;
    public MaxGripRear = 0;
    public TireMu = 0;
    public FrontCornerStiffness = 0;
    public RearCornerStiffness = 0;
    public DragFront = 0;
    public DragSide = 0;
    public CurrentFrontWeight = 0;
    public CurrentRearWeight = 0;
    public Angle = 0;
    public AngularVelocity = 0;
    public SteerAngle = 0;
    public Throttle = 0;
    public Brake = 0;
    private ForceTraction = 0;
    private ForceBraking = 0;
    public ForceLong = 0;
    private ForceDragLong = 0;
    private ForceDragSide = 0;
    private ForceRollingResistance = 0;
    private ForceDrive = 0;
    private TorqueDrive = 0;
    private MaxTorque = 0;
    public Speed = 0;
    public Position = new THREE.Vector2();//
    public DegreeOfRotationPerFrame = 0;
    public DegreeOfRotationPerSecond = 0;

    get CurrentGear() {
        return this._currentGear;
    }

    set CurrentGear(value: number) {
        this._currentGear = MathHelper.Clamp(value, 0.0, this.GearRatios.length - 1);
    }


    get Direction() {
        return this._currentGear == 0 ? -1 : 1;
    }

    private _IsFrontSlipping = false;
    get IsFrontSlipping() { return this._IsFrontSlipping; }

    private _IsRearSlipping = false;
    get IsRearSlipping() { return this._IsRearSlipping; }

    private _ForceWheelSpin = 0;
    get ForceWheelSpin() { return this._ForceWheelSpin; }
    set ForceWheelSpin(value: number) { this._ForceWheelSpin = value; }

    private _Kph = 0;
    get Kph() { return this._Kph; }

    private _Mph = 0;
    get Mph() { return this._Mph; }

    private _RpsWheel = 0;
    get RpsWheel() { return this._RpsWheel; }

    private _RpmWheel = 0;
    get RpmWheel() { return this._RpmWheel; }

    private _RpmEngine = 0;
    get RpmEngine() { return this._RpmEngine; }

    private Pow3(x: number) {
        return x * x * x;
    }

    private EaseIn(t: number, b: number, c: number) {
        return c * this.Pow3(t) + b;
    }

    private EaseOut(t: number, b: number, c: number) {
        return c * (this.Pow3(t - 1) + 1) + b;
    }

    private GetTorqueCurve(rpm: number) {
        if (rpm <= this.RpmStart)
            rpm = this.RpmStart;
        if (rpm <= this.RpmOptimal)
            return Math.max(0.0, this.EaseOut(((rpm - this.RpmStart) * (1.0 / this.RpmOptimal)), this.TorqueStart, this.TorqueMax - this.TorqueStart));
        return Math.max(0.0, this.EaseIn(((rpm - this.RpmOptimal) * (1.0 / (this.RpmRedLine - this.RpmOptimal))), this.TorqueMax, - (this.TorqueMax - this.TorqueEnd)));
    }

    private GetRpmWheel(dt: number) {
        dt = Math.max(dt, 0.0166667);
        this.DegreeOfRotationPerFrame = this.VelocityLocal.x / this.WheelLength * dt * 360;
        this.DegreeOfRotationPerSecond = this.DegreeOfRotationPerFrame / dt;
        this.RpsWheel = this.DegreeOfRotationPerSecond / 360;
        this.Kph = (this.RpsWheel * this.WheelLength * 3600.0 / 1000.0);
        this.Mph = this.Kph / 1.609344;
        this.RpmWheel = this.RpsWheel * 60;
        return this.RpmWheel;
    }

    private GetRpmEngine(dt: number) {
        this.RpmEngine = Math.abs(this.GetRpmWheel(dt)) * this.GearRatios[this.CurrentGear] * this.DifferentialRatio;
        this.RpmEngine = Math.max(this.RpmStart, this.RpmEngine);
        if (this.IsAutomatic) {
            if (this.RpmEngine < this.RpmChangeDown && this.CurrentGear > 1)
                --this.CurrentGear;
            if (this.RpmEngine > this.RpmChangeUp)
                ++this.CurrentGear;
        }
        return this.RpmEngine;
    }

    public Reset() {
        this.Position = this.VelocityWorld = this.VelocityLocal = this.AccelerationWorld = this.AccelerationLocal = new THREE.Vector2();//Vector2.Zero;
    }

    public Update(dt: number) {
        const sin = Math.sin(this.Angle);
        const cos = Math.cos(this.Angle);
        this.VelocityLocal.x = (cos * this.VelocityWorld.y + sin * this.VelocityWorld.x);
        this.VelocityLocal.y = (- sin * this.VelocityWorld.y + cos * this.VelocityWorld.x);

        let num3 = 0.0;
        let num4 = 0.0;
        let num5 = this.WheelBase * 0.5 * this.AngularVelocity;
        if (this.VelocityLocal.x != 0.0) {
            num3 = Math.atan(num5 / this.VelocityLocal.x);
            num4 = Math.atan2(this.VelocityLocal.y, this.VelocityLocal.x);
        }
        let num6 = num4 + num3 - this.SteerAngle;
        let num7 = num4 - num3;
        if (this.VelocityLocal.x < 0.0) {
            num6 = MathHelper.WrapAngle(MathHelper.Pi - num6);
            num7 = MathHelper.WrapAngle(MathHelper.Pi - num7);
        }
        this.MaxTorque = this.GetTorqueCurve(this.GetRpmEngine(dt));
        this.TorqueDrive = this.MaxTorque * this.GearRatios[this.CurrentGear] * this.DifferentialRatio * this.Efficiency;
        this.ForceDrive = this.TorqueDrive / this.WheelRadius;
        this.Speed = Math.sqrt(this.VelocityLocal.x * this.VelocityLocal.x);
        this.ForceTraction = this.Throttle * this.Direction * this.ForceDrive;
        let coeffBraking = this.CoeffBraking;
        if (Math.abs(this.VelocityLocal.x) < 1.0)
            coeffBraking /= this.Mass;
        this.ForceBraking = (MathHelper.Sign(this.VelocityLocal.x) * this.Brake * - coeffBraking);
        this.ForceLong = this.ForceTraction + this.ForceBraking;
        this.ForceDragLong = 0.42 * this.VelocityLocal.x * this.Speed;
        this.ForceDragSide = 0.42 * this.VelocityLocal.y * Math.abs(this.VelocityLocal.y);
        this.ForceRollingResistance = 12.8 * this.VelocityLocal.x;
        let num9 = this.Height / this.WheelBase * this.Mass * this.AccelerationLocal.x;
        this.CurrentFrontWeight = this.FrontWeight - num9;
        this.CurrentRearWeight = this.RearWeight + num9;
        this.ForceWheelSpin = this.CurrentRearWeight <= 0.0 ? 0.0 : Math.max(0.0, (this.ForceLong - this.ForceDragLong - this.CurrentRearWeight * this.TireMu));
        let zero1 = { x: 0, y: 0 };// = new THREE.Vector2();//Vector2.Zero;
        zero1.x = this.ForceLong;
        let num10 = ((1.0 + Math.abs(this.VelocityLocal.x) / this.DownforceDouble) * this.Mass * 9.80000019073486 * 0.5);
        let num11 = this.FrontCornerStiffness;
        let num12 = this.RearCornerStiffness;
        if (this.VelocityWorld.length() < this.WheelBase / 2.0) {
            num11 = -0.2;
            num12 = -0.2;
        }
        let zero2 = { x: 0, y: 0 };//new THREE.Vector2();//Vector2.Zero;
        let num13 = num11 * num6;
        zero2.y = MathHelper.Clamp(num13, -this.MaxGripFront, this.MaxGripFront);
        this.IsFrontSlipping = num13 < -this.MaxGripFront || num13 > this.MaxGripFront;
        zero2.y *= num10;
        let zero3 = { x: 0, y: 0 };// new THREE.Vector2();//Vector2.Zero;
        let num14 = num12 * num7;
        zero3.y = MathHelper.Clamp(num14, -this.MaxGripRear, this.MaxGripRear);
        this.IsRearSlipping = num14 < -  this.MaxGripRear || num14 > this.MaxGripRear;
        zero3.y *= num10;
        if (this.IsFrontSlipping || this.IsRearSlipping) {
            this.ForceWheelSpin = 0.0;
        }

        zero1.x -= this.ForceWheelSpin;
        let zero4 = { x: 0, y: 0 };//new THREE.Vector2();//Vector2.Zero;
        zero4.x = - (this.ForceRollingResistance + this.DragFront * this.ForceDragLong);
        zero4.y = - (this.ForceRollingResistance + this.DragSide * this.ForceDragSide);
        let zero5 = { x: 0, y: 0 };//= new THREE.Vector2();//Vector2.Zero;
        zero5.x = zero1.x + Math.sin(this.SteerAngle) * zero2.x + zero3.x + zero4.x;
        zero5.y = zero1.y + Math.cos(this.SteerAngle) * zero2.y + zero3.y + zero4.y;
        let num15 = this.VelocityLocal.x >= this.WheelBase * 8.0 ? (this.FrontAxleDistance * zero2.y - this.RearAxleDistance * zero3.y) : (0.5 * zero2.y - 0.5 * zero3.y);
        //this.AccelerationLocal = zero5 / this.Mass;
        //this.AccelerationLocal = zero5.divideScalar(this.Mass);
        this.AccelerationLocal.x = zero5.x / this.Mass;
        this.AccelerationLocal.y = zero5.y / this.Mass;
        let num16 = num15 / this.Inertia;
        this.AccelerationWorld.x = (cos * this.AccelerationLocal.y + sin * this.AccelerationLocal.x);
        this.AccelerationWorld.y = (- sin * this.AccelerationLocal.y + cos * this.AccelerationLocal.x);


        //this.VelocityWorld += this.AccelerationWorld * dt;
        this.VelocityWorld.addScaledVector(this.AccelerationWorld, dt);
        this.AngularVelocity += num16 * dt;
        this.Angle += this.AngularVelocity * dt;

        //this.Position += this.VelocityWorld * dt;
        this.Position.addScaledVector(this.VelocityWorld, dt);
    }
}
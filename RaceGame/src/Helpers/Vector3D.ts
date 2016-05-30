interface IVector3D {
    x: number;
    y: number;
    z: number;
}


class Vector3D {

    static Length(vector: IVector3D) {
        let lengthSquared = this.LengthSquared(vector);
        return Math.sqrt(lengthSquared);
    }

    static LengthSquared(vector: IVector3D) {
        let x = vector.x;
        let y = vector.y;
        let z = vector.z;
        return x * x + y * y + z * z;
    }

    static Distance(vector1: IVector3D, vector2: IVector3D) {
        let x = vector1.x - vector2.x;
        let y = vector1.y - vector2.y;
        let z = vector1.z - vector2.z;
        return this.Length({ x, y, z });
    }

    static Dot(vector1: IVector3D, vector2: IVector3D) {
        return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
    }

    static Normalize(vector: IVector3D) {
        let length = this.Length(vector);
        vector.x /= length;
        vector.y /= length;
        vector.z /= length;
    }

    //static ProjectOnVector(vector1: IVector3D, vector2: IVector3D) {

    //    let v = { x: vector.x, y: vector.y, z: vector.z, };

    //    this.Normalize(vector);

    //    let dot = this.Dot(vector);

    //    return this.copy(v1).multiplyScalar(dot);

    //}

    static GetAngleBetweenVectors(vector1: IVector3D, vector2: IVector3D) {
        // See http://en.wikipedia.org/wiki/Vector_(spatial)
        // for help and check out the Dot Product section ^^
        // Both vectors are normalized so we can save deviding through the
        // lengths.

        let cosTheta = this.Dot(vector1, vector2) / (this.Length(vector1) * this.Length(vector2));
        return Math.acos(cosTheta);
    }
}
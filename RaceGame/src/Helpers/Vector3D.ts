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

    static Distance(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        let x = x1 - x2;
        let y = y1 - y2;
        let z = z1 - z2;
        return this.Length({ x, y, z });
    }

    static Dot(vector1: IVector3D, vector2: IVector3D) {
        return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
    }

    static GetAngleBetweenVectors(vector1: IVector3D, vector2: IVector3D) {
        // See http://en.wikipedia.org/wiki/Vector_(spatial)
        // for help and check out the Dot Product section ^^
        // Both vectors are normalized so we can save deviding through the
        // lengths.

        let cosTheta = this.Dot(vector1, vector2) / (this.Length(vector1) * this.Length(vector2));
        return Math.acos(cosTheta);
    }
}
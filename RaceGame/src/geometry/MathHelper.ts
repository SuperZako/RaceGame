

namespace MathHelper {

    export const Pi = 3.141592653589793238463;
    export const PiOver2 = Pi / 2;
    export const TwoPi = 2 * Pi;

    export function Sign(value: number) {
        return value >= 0 ? 1 : -1;
    }

    export function Clamp(value: number, min: number, max: number) {
        // First we check to see if we're greater than the max
        value = (value > max) ? max : value;

        // Then we check to see if we're less than the min.
        value = (value < min) ? min : value;

        // There's no check to see if min > max.
        return value;
    }

    /// <summary>
    /// Reduces a given angle to a value between π and -π.
    /// </summary>
    /// <param name="angle">The angle to reduce, in radians.</param>
    /// <returns>The new angle, in radians.</returns>
    export function WrapAngle(angle: number) {

        function IEEERemainder(dividend: number, divisor: number) {
            return dividend - (divisor * Math.round(dividend / divisor));
        }
        angle = IEEERemainder(angle, TwoPi);
        if (angle <= -Pi) {
            angle += TwoPi;
        }
        else {
            if (angle > Pi) {
                angle -= TwoPi;
            }
        }
        return angle;
    }
}
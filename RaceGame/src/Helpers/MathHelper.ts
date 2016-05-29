

namespace MathHelper {
    export const Pi = Math.PI;
    export const PiOver2 = Math.PI / 2;
    export const PiOver4 = Math.PI / 4.0;
    export const TwoPi = 2 * Math.PI;

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

    export function ToDegrees(radians: number) {
        // This method uses double precission internally,
        // though it returns single float
        // Factor = 180 / pi
        return radians * 180 / Pi;
    }

    export function ToRadians(degrees: number) {
        // This method uses double precission internally,
        // though it returns single float
        // Factor = pi / 180
        return degrees * Pi / 180;
    }

    export function GetDistance(x1: number, y1: number, x2: number, y2: number) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
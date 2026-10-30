# ev-power-curve

Two-phase electric drivetrain model — the motor curve behind
[sekeracing.dev/race](https://sekeracing.dev/race.html), extracted as a
zero-dependency module.

```js
import { createDrivetrain } from './power-curve.js';

const car = createDrivetrain({
  powerPerMass: 330,  // W/kg — ~1 kW on ~3 kg, 1:10-class RC
  launchAccel: 9,     // traction-limited launch, m/s²
  drag: 0.4,          // linear aero loss
  maxSpeed: 24,       // gearing clamp, m/s
});

car.step(v, throttle, dt); // integrate one frame
car.topSpeed;              // equilibrium where pull = drag
```

## The model

Every EV has the same two-phase character:

```
v < v_base   a = F/m          constant torque — the launch
v > v_base   a = P/(m·v)      constant power — pull fades with speed
```

`accelAt(v)` is the `min()` of the two. Top speed isn't a config constant —
it's where the curve meets the drag line, so retune power or drag and the
ceiling moves for physical reasons.

## Why it's worth a library

The common arcade model is a fixed acceleration plus a speed clamp — feels
fine, teaches nothing. This version gets the signature EV behavior for free:
violent off the line (in this class — ~330 W/kg is more power density than a
superbike), then a fading pull as the watts run out.

## Demo

```
node demo.js
```

Prints the launch phase boundary, equilibrium top speed, and the pull
remaining at 10–80 km/h for a 1:10-class car.

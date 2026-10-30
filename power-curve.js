// ev-power-curve — two-phase electric drivetrain model.
// Below base speed: traction-limited (flat torque). Above: power-limited,
// a = P/(m·v). Linear drag sets the equilibrium top speed. Zero dependencies.

export function createDrivetrain({
  powerPerMass, // W/kg
  launchAccel, // traction-limited launch, m/s²
  brakeDecel = 14, // m/s²
  drag, // linear drag coefficient, 1/s
  maxSpeed = Infinity, // hard clamp (gearing), m/s
}) {
  const accelAt = (v) => Math.min(launchAccel, powerPerMass / Math.max(Math.abs(v), 0.5));

  // Equilibrium: driveAccel(v) == drag·v. Launch-limited if the balance
  // lands below base speed, power-limited above it.
  const baseSpeed = powerPerMass / launchAccel;
  const equilibrium =
    launchAccel / drag <= baseSpeed
      ? launchAccel / drag
      : Math.sqrt(powerPerMass / drag);
  const topSpeed = Math.min(maxSpeed, equilibrium);

  // One integration step, dt seconds. throttle in [-1, 1].
  const step = (v, throttle, dt) => {
    let s = v + (throttle >= 0 ? throttle * accelAt(v) : throttle * brakeDecel) * dt;
    s -= s * drag * dt;
    return Math.max(-maxSpeed * 0.5, Math.min(topSpeed, s));
  };

  return { accelAt, topSpeed, baseSpeed, step };
}

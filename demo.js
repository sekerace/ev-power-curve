import { createDrivetrain } from './power-curve.js';

// The sekerace demo car — ~1 kW on ~3 kg (1:10 class)
const car = createDrivetrain({
  powerPerMass: 330,
  launchAccel: 9,
  drag: 0.4,
  maxSpeed: 24,
});

console.log(`base speed       ${car.baseSpeed.toFixed(1)} m/s — launch phase ends here`);
console.log(`top speed        ${car.topSpeed.toFixed(1)} m/s ≈ ${(car.topSpeed * 3.6).toFixed(0)} km/h`);
console.log('');

// Full-throttle run — report the pull at key speeds
let v = 0;
const dt = 1 / 60;
const marks = [10, 30, 50, 70, 80].map((k) => k / 3.6);
let t = 0;
console.log('v (km/h)  t (s)   a (m/s²)');
for (const mark of marks) {
  while (v < mark && t < 30) {
    v = car.step(v, 1, dt);
    t += dt;
  }
  console.log(`${(mark * 3.6).toFixed(0).padStart(7)}  ${t.toFixed(2).padStart(5)}  ${car.accelAt(mark).toFixed(1).padStart(5)}`);
}

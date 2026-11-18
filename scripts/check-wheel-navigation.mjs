// node --experimental-strip-types scripts/check-wheel-navigation.mjs
import assert from 'node:assert/strict';
import {createWheelNavigation, wheelPixels} from '../src/app/wheel-navigation.ts';

assert.equal(wheelPixels(3, 1, 800), 48);
assert.equal(wheelPixels(1, 2, 800), 800);
assert.equal(wheelPixels(24, 0, 800), 24);

const wheel=createWheelNavigation();
assert.equal(wheel.push(120, 0), 1, 'One mouse detent advances once');
for(let time=30;time<=1500;time+=30)assert.equal(wheel.push(12, time), 0, 'Continuous inertia cannot skip pages');
assert.equal(wheel.push(120, 1700), 1, 'Fresh gesture advances after lock and silence');
assert.equal(wheel.push(-120, 1800), 0, 'Reverse input inside the lock is consumed');
assert.equal(wheel.push(-120, 2400), -1, 'A new gesture can reverse direction');

wheel.reset();
for(let index=0;index<5;index++)assert.equal(wheel.push(8, index*20), 0);
assert.equal(wheel.push(8, 100), 1, 'Small trackpad inputs accumulate');
wheel.reset();
assert.equal(wheel.push(30, 0), 0);
assert.equal(wheel.push(-30, 20), 0);
assert.equal(wheel.push(-15, 40), -1, 'Reversal clears prior direction intent');
wheel.reset();
assert.equal(wheel.push(30, 0), 0);
assert.equal(wheel.push(20, 300), 0, 'Separated jitter does not accumulate');
assert.equal(wheel.allowReading(320), true);
assert.equal(wheel.push(120, 400), 0, 'Reaching a reading boundary does not continue into the next page');
assert.equal(wheel.push(120, 600), 1, 'A fresh gesture after reading may advance');
wheel.lock(1000);
assert.equal(wheel.push(120, 1500), 0, 'Button navigation also locks trailing input');
assert.equal(wheel.push(120, 1800), 1);
assert.equal(wheel.allowReading(1850), false, 'New-page content stays fixed during transition');
assert.equal(wheel.allowReading(2300), false, 'Reading also respects the transition lock');
assert.equal(wheel.allowReading(2500), true, 'Fresh reading resumes after lock and silence');
assert.equal(wheel.allowReading(2520), true, 'Reading can continue inside the same page');
assert.equal(wheel.push(120, 2540), 0, 'Reading inertia is held at its boundary');
assert.equal(wheel.push(120, 2740), 1);
wheel.reset();
assert.equal(wheel.push(Number.NaN, 0), 0);
assert.equal(wheel.push(0, 10), 0);
console.log('Wheel navigation checks passed');

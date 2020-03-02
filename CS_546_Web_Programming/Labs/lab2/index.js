var arrUtils = require('./arrayUtils');
var strUtils = require('./stringUtils');
var objUtils = require('./objUtils');

// Head Tests
try {
    // Should Pass
    const headOne = arrUtils.head([2, 3, 4]);
    console.log('head passed successfully');
} catch (e) {
    console.error('head failed test case');
}
try {
    // Should Fail
    const headTwo = arrUtils.head(123);
    console.error('head did not error');
} catch (e) {
    console.log('head failed successfully');
}

// Capitalize Tests
try {
    // Should Pass
    const cap1 = strUtils.capitalize('HeLlO jAvaSCRipt!');
    console.log('capitalize passed successfully');
} catch (e) {
    console.error('capitalize failed test case');
}
try {
    // Should Fail
    const cap2 = strUtils.capitalize(123)
    console.error('capitalize did not error');
} catch (e) {
    console.log('capitalize failed successfully');
}

// Repeat Tests
try {
    // Should Pass
    const repeat1 = strUtils.repeat('abc', 3);
    console.log('repeat passed successfully');
} catch (e) {
    console.error('repeat failed test case');
}
try {
    // Should Fail
    const repeat2 = strUtils.repeat('abc');
    console.error('repeat did not error');
} catch (e) {
    console.log('repeat failed successfully');
}

// Smush Tests

const first = { x: 2, y: 3};
const second = { a: 70, x: 4, z: 5 };
const third = { x: 0, y: 9, q: 10 };

try {
    // Should Pass
    const smush1 = objUtils.smush(first, second, third);
    console.log('smush passed successfully');
} catch (e) {
    console.error('smush failed test case');
}
try {
    // Should Fail
    const smush2 = objUtils.smush(first);
    console.error('smush did not error');
} catch (e) {
    console.log('smush failed successfully');
}


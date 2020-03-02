// console.log('123'+'7');
// console.log(123+7);
var arrUtils = require('./arrayUtils');
var strUtils = require('./stringUtils');
var objUtils = require('./objUtils');

// array Tests
/*try {
    // 
   //  const headt = arrUtils.head([]);
   //  const lastt = arrUtils.last([1,2,2,2,2,2,3,4,2,45,567,6,23049,10]);
   //  const counte = arrUtils.countElements([]);
   //  const isequalt = arrUtils.isEqual('wrong',[123, 7]);
   //  const ranget = arrUtils.range('1');
   //  const ranget1 = arrUtils.range(4, 'hi');
    const removet = arrUtils.remove([1,2], 3);
    console.log(removet);
    console.log('array passed successfully');
 } catch (e) {
    console.error(e);
    console.error('array failed test case');
 }*/

 // string Tests
/*try {
    // Should Pass
   // const cap = strUtils.capitalize(123);
   //  const cap1 = strUtils.capitalize('FOOBAR');
   //  const countc = strUtils.countChars("12312312312");
   //  const repeatt = strUtils.repeat("ok", 1);
   //  const repeatt1 = strUtils.repeat('abc', 1);
    
   console.log(repeatt);
   console.log('string passed successfully');
 } catch (e) {
   console.error(e);
   console.error('string failed test case');
 }*/

 // object Tests
try {
    // Should Pass

    const first = { x: 2, y: 3};
    const second = { a: 70, x: 4, z: 5 };
    const third = { x: 0, y: 9, q: 10 };

   //  const ext = objUtils.extend();
   //  const map1 = objUtils.mapValues(first, n => n+1);
    const smush1 = objUtils.smush(first);
   //  const smush1 = objUtils.smush(third, first, second);
    
    console.log(smush1);
    console.log('object passed successfully');
 } catch (e) {
    console.error(e);
    console.error('object failed test case');
 }

 

 




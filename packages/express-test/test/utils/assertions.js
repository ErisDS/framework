/**
 * Custom Should Assertions
 *
 * Add any custom assertions to this file.
 */

// Example Assertion
// should.Assertion.add('ExampleAssertion', function () {
//     this.params = {operator: 'to be a valid Example Assertion'};
//     this.obj.should.be.an.Object;
// });

const {matchSnapshot} = require('./snapshot');

should.Assertion.add('matchSnapshot', matchSnapshot);

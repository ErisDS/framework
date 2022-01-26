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

const {matchSnapshotAssertion} = require('./snapshot');

should.Assertion.add('matchSnapshot', matchSnapshotAssertion);

should.Assertion.add('matchHeaderSnapshot', matchSnapshotAssertion);

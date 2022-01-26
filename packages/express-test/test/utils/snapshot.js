const {SnapshotState, toMatchSnapshot} = require('jest-snapshot');

function matchSnapshot() {
    this.params = {operator: 'to match a stored snapshot'};
    console.log('this.obj', this.obj);
    console.log('everything', arguments, this);

    const testFile = should.config.snapshotFilename;
    const testTitle = should.config.snapshotNameTemplate;
    const willUpdate = process.env.SNAPSHOT_UPDATE ? 'all' : 'new';

    console.log('willUpdate', willUpdate);

    // Intilize the SnapshotState, it’s responsible for actually matching
    // actual snapshot with expected one and storing results to `__snapshots__` folder
    const snapshotState = new SnapshotState(testFile, {
        updateSnapshot: willUpdate
    });

    // Bind the `toMatchSnapshot` to the object with snapshotState and
    // currentTest name, as `toMatchSnapshot` expects it as it’s `this`
    // object members
    const matcher = toMatchSnapshot.bind({
        snapshotState,
        currentTestName: testTitle
    });

    // Execute the matcher
    const result = matcher(this.obj);

    // Store the state of snapshot, depending on updateSnapshot value
    snapshotState.save();

    console.log(result);

    this.params.message = result.message();
    this.assert(result.pass.should.eql(true));
}

beforeEach(function () {
    const {currentTest} = this;
    should.config.snapshotFilename = currentTest.file + '.snap';
    should.config.snapshotNameTemplate = currentTest.fullTitle();
});

module.exports = {
    matchSnapshot
};

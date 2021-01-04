const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    const copyTests = Array.from(tests);
    const regex = /[/\\]+([a-zA-Z0-9-_]+)(\.spec)*\.js$/;
    const out = [];
    const priority = ['unreactive', 'gql', 'install', 'http'];
    priority.forEach(test => {
      out.push(copyTests.find(x => regex.exec(x.path)[1] === test));
    });
    copyTests.forEach(x => {
      if (!priority.includes(regex.exec(x.path)[1])) {
        out.push(x);
      }
    });
    return out;
  }
}

module.exports = CustomSequencer;

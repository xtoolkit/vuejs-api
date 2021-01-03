const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    const copyTests = Array.from(tests);
    const regex = /[/\\]+([a-zA-Z0-9-_]+)(\.spec)*\.js$/;
    const out = [];
    out.push(copyTests.find(x => regex.exec(x.path)[1] === 'unreactive'));
    out.push(copyTests.find(x => regex.exec(x.path)[1] === 'install'));
    out.push(copyTests.find(x => regex.exec(x.path)[1] === 'http'));
    copyTests.forEach(x => {
      if (!['install', 'http', 'unreactive'].includes(regex.exec(x.path)[1])) {
        out.push(x);
      }
    });
    return out;
  }
}

module.exports = CustomSequencer;

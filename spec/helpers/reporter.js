const JasmineConsoleReporter = require('jasmine-console-reporter');

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new JasmineConsoleReporter({
    colors: true, // (0|false)|(1|true)|2
    cleanStack: true, // (0|false)|(1|true)|2|3
    verbosity: 4, // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    // activity: false, // boolean or string ("dots"|"star"|"flip"|"bouncingBar"|...)
    emoji: true,
    beep: true
  })
);

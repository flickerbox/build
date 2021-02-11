/**
 * External requirements
 */
const cliProgress = require('cli-progress');
const path = require('path');
const workerFarm = require('worker-farm');

/**
 * Worker farm setup
 */
let initalBuildProgressBar;
let totalWorkers = 0;
let finishedWorkers = 0;
const workerStats = {};
const filename = path.basename(__filename);
const numberOfCpus = require('os').cpus().length;
const maxConcurrentWorkers = (numberOfCpus - 2 > 0) && numberOfCpus - 2 || 1

const onFinishBuild = (index, stats) => {
  workerStats[index] = workerStats[index] || { finishedFirstBuild: false }

  if (!workerStats[index].finishedFirstBuild) {
    onFinishFirstBuild(index);
  } else if (finishedWorkers === totalWorkers) {
    console.log('Compilation finished\n');
  }
}

const onFinishFirstBuild = (index) => {
  workerStats[index].finishedFirstBuild = true;

  initalBuildProgressBar.increment(1);

  if (finishedWorkers === totalWorkers) {
    console.log('\n\n');
    console.log('Compilation finished\n');
    initalBuildProgressBar.stop();
  }
};

module.exports = ( { watch, ...options }, env ) => {

  let config = options.config;

  if (config[0] !== '/') {
    config = path.normalize(path.join(env.INIT_CWD || env.PWD, config));
  }

  let webpackConfig = require(config);

  if (!Array.isArray(webpackConfig)) {
    webpackConfig = [webpackConfig];
  }

  const workers = workerFarm(
    { maxConcurrentWorkers: options.processes < maxConcurrentWorkers && options.processes || maxConcurrentWorkers },
    require.resolve('../lib/child-worker.js')
  );

  console.log('Compilation starting…\n');

  totalWorkers = webpackConfig.length;

  for (let index = 0; index < totalWorkers; index++) {
    workers({
      index,
      config,
      watch: !!watch,
    }, (error, stats) => {

      ++finishedWorkers;

      if ((!watch && finishedWorkers === totalWorkers) || error) {
        workerFarm.end(workers);
      }

      if (!error) {
        onFinishBuild(index, stats);
      }

    });
  }

  initalBuildProgressBar = new cliProgress.SingleBar({
    format: '{bar}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });
  initalBuildProgressBar.start(totalWorkers, 0);

};
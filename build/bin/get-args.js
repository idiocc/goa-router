const { argufy } = require('../../stdlib');

const argsConfig = {
  'input': {
    description: 'The path to the input file.',
    command: true,
  },
  'output': {
    description: 'Where to save the output. By default prints to stdout.',
    default: '-',
    short: 'o',
  },
  'init': {
    description: 'Initialise in the current folder.',
    boolean: true,
    short: 'i',
  },
  'help': {
    description: 'Print the help information and exit.',
    boolean: true,
    short: 'h',
  },
  'version': {
    description: 'Show the version\'s number and exit.',
    boolean: true,
    short: 'v',
  },
}
const args = argufy(argsConfig)

/**
 * The path to the input file.
 */
const _input = /** @type {string} */ (args['input'])

/**
 * Where to save the output. By default prints to stdout. Default `-`.
 */
const _output = /** @type {string} */ (args['output'] || '-')

/**
 * Initialise in the current folder.
 */
const _init = /** @type {boolean} */ (args['init'])

/**
 * Print the help information and exit.
 */
const _help = /** @type {boolean} */ (args['help'])

/**
 * Show the version's number and exit.
 */
const _version = /** @type {boolean} */ (args['version'])

/**
 * The additional arguments passed to the program.
 */
const _argv = /** @type {!Array<string>} */ (args._argv)

module.exports.argsConfig = argsConfig
module.exports._input = _input
module.exports._output = _output
module.exports._init = _init
module.exports._help = _help
module.exports._version = _version
module.exports._argv = _argv
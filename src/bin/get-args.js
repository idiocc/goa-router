import argufy from 'argufy'

export const argsConfig = {
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
export const _input = /** @type {string} */ (args['input'])

/**
 * Where to save the output. By default prints to stdout. Default `-`.
 */
export const _output = /** @type {string} */ (args['output'] || '-')

/**
 * Initialise in the current folder.
 */
export const _init = /** @type {boolean} */ (args['init'])

/**
 * Print the help information and exit.
 */
export const _help = /** @type {boolean} */ (args['help'])

/**
 * Show the version's number and exit.
 */
export const _version = /** @type {boolean} */ (args['version'])

/**
 * The additional arguments passed to the program.
 */
export const _argv = /** @type {!Array<string>} */ (args._argv)
const { _myNewPackage } = require('./mnp')

/**
 * {{ description }}
 * @param {!_myNewPackage.Config} config Options for the program.
 * @param {boolean} [config.shouldRun=true] A boolean option. Default `true`.
 * @param {string} [config.text] A text to return.
 * @return {Promise<string>}
 */
function myNewPackage(config) {
  return _myNewPackage(config)
}

module.exports = myNewPackage

/* typal types/index.xml namespace */
/**
 * @typedef {_myNewPackage.Config} Config `＠record` Options for the program.
 * @typedef {Object} _myNewPackage.Config `＠record` Options for the program.
 * @prop {boolean} [shouldRun=true] A boolean option. Default `true`.
 * @prop {string} [text] A text to return.
 */

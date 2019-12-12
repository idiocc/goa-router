const { _router } = require('./router')

/**
 * The Router For Creating Middleware For Goa Apps.
 * @param {!_router.Config} config Options for the program.
 * @param {boolean} [config.shouldRun=true] A boolean option. Default `true`.
 * @param {string} [config.text] A text to return.
 * @return {Promise<string>}
 */
function router(config) {
  return _router(config)
}

module.exports = router

/* typal types/index.xml namespace */
/**
 * @typedef {_router.Config} Config `＠record` Options for the program.
 * @typedef {Object} _router.Config `＠record` Options for the program.
 * @prop {boolean} [shouldRun=true] A boolean option. Default `true`.
 * @prop {string} [text] A text to return.
 */

const { _myNewPackage } = require('./mnp')

/**
 * @methodType {_myNewPackage.myNewPackage}
 */
function myNewPackage(config) {
  return _myNewPackage(config)
}

module.exports = myNewPackage

/* typal types/index.xml namespace */

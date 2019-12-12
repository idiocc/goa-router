const { indicatrix } = require('../../../stdlib');

async function Init() {
  const p = new Promise(r => setTimeout(r, 2000))
  await indicatrix('Initialising the package', p)
}

module.exports = Init
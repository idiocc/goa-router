import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import myNewPackage from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof myNewPackage, 'function')
  },
  async 'calls package without error'() {
    await myNewPackage()
  },
  async 'gets a link to the fixture'({ fixture }) {
    const text = fixture`text.txt`
    const res = await myNewPackage({
      text,
    })
    ok(res, text)
  },
}

export default T
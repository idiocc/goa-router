import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import myNewPackage from '../../src'

export default makeTestSuite('test/result/default', {
  async getResults() {
    const res = await myNewPackage({
      text: this.input,
    })
    return res
  },
  context: Context,
})
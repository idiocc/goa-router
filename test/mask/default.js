import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import router from '../../src'

// export default
makeTestSuite('test/result/default', {
  async getResults() {
    const res = await router({
      text: this.input,
    })
    return res
  },
  context: Context,
})
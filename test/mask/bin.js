import makeTestSuite from '@zoroaster/mask'
import Context from '../context'

export default makeTestSuite('test/result/bin', {
  fork: {
    module: Context.BIN,
  },
})
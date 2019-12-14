import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import Router from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof router, 'function')
  },
  async 'shares context between routers'({ startApp, app }) {
    const router1 = new Router()
    const router2 = new Router()

    router1.get('/', (ctx, next) => {
      ctx.foo = 'bar'
      return next()
    })
    router2.get('/', (ctx, next) => {
      ctx.baz = 'qux'
      ctx.body = { foo: ctx.foo }
      return next()
    })

    const mw1 = router1.routes()
    const mw2 = router2.routes()
    app.use(mw1).use(mw2)

    await startApp()
      .get('/')
      .assert(200, { foo: 'bar' })
  },
  // async 'gets a link to the fixture'({ fixture }) {
  //   const text = fixture`text.txt`
  //   const res = await router({
  //     text,
  //   })
  //   ok(res, text)
  // },
}

export default T
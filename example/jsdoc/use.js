import Goa from '@goa/koa'
import Router from '../../src'

const app = new Goa()
const router = new Router()

/* start example */
// session middleware will run before authorize
router
  .use(session())
  .use(authorize())
// use middleware only with given path
router.use('/users', userAuth())
// or with an array of paths
router.use(['/users', '/admin'], userAuth())
app.use(router.routes())
/* end example */
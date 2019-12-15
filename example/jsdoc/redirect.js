import Router from '../../src'

const router = new Router()

/* start example */

router.redirect('/login', 'sign-in')

/// This is equivalent to:

router.all('/login', ctx => {
  ctx.redirect('/sign-in')
  ctx.status = 301
})
/* end example */
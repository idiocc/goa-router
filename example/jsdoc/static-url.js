import Router from '../../src'

/* start example */
const url = Router.url('/users/:id', { id: 1 })
// => "/users/1"
/* end example */

console.log(url)
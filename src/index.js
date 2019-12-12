import { c } from 'erte'

/**
 * The Router For Creating Middleware For Goa Apps.
 * @param {!_router.Config} [config] Options for the program.
 * @param {boolean} [config.shouldRun=true] A boolean option. Default `true`.
 * @param {string} [config.text] A text to return.
 */
export default async function router(config = {}) {
  const {
    shouldRun = true,
    text = '',
  } = config
  if (!shouldRun) return
  console.log('@goa/router called with %s', c(text, 'yellow'))
  return text
}

/**
 * @typedef {import('..').Config} _router.Config
 */

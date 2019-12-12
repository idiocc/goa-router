const { _help, _init, _output, _version, _input, argsConfig } = require('./get-args');
const { reduceUsage } = require('../../stdlib');
const { usually } = require('../../stdlib');
const { readFileSync, writeFileSync } = require('fs');
const { c } = require('../../stdlib');
const Init = require('./commands/init');
const myNewPackage = require('../');

if (_help) {
  const usage = usually({
    description: '{{ description }}',
    example: 'mnp example.txt -o out.txt',
    line: 'mnp input [-o output] [-ihv]',
    usage: reduceUsage(argsConfig),
  })
  console.log(usage)
  process.exit(0)
} else if (_version) {
  console.log(require('../../package.json').version)
  process.exit(0)
}

(async () => {
  try {
    if (_init) return await Init()
    if (!_input) throw new Error('Please pass an input file.')
    const content = /** @type {string} */ (readFileSync(_input, 'utf8'))
    const output = await myNewPackage({
      shouldRun: true,
      text: content,
    })
    if (_output == '-') console.log(output)
    else writeFileSync(_output, output)
    console.error('File %s successfully processed.', c(_input, 'yellow'))
  } catch (err) {
    if (process.env['DEBUG']) console.error(err.stack)
    else console.log(err.message)
  }
})()
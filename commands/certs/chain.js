'use strict'

let co = require('co')
let cli = require('heroku-cli-util')

let error = require('../../lib/error.js')
let readFile = require('../../lib/read_file.js')
let sslDoctor = require('../../lib/ssl_doctor.js')

function * run (context) {
  if (context.args.length === 0) {
    error.exit(1, 'Usage: heroku certs:chain CRT [CRT ...]\nMust specify at least one certificate file.')
  }

  let res = yield context.args.map(function (arg) { return readFile(arg) })

  let body = yield sslDoctor('resolve-chain', res)
  cli.console.writeLog(body)
}

let cmd = {
  command: 'chain',
  description: 'print an ordered & complete chain for a certificate',
  needsApp: true,
  needsAuth: true,
  variableArgs: true,
  run: cli.command(co.wrap(run))
}

module.exports = [
  Object.assign({topic: 'certs'}, cmd),
  Object.assign({topic: '_certs', hidden: true}, cmd)
]


#! /usr/bin/env node
const YZhanTT = require('./lib/YZhanTT.class.js')
const process = require('process')
const argv = process.argv.slice(2)
const width = argv[0] || 80, height = argv[1] || 16
const yzhanTT = new YZhanTT(width, height)
yzhanTT.run()
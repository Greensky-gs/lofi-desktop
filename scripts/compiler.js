const { readdirSync, copyFileSync, existsSync, mkdirSync, lstatSync } = require('node:fs')
const nodePath = require('node:path')

const isDir = path => lstatSync(path).isDirectory()

const getArg = (key, def) => {
    const el = process.argv.find(x => x === key)
    if (!el) return def

    const val = process.argv[process.argv.indexOf(el) + 1] ?? def
    return val
}

const input = getArg('--input', "src")
const output = getArg('--output', 'dist')

const clarify = (path) => path.replace(input, output)

let volatile = 0;

const move = (path) => {
    if (path.endsWith('.js')) return
    copyFileSync(path, clarify(path))

    volatile++
}

const recurs = (path) => {
    if (existsSync(path) && isDir(path)) {
        if (!existsSync(clarify(path))) mkdirSync(clarify(path))
        readdirSync(path).forEach(el => {
            recurs(path + '/' + el)
        })
    } else {
        move(path)
    }
}
const run = (path) => {
    recurs(path)

    console.log(`Compiled \x1b[33m${volatile}\x1b[0m files`)
    volatile = 0
}

if (!isDir(input)) {
    throw new Error(`${input} is not a directory`)
}
if (!existsSync(output)) mkdirSync(output)
if (input === output) {
    throw new Error("Cannot compile into source")
}

run(input)

const process = require('process')
const  { stdout, stdin, exit } = process
const { MENU, TITLE } = require('./config.js')
const Word = require('./Word.class.js')
const Score = require('./Score.class.js')
module.exports = class YZhanTT {
  constructor(width, height) {
    Object.assign(this, {
      width: +width,
      height: +height,
      words: [],
      drawed: false,
      focused: false,
    })
    this.reset()
  }
  reset() {
    this.selectedY = null
    this.words.length = 0
    this.matrix = Array.from({length: this.height}, _ => new Array(this.width).fill(' '))
  }
  drawBorderLine() {
    stdout.write('\x1b[90m+' + '-'.repeat(this.width) + '+\x1b[0m\n')
  }
  draw() {
    const { matrix, height, width, drawed } = this
    if (drawed === true) stdout.write('\x1b[' + (height + 2) + 'A' + '\x1b[' + (width + 2) + 'D')
    else this.drawed = true
    this.drawBorderLine()
    for (let i = 0; i < height; i++) {
      stdout.write('\x1b[90m|\x1b[0m')
      stdout.write(matrix[i].join(''))
      stdout.write('\x1b[90m|\x1b[0m\n')
    }
    this.drawBorderLine()
  }
  initStdin() {
    stdin.setRawMode(true)
    stdin.setEncoding('utf-8')
  }
  pos(ar, { position = 'left', startX = 0, startY = 0, endX = this.width, endY = this.height }) {
    let x = startX,  y = startY, w = ar[0].length, h = ar.length
    if (position == 'center') {
      for (let i = 0; i < h; i++) {
        w = Math.max(w, ar[i].length)
      }
      x += endX - startX - w >> 1, y += endY - startY - h >> 1
    }
    x = Math.max(x, 0)
    y = Math.max(y, 0)
    return {x, y, w, h}
  }
  write(str, { position = 'left', textAlign = 'left', startX = 0, startY = 0, endX = this.width, endY = this.height }) {
    const { matrix, width, height } = this
    const ar = Array.isArray(str) ? str : str.split('\n')
    const {x, y, w, h} = this.pos(ar, { position, startX, startY, endX, endY })
    label: for (let i = 0; i < ar.length; i++) {
      const len = ar[i].length
      for (let j = 0; j < len; j++) {
        const dy = y + i, dx = x + j + (textAlign === 'center' ? w - len >> 1 : 0)
        if (dy === height) break label
        if (dx === width) break
        matrix[dy][dx] = ar[i][j]
      }
    }
    return {x, y, w, h}
  }
  getRowPos(y) {
    const { matrix } = this
    const n = matrix[y].length
    let startX = n, endX = 0
    for (let x = 0; x < n; x++) {
      if (matrix[y][x] === ' ') continue
      startX = Math.min(startX, x)
      endX = Math.max(endX, x)
    }
    return {startX, endX}
  }
  reverseRow(y) {
    const { matrix } = this
    const { startX, endX } = this.getRowPos(y)
    matrix[y][startX] = '\x1b[7m' + matrix[y][startX]
    matrix[y][endX] += '\x1b[0m'
  }
  resetRow(y) {
    const { matrix } = this
    const { startX, endX } = this.getRowPos(y)
    matrix[y][startX] = matrix[y][startX].slice(4)
    matrix[y][endX] = matrix[y][endX].slice(0, -4)
  }
  visit(prop, ...args) {
    return this.visiters[prop] !== void 0 && this.visiters[prop].call(this, ...args)
  }
  focus(visiters) {
    this.visiters = visiters
    this.visit('init')
    if (this.focused == true) return
    this.focused = true
    stdin.on('data', (chunk) => {
      const char = chunk.split('').map((c) => c.charCodeAt(0))
      const len = char.length
      if (len === 1) {
        if (char[0] === 27) this.visit('esc')
        else if (char[0] === 13) this.visit('enter')
        else this.visit('oneKey', char[0])
      } else if (len === 3) {
        if (char[0] === 27 && char[1] === 91) {
          if (char[2] === 65) {
            this.visit('up')
          } else if (char[2] === 66) {
            this.visit('down')
          }
        }
      }
    })
  }
  select(y) {
    if (this.selectedY) this.resetRow(this.selectedY)
    this.reverseRow(this.selectedY = y)
    this.draw()
  }
  title() {
    this.reset()
    const { height } = this
    const { y: ty, h: th } = this.write(TITLE, { position: 'center', startX: 5, endY: height - 3 })
    const { y: my, h: mh } = this.write(MENU, { position: 'center', textAlign: 'center', startY: ty + th })
    let y = my
    this.focus({
      init() {
        return this.select(y)
      },
      esc() {
        exit()
      },
      up() {
        if (--y < my) y = my
        return this.select(y)
      },
      down() {
        if (++y >= my + mh - 1) y = my + mh - 1
        return this.select(y)
      },
      enter() {
        if (y === my) this.start()
        else if (y === my + 1) this.score()
        else exit()
      }
    })
    this.draw()
  }
  start() {
    this.reset()
    const { matrix, width, height, words } = this
    let timer = null, index = 0
    const score = new Score(matrix, width)
    this.focus({
      init() {
        const draw = () => {
          score.run()
          for (let i = words.length; i--;) {
            const word = words[i]
            if (word.run() === false) {
              words[i] = null
              words.splice(i, 1)
              score.write()
              this.score()
              clearInterval(timer)
              timer = null
            }
          }
          if (index++ % 6 === 0) {
            const word = new Word(matrix, width, height)
            if (word.getX() >= width - score.len() - word.len()) {
              word.setY(1)
            }
            words.push(word)
            word.fill()
          }
          this.draw()
        }
        timer = setInterval(draw, 650)
        draw()
      },
      esc() {
        clearInterval(timer)
        timer = null
        score.write()
        this.title()
      },
      oneKey(charCode) {
        const { words } = this
        for (let i = words.length; i--;) {
          if (words[i].type(charCode) == true) {
            score.add(words[i].len())
            score.run()
            words.splice(i, 1)
          }
        }
      }
    })
  }
  score() {
    const { height } = this
    this.reset()
    this.write(Score.read(14), { position: 'center', startX: 5, endY: height })
    this.draw()
    this.focus({
      esc() {
        this.title()
      }
    })
  }
  run() {
    this.initStdin()
    this.title()
  }
}
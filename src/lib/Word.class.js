const wordList = require('word-list-json')
module.exports = class Word {
  constructor(matrix, width, height) {
    const word = wordList[Math.floor(Math.random() * wordList.length)]
    const n = word.length
    Object.assign(this, {
      word,
      x: Math.random() * (width - n) | 0,
      y: 0,
      width,
      height,
      matrix,
      pos: 0,
      n
    })
  }
  run(){
    this.fill(' ')
    if (++this.y == this.height) {
      this.destroy()
      return false
    }
    this.fill()
    return true
  }
  type(charCode) {
    const { pos, word, n } = this
    if (charCode === word.charCodeAt(pos)) this.pos++
    this.fill()
    if (pos === n - 1) {
      this.fill('*')
      setTimeout(() => {
        this.fill(' ')
        this.destroy()
      }, 1500)
      return true
    }
    return false
  }
  fill(content) {
    const { matrix, x: startX, y, word, n, pos } = this
    for (let x = startX; x < startX + n; x++) {
      const index = x - startX
      if (content !== void 0) {
        matrix[y][x] = content
      } else {
        if (index === 0) matrix[y][x] = '\x1b[31m'
        if (index === pos) matrix[y][x] = '\x1b[0m'
        if (matrix[y][x] === ' ') matrix[y][x] = word.charAt(index)
        else matrix[y][x] += word.charAt(index)
        if (index === n - 1 && pos === n) matrix[y][x] += '\x1b[0m'
      }
    }
  }
  len() {
    return this.n
  }
  getX() {
    return this.x
  }
  getY() {
    return this.y
  }
  setX(x) {
    this.x = x
  }
  setY(y) {
    this.y = y
  }
  destroy() {
    this.word = this.x = this.y = this.width = this.height = this.pos = this.n = null
  }
}